---
title: "From kubectl Scripts to GitOps: Why Flux CD Changed How I Think About Deployment"
description: "After building CI/CD pipelines with GitLab CI, Jenkins, and GitHub Actions for years, I thought deployment was just another pipeline step. Then Flux CD showed me the fundamental difference between Push and Pull models—and solved problems I didn't even know I had."
pubDate: 2025-10-11
tags: ["gitops", "flux-cd", "kubernetes", "devops", "ci-cd", "architecture"]
draft: false
readingTime: 11
---

I've built CI/CD pipelines with GitLab CI, Jenkins, and GitHub Actions. Every time, deployment was just another step in the pipeline—a shell script, a `kubectl apply`, maybe a Helm chart.

Then I tried Flux CD. And I realized I'd been thinking about deployment wrong.

## The Traditional Way: Deployment as a Pipeline Step

My journey with CI/CD started with GitLab CI, during a transition from monolithic applications to microservices. The pipelines were complex—multiple repositories with interdependencies—but they all followed the same basic pattern: build, test, deploy.

Early on, we didn't even use Helm. Just hand-written Kubernetes manifests and a straightforward deployment step:

```yaml
# GitLab CI deployment
deploy:
  stage: deploy
  script:
    - kubectl config use-context production
    - kubectl apply -f k8s/deployment.yaml
  only:
    - main
```

The setup was simple: inject a `kubeconfig` into GitLab Runner via CI Variables, and let the pipeline execute `kubectl` commands directly. All environments—dev, staging, production—shared the same kubeconfig with different contexts.

Later, I switched companies and started using Jenkins with Tencent's Coding platform. When we migrated to GitHub, the pipeline moved to GitHub Actions. The tools changed, but the pattern remained the same: CI pipeline builds the artifact, runs tests, then pushes deployment commands to the cluster.

Jenkins had one annoying limitation compared to GitLab CI—it didn't support manual triggers for specific pipeline steps very well. But overall, the approach worked. Commits triggered deployments. Tests passed, code deployed, monitoring confirmed success.

What more could you want?

## The Hidden Problems I Didn't See

Looking back, this "push-based" deployment model had issues I didn't fully appreciate until I encountered Flux CD.

### Problem 1: Too Much Privilege in the Wrong Place

Every CI pipeline needed full cluster credentials. We stored kubeconfigs in GitLab CI Variables and hoped role-based access controls in GitLab would keep them safe.

But think about what this means: anyone who could trigger a pipeline had the keys to production. The CI system needed write access to every environment. If the CI system was compromised, so were our clusters.

We had tried to mitigate this with GitLab's role restrictions, but the core issue remained—we were distributing powerful credentials to a system whose primary job was building code, not managing infrastructure.

### Problem 2: The Network Accessibility Wall

The real limitation revealed itself when I wanted to test the complete deployment flow locally. I was using Orbstack's integrated Kubernetes (looks like Rancher) on my Mac—a perfect environment for rapid iteration.

But here's the problem: my CI pipeline couldn't push to my local cluster. It was on my laptop, behind my home network. There was no way for GitLab CI to reach it.

I tried using frp (Fast Reverse Proxy) to tunnel the connection, but it felt hacky and unreliable. Eventually, I gave up and just manually executed the CI deployment scripts locally.

And it wasn't just my laptop. We had similar issues with customer on-premises environments. They couldn't expose their clusters to our CI system, so we had to VPN in and deploy manually—completely bypassing our automated pipeline.

The Push model had a fundamental requirement: the CI system must be able to reach the cluster. If it can't, you're stuck.

### Problem 3: Three Rollback Strategies and None of Them Good

Our team had three different approaches to rollbacks, and nobody agreed on which was "correct":

1. **Git revert + re-run pipeline** - Proper but slow
2. **Re-run old CI pipeline** - Fast but bypasses Git history
3. **kubectl rollout undo** - Fastest but creates drift from Git

Each approach had problems. Sometimes people would rollback in Kubernetes but forget to revert Git. Other times, someone would re-run an old pipeline while someone else was reverting Git. The confusion was real.

The deeper issue: we had no single source of truth. Was the production state defined by Git? By the last successful pipeline? By whatever was currently running in Kubernetes?

### Problem 4: "What Version Is Actually Running?"

This question came up constantly. When debugging production issues, we needed to know exactly what code was deployed.

The process: `kubectl get deployment -o yaml`, find the image tag, cross-reference with Git commits or CI build logs. Sometimes the image tag didn't match any Git tag because someone had triggered a manual build.

We had Git history, CI logs, and Kubernetes state—three different systems that should have been in sync but often weren't. Keeping them aligned required discipline, and discipline is the first casualty under pressure.

## The Paradigm Shift: Pull-Based GitOps

I'd heard of Flux CD before, but never dug into how it actually worked. While setting up a new project, ChatGPT recommended Flux CD, so I decided to investigate properly.

When I understood the Pull-based model, my first reaction was: **"This is how it should work!"**

Instead of CI pushing changes to clusters, Flux CD runs inside the cluster and pulls changes from Git. The inversion is elegant and solves so many problems at once.

### Setting Up Flux CD

The concepts took some getting used to—GitRepository resources, Kustomizations, reconciliation loops—but the actual setup wasn't complicated:

```yaml
# GitRepository: tells Flux where to watch for changes
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: app-repo
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/yourorg/yourapp
  ref:
    branch: main

---
# Kustomization: tells Flux what to deploy
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: app
  namespace: flux-system
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: app-repo
  path: ./k8s
  prune: true
  wait: true
```

I installed Flux on my local Orbstack Kubernetes cluster and pointed it at my Git repository. Then I pushed a commit with some Kubernetes manifests.

And it just... worked.

Flux detected the new commit, pulled the manifests, applied them to the cluster. No tunnels, no kubeconfigs, no manual scripts. The cluster itself was watching Git and pulling changes.

### The Unexpected Bonus: Local Development Finally Works

Remember the problem with deploying to my local Kubernetes cluster? **Gone.**

Because Flux runs inside the cluster, it doesn't matter where the cluster is. Local laptop? Sure. Customer's on-premises datacenter? No problem. Edge computing node with intermittent connectivity? As long as it can pull from Git, it works.

The network topology flipped. Instead of "CI must reach cluster," it became "cluster must reach Git." And reaching Git is trivial—it's designed to be accessible.

Compared to my previous frp tunneling attempts, this felt effortless. More importantly, it felt **right**. The cluster pulling what it needs is far more natural than some external system pushing commands at it.

### Everything Else Gets Simpler Too

With Flux CD, my CI pipeline transformed from:

```yaml
build → test → deploy (kubectl/helm commands)
```

To:

```yaml
build → test → push (image to registry)
```

The deployment step just... disappeared from CI. Instead:

1. CI builds and pushes the Docker image
2. I update the manifest in Git with the new image tag
3. Flux detects the Git change and updates the cluster
4. Done

Rollbacks? Git revert. No ambiguity, no manual kubectl commands, no wondering which rollback strategy to use.

Version tracking? Check Git. Whatever's in the main branch is what's running. If they're out of sync, Flux will fix it within minutes.

The workflow became simpler, and the CI configuration became cleaner.

## Beyond the Mechanics: GitOps as a Philosophy

The technical difference between Push and Pull is easy to see. But the real insight is about how we think about deployment itself.

### Permission Convergence

The Push model's fundamental problem isn't just network accessibility—it's **excessive privileges in the wrong place**.

In the Push model, CI needs write access to production. It needs credentials that, if leaked, could destroy your infrastructure. The CI system becomes a high-value target.

In the Pull model, CI only needs access to the image registry. Flux, running in the cluster with minimal service account permissions, handles the actual deployment. **Privilege converges to where it's actually needed.**

Everyone on the team needs image registry access anyway (to pull images for local development). But only Flux needs cluster write access—and Flux runs inside the cluster, not in some external CI system.

This isn't a minor security improvement. It's a significant reduction in attack surface.

### Declarative vs Imperative: Lowering Cognitive Load

From a results perspective, `kubectl apply` and Flux CD achieve the same thing—they update resources in Kubernetes. So why does the declarative approach feel different?

**It's about mental models.**

With imperative deployment:

```bash
# "Execute these actions"
kubectl set image deployment/app app=v2.0
kubectl rollout status deployment/app
# Did it work? Let me check...
kubectl get pods
```

You're thinking in operations: "do this, then check that, then verify the other thing." You're responsible for sequencing, error handling, verification.

With declarative deployment:

```yaml
# "This is what should exist"
spec:
  containers:
    - name: app
      image: app:v2.0
```

You're thinking in states: "this is what I want." The system figures out how to get there and continuously ensures it stays there. You've offloaded the cognitive burden of the "how" to Flux.

This mental shift reduces cognitive load. I don't think about deployment steps anymore. I think about desired states.

### Git as Single Source of Truth

In the Push model, Git is a trigger. A commit starts the deployment process, but Git doesn't define the actual running state—it merely initiates the pipeline that creates that state.

In the Pull model, Git is the definition. The Kubernetes cluster continuously reconciles itself to match what's in Git.

This solves multiple problems simultaneously:

- **Auditing**: Every change has a Git commit with author, timestamp, and diff
- **Rollback**: Git revert is the rollback mechanism
- **Collaboration**: Pull requests become the deployment approval process
- **Disaster recovery**: Recreate entire environments from Git

You don't need separate systems for these concerns. Git already handles versioning, auditing, and collaboration. GitOps extends these properties to infrastructure.

### Continuous Reconciliation: Preventing Configuration Drift

Flux doesn't deploy once and forget. It continuously watches both Git and the cluster, reconciling them every few minutes.

If someone manually changes a deployment (say, scales up replicas via `kubectl scale`), Flux will change it back. This might seem restrictive, but it **enforces that all configuration changes go through Git**.

I've hit this problem before: a fix works in development, but fails in production because someone manually tweaked production config and forgot to commit it. With Flux, that scenario is impossible. If the change isn't in Git, it won't persist.

This "self-healing" behavior is a feature, not a bug. It prevents configuration drift and ensures that Git remains the source of truth.

## What This Means for Infrastructure as Code

I've been practicing Infrastructure as Code for years. Writing Kubernetes manifests, storing them in Git, applying them via CI—that's IaC, right?

After using Flux CD, I realize: **that was only half of IaC.**

The "Code" part was there—infrastructure defined in files. But the "as" part was missing. Git defined what infrastructure should exist, but it didn't enforce it. The actual state could drift, and Git wouldn't know or care.

GitOps completes the loop. Git doesn't just describe infrastructure—it actively maintains it. The code isn't just a blueprint; it's the running system.

This is what IaC should be. Not just "we have YAML files in Git," but "our infrastructure continuously reconciles to match what's in Git."

## When Should You Make the Switch?

Not every project needs GitOps. But if you're running Kubernetes, I'd argue you should seriously consider Flux CD, especially for small teams.

**You should use Flux CD if:**

- You're already using Kubernetes (Flux is Kubernetes-native)
- You want simpler CI pipelines (remove deployment logic from CI)
- You care about security (minimize credential distribution)
- You need to deploy to hard-to-reach clusters (local, on-prem, edge)
- You want Git to be the actual source of truth, not just a storage location

**When to migrate:**

- **New projects**: Start with Flux CD from day one
- **Existing projects**: Gradual migration works fine—you can run Flux alongside manual deployments

The main challenge is the learning curve—understanding GitRepository, Kustomization, HelmRelease resources, and how reconciliation works. But it's not a steep curve, and the existing CI pipelines remain compatible (you're mostly removing deployment steps, not rewriting everything).

**Common misconceptions:**

- "GitOps is complex" - Actually, it simplifies CI by removing deployment logic
- "I need to rewrite all my pipelines" - No, you mostly remove steps
- "It only works for big teams" - Small teams benefit even more from reduced complexity

My recommendation: if you're building something new with Kubernetes, just start with Flux CD. If you're maintaining existing projects and the current approach works, migrate gradually. But if you're hitting any of the problems I described—credential management, network accessibility, state drift—GitOps might be exactly what you need.

## The Bigger Picture

I started this journey thinking Flux CD was just another deployment tool. What I found was a fundamental shift in how deployment should work.

The Push model isn't wrong—it addresses one problem well but creates new ones. It solves "how do I get code from Git to production," but it creates new problems around security, network topology, and state management.

The Pull model inverts the relationship. Instead of external systems commanding the cluster, the cluster pulls what it needs. This inversion solves entire categories of problems that the Push model struggles with.

But more importantly, it changes how we think about deployment. Not as an operation to execute, but as a state to maintain. Not as a one-time push, but as a continuous reconciliation.

Deployment isn't just "putting artifacts into environments and making them available."

**It's about continuously ensuring the running system matches the desired state defined in Git.**

The real lesson isn't about Flux CD specifically—it's about questioning assumptions. Sometimes the way we've always done things isn't wrong, it's just... not the full picture. And sometimes, inverting the model reveals a better path forward.

If you've been deploying with kubectl scripts and CI pipelines for years, I encourage you to try Flux CD. Not because it's trendy, but because it might change how you think about deployment—just like it did for me.

---

_If you're interested in other architectural shifts in DevOps tooling, check out [Why I Built Sealbox](/thoughts/why-i-built-sealbox) for insights on rethinking secret management, or explore [Building Zero-Trust Secret Management](/thoughts/zero-trust-secret-management-design-decisions) for a deep dive into security-first architectural decisions._
