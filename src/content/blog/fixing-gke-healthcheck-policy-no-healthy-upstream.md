---
title: "GKE Gateway API: Fix 'No Healthy Upstream' Error"
description: "Production down with 'no healthy upstream' but staging works? Your GKE Gateway API health check is misconfigured. Step-by-step fix inside."
pubDate: 2025-11-11
tags: ["gke", "gateway-api", "kubernetes", "healthcheck"]
---

## Quick Diagnostic Checklist

If you're seeing "no healthy upstream" in GKE Gateway API, check in order:

1. ✅ Are pods ready? → `kubectl get pods`
2. ✅ Do endpoints exist? → `kubectl get endpoints`
3. ✅ Is HTTPRoute accepted? → `kubectl describe httproute`
4. ⚠️ **Does HealthCheckPolicy exist?** → `kubectl get healthcheckpolicy`
5. ⚠️ **Does `requestPath` match your app's health endpoint?**
6. 🔍 Check GCP Console → Load Balancer backend health

**Most common cause:** Missing or misconfigured HealthCheckPolicy. [Jump to the fix →](#the-fix-move-it-to-helm)

---

Staging works. Production returns "no healthy upstream."

Same Helm chart. Same configuration. Same cluster. The only difference? Domain names.

I spent three hours staring at identical YAML files before I realized the problem wasn't in the manifests—it was in what **wasn't there**.

## Production Error: "No Healthy Upstream"

_Note: Domain names and IP addresses shown below have been anonymized. All technical details are from actual production troubleshooting._

Here's what made this particularly confusing:

```bash
# Production fails
$ curl https://app.example.com
no healthy upstream

# Staging works perfectly
$ curl https://staging.example.com
HTTP/1.1 200 OK
```

Both environments use the same Helm chart. The HelmRelease configs differ by exactly one line:

```yaml
# Staging (myapp-staging namespace)
gateway:
  web:
    hostname: staging.example.com

# Production (myapp namespace)
gateway:
  web:
    hostname: app.example.com
```

Everything else—Services, Deployments, HTTPRoutes—identical. What was I missing?

## Diagnosing the Load Balancer Health Check

First, check the obvious things:

```bash
$ kubectl get pods -n myapp
NAME                      READY   STATUS    RESTARTS   AGE
myapp-web-7b5f8d9c-abc12  1/1     Running   0          2h
myapp-web-7b5f8d9c-def34  1/1     Running   0          2h
myapp-web-7b5f8d9c-ghi56  1/1     Running   0          2h
```

All pods healthy. Readiness probes passing. Endpoints populated:

```bash
$ kubectl get endpoints myapp-web -n myapp
NAME         ENDPOINTS                                           AGE
myapp-web    192.0.2.15:3000,192.0.2.23:3000,192.0.2.31:3000    2h
```

HTTPRoute accepted by the Gateway. Everything looked **perfect** at the Kubernetes level.

But the load balancer? It thought everything was dead.

## Root Cause: Missing HealthCheckPolicy

Then I checked something I should have checked first:

```bash
# Production environment
$ kubectl get healthcheckpolicy -n myapp
No resources found in myapp namespace.

# Staging environment
$ kubectl get healthcheckpolicy -n myapp-staging
NAME              AGE
myapp-web-hc      7d
```

Wait. **Why does staging have a HealthCheckPolicy and production doesn't?**

More importantly: why would that cause "no healthy upstream"?

## Gateway API's Silent Trap

Here's the thing about GKE Gateway API that I wish I'd known earlier: **it doesn't infer health check parameters from your pod's readiness probes**.

Ingress does this automatically. Gateway API doesn't.

When you create an HTTPRoute, GKE creates a default health check for the backend:

```yaml
# Default health check (implicit, created by GKE)
Request Path: / # Always the root path
Port: 3000 # From your Service
Check Interval: 15s
```

My app's actual health check endpoint:

```yaml
# Pod readiness probe
readinessProbe:
  httpGet:
    path: /api/health # Not the root path
    port: 3000
```

See the problem?

- **Kubernetes** checks `/api/health` → ✅ Pod ready
- **Load balancer** checks `/` → ❌ 404 Not Found → Unhealthy

The pods are healthy. The load balancer thinks they're all dead. "No healthy upstream."

## Why Staging Worked

Months ago, I hit this same issue in staging. I created a HealthCheckPolicy to fix it:

```yaml
apiVersion: networking.gke.io/v1
kind: HealthCheckPolicy
metadata:
  name: myapp-web-hc
  namespace: myapp-staging # Hardcoded namespace
spec:
  targetRef:
    kind: Service
    name: myapp-web
  default:
    config:
      type: HTTP
      httpHealthCheck:
        port: 3000
        requestPath: /api/health # Tell the LB the correct path
```

This fixed staging. I moved on.

When deploying production weeks later, I forgot to create the same resource. The problem reappeared.

## The Real Problem

But wait. This isn't just about forgetting to create a resource. It's an **architecture problem**.

Look at where HealthCheckPolicy lived in my [GitOps repo](/thoughts/from-kubectl-to-gitops-flux-cd):

```yaml
# myapp-gitops/clusters/production/manifests/healthcheck.yaml
apiVersion: networking.gke.io/v1
kind: HealthCheckPolicy
metadata:
  name: myapp-web-hc
  namespace: myapp-staging # Hardcoded!
spec:
  targetRef:
    kind: Service
    name: myapp-web
  default:
    config:
      type: HTTP
      httpHealthCheck:
        port: 3000
        requestPath: /api/health
```

A static manifest file. With a hardcoded namespace.

Now compare this to how other Gateway resources are organized:

| Resource          | Location    | Parameterized? |
| ----------------- | ----------- | -------------- |
| HTTPRoute         | Helm Chart  | ✅ Yes         |
| Service           | Helm Chart  | ✅ Yes         |
| HealthCheckPolicy | Static YAML | ❌ No          |
| Gateway           | Static YAML | ❌ No (shared) |

HTTPRoute lives in the Helm chart. It uses `{{ .Values.gateway.hostname }}` and `{{ include "myapp.fullname" . }}` to adapt to different environments.

HealthCheckPolicy doesn't. It's a static file I created once for staging, then forgot to duplicate for production.

**If HealthCheckPolicy is required for the app to work, why isn't it part of the Helm chart?**

## The Fix: Move It to Helm

The solution is simple: treat HealthCheckPolicy like any other app-specific resource.

### Create a Helm Template

`charts/myapp/templates/gateway/healthcheck.yaml`:

```yaml
{{- if .Values.gateway.web.healthCheck.enabled }}
apiVersion: networking.gke.io/v1
kind: HealthCheckPolicy
metadata:
  name: {{ include "myapp.fullname" . }}-web-hc
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
spec:
  targetRef:
    kind: Service
    name: {{ include "myapp.fullname" . }}-web
  default:
    checkIntervalSec: {{ .Values.gateway.web.healthCheck.checkIntervalSec }}
    timeoutSec: {{ .Values.gateway.web.healthCheck.timeoutSec }}
    config:
      type: HTTP
      httpHealthCheck:
        port: {{ .Values.web.service.port }}
        requestPath: {{ .Values.gateway.web.healthCheck.requestPath }}
{{- end }}
```

Key improvements:

- **Service name** auto-generated from `{{ include "myapp.fullname" . }}`
- **Namespace** automatically uses `{{ .Release.Namespace }}`
- **All parameters** configurable via values

### Add Default Values

`charts/myapp/values.yaml`:

```yaml
gateway:
  web:
    healthCheck:
      enabled: true
      requestPath: /api/health
      checkIntervalSec: 5
      timeoutSec: 5
```

### Environment-Specific Overrides

Production can use stricter thresholds:

```yaml
# myapp-gitops/clusters/prod/myapp.yaml
gateway:
  web:
    hostname: app.example.com
    healthCheck:
      checkIntervalSec: 5
      unhealthyThreshold: 2 # Fail fast
```

Staging can be more forgiving:

```yaml
# myapp-gitops/clusters/staging/myapp.yaml
gateway:
  web:
    hostname: staging.example.com
    healthCheck:
      checkIntervalSec: 10
      unhealthyThreshold: 3 # More tolerance
```

### Delete the Static Manifest

```bash
rm myapp-gitops/clusters/production/manifests/healthcheck.yaml
```

## Verification

After deploying the changes via FluxCD:

```bash
$ kubectl get healthcheckpolicy -n myapp
NAME              AGE
myapp-web-hc      2m  # Created automatically!

$ kubectl describe healthcheckpolicy myapp-web-hc -n myapp
spec:
  targetRef:
    kind: Service
    name: myapp-web  # Correct service, auto-generated
  default:
    config:
      httpHealthCheck:
        port: 3000
        requestPath: /api/health  # Correct path
```

Wait 5-10 minutes for the load balancer to update its health check config. Then:

```bash
$ curl https://app.example.com
HTTP/1.1 200 OK
```

**Production is back.**

## What Changed

| Aspect            | Before (Static)       | After (Helm)               |
| ----------------- | --------------------- | -------------------------- |
| **Location**      | GitOps manifests      | Helm chart templates       |
| **Namespace**     | Hardcoded             | `{{ .Release.Namespace }}` |
| **Service Name**  | Hardcoded             | Auto-generated             |
| **Multi-env**     | ❌ Manual duplication | ✅ One template, all envs  |
| **Parameterized** | ❌ Static YAML        | ✅ Values-driven           |
| **Maintenance**   | High (copy-paste)     | Low (single template)      |

## Lessons Learned

**1. Gateway API doesn't infer health checks**

Unlike [traditional Ingress controllers](/thoughts/fix-ingress-nginx-snippet-annotation-errors), Gateway API won't look at your readiness probes. It defaults to checking `/` on port 80. If your app uses a custom health endpoint, you **must** configure HealthCheckPolicy.

**2. Architecture matters more than configuration**

This wasn't a typo or a missing YAML field. It was a **design flaw**. HealthCheckPolicy was required for the app to work but lived outside the app's chart. That's a recipe for failures.

**3. Keep related resources together**

HTTPRoute, Service, and HealthCheckPolicy are all app-specific. They should all live in the Helm chart, parameterized the same way.

**4. Automation beats memory**

Relying on memory to duplicate static files for each environment is error-prone. If a resource is required, make it automatic.

## Debugging "No Healthy Upstream"

If you hit this error, check in order:

1. ✅ Are pods ready? → `kubectl get pods`
2. ✅ Do endpoints exist? → `kubectl get endpoints`
3. ✅ Is HTTPRoute accepted? → `kubectl describe httproute`
4. ⚠️ **Does HealthCheckPolicy exist?** → `kubectl get healthcheckpolicy`
5. ⚠️ **Does `requestPath` match your app's health endpoint?**
6. 🔍 Check GCP Console → Load Balancer backend health

## Related Resources

- [Configure Gateway resources using Policies - GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/configure-gateway-resources)
- [GKE Gateway API Health Checks - Official Docs](https://cloud.google.com/kubernetes-engine/docs/how-to/deploying-gateways#no-healthy-upstream)
- [Kubernetes Gateway API Specification](https://gateway-api.sigs.k8s.io/)
- [Helm Best Practices - Values Files](https://helm.sh/docs/chart_best_practices/values/)
- [GKE Gateway API vs Ingress - Migration Guide](https://cloud.google.com/kubernetes-engine/docs/how-to/gatewayclass-capabilities)

---

**A well-designed architecture prevents mistakes you'd otherwise make.** A flawed architecture might work today, but it'll bite you when you scale.

---

_If you're curious about the GitOps architecture that makes Helm deployments automatic across environments, read [From kubectl Scripts to GitOps: Why Flux CD Changed How I Think About Deployment](/thoughts/from-kubectl-to-gitops-flux-cd). For more Kubernetes troubleshooting insights, check out [Fix ingress-nginx Snippet Annotation Errors After 1.9 Upgrade](/thoughts/fix-ingress-nginx-snippet-annotation-errors) to see similar configuration pitfalls._
