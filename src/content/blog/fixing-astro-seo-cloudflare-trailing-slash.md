---
title: "Fixing Astro SEO on Cloudflare Pages: Why trailingSlash Doesn't Work (and What Does)"
description: "Deployed your Astro site on Cloudflare Pages only to discover mysterious 308 redirects killing your SEO? I spent hours chasing the wrong solution. Here's what actually fixes the trailing slash problem and why Astro's trailingSlash config won't help you."
pubDate: 2025-08-13
tags: ["astro", "seo", "web-development", "cloudflare", "devops"]
featured: false
author: "Morris Liu"
readingTime: 5
---

My Google Search Console lit up with warnings the week after I deployed my Astro site to Cloudflare Pages.

"Redirect chains detected." "308 permanent redirects found." "Page indexing affected."

What should have been a simple static site deployment had turned into an SEO nightmare. Every URL was getting automatically redirected from `/blog/my-article` to `/blog/my-article/`, creating unnecessary redirect chains that Google definitely wasn't happy about.

Sound familiar? You're not alone—this [community thread](https://community.cloudflare.com/t/removing-trailing-slash-on-static-websites/583429) shows plenty of developers hitting the same wall.

## The Cloudflare Pages Behavior

Here's what happens when you deploy an Astro site to Cloudflare Pages with default settings:

Cloudflare automatically serves your static files, but it also tries to be helpful. According to [Cloudflare's documentation](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching), when someone visits `/about`, Cloudflare looks for `/about.html`. If it doesn't find that exact file but finds `/about/index.html` instead, it redirects the user to `/about/` with a trailing slash.

The intent is good—make URLs consistent and avoid 404s. The reality is different. These 308 redirects create extra hops that:

- Slow down page loads
- Confuse search engines about your canonical URLs
- Split link equity between redirect chains
- Generate SEO warnings in Search Console

For a blog or marketing site, this is the opposite of what you want.

## The Obvious (Wrong) Solution

When I discovered this problem, the first thing I did was dive into [Astro's documentation](https://docs.astro.build/en/reference/configuration-reference/#trailingslash). There it was: the `trailingSlash` configuration option.

```javascript
// astro.config.mjs
export default defineConfig({
  trailingSlash: "never", // This should fix it, right?
});
```

Perfect! Set it to `'never'` and Cloudflare will stop adding trailing slashes.

Except it doesn't work.

After rebuilding and redeploying, the same redirects kept happening. URLs still got trailing slashes added automatically. The 308s persisted.

Reading deeper into Astro's docs revealed why:

> "Trailing slashes on prerendered pages are handled by the hosting platform, and may not respect your chosen configuration."

Translation: Astro's `trailingSlash` setting only affects development and server-rendered pages. For static sites deployed to hosting platforms like Cloudflare Pages, the platform itself controls URL behavior.

The configuration that seemed like the obvious solution was completely irrelevant to my problem.

## What Actually Works

The real solution isn't about trailing slashes at all—it's about file structure.

Astro's [`build.format` configuration](https://docs.astro.build/en/reference/configuration-reference/#buildformat) determines how your pages get generated:

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    format: "file", // Generate page.html instead of page/index.html
  },
  trailingSlash: "never", // Now this makes sense together
});
```

With `format: 'file'`, Astro generates:

- `/about.html` instead of `/about/index.html`
- `/blog/my-article.html` instead of `/blog/my-article/index.html`

When Cloudflare Pages sees a request for `/about`, it finds `/about.html` directly—no redirect needed.

The `trailingSlash: 'never'` setting becomes relevant again because it ensures your development server behavior matches production. Without it, `Astro.url.pathname` in development would include trailing slashes, but production URLs wouldn't, creating inconsistencies.

## The Complete Fix

Here's what you need to change in your `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";

export default defineConfig({
  build: {
    format: "file", // This is the key change
  },
  trailingSlash: "never", // This ensures dev/prod consistency
  // ... your other config
});
```

But that's not all. You'll also need to audit your site for:

**Internal Links**: Make sure they don't include trailing slashes

```html
<!-- Before -->
<a href="/about/">About</a>
<!-- After -->
<a href="/about">About</a>
```

**Redirect Rules**: Update any `_redirects` file entries

```
# Before
/old-page/ /new-page/ 301
# After
/old-page /new-page 301
```

**Canonical URLs**: Verify your canonical tags don't include trailing slashes

## Testing the Fix

After deploying these changes, I used a few methods to verify everything worked:

1. **Direct URL tests**: Visit pages directly to ensure no redirects
2. **Search Console**: Monitor for new redirect warnings (they should disappear)
3. **Browser dev tools**: Check the Network tab for 3xx responses
4. **SEO tools**: Use tools like Screaming Frog to crawl your site

The results were immediate. No more 308 redirects. No more Search Console warnings. Clean, direct URLs that load fast and make search engines happy.

## What I Learned

This problem taught me an important lesson about static site hosting: framework configuration and hosting platform behavior are two different things.

Astro can generate your files however you want, but once they're deployed, the hosting platform's URL handling takes over. Understanding your hosting platform's behavior is just as important as understanding your framework's configuration.

The `trailingSlash` configuration isn't useless—it's just solving a different problem than I initially thought. It affects development servers and dynamically rendered pages. For static sites, file structure matters more than URL configuration.

## The Bigger Picture

This issue highlights a broader challenge with static site deployment: the assumptions your build tool makes might not match your hosting platform's behavior.

Before deploying any static site, it's worth understanding:

- How your hosting platform handles file serving
- Whether it performs automatic redirects
- How those redirects might affect SEO
- What file structures work best for your use case

Sometimes the best solution isn't the most obvious one. Sometimes you need to think about the problem from the hosting platform's perspective, not just the framework's.

If you're struggling with similar redirect issues on Astro + Cloudflare Pages, try the `build.format` approach. It might save you the hours of documentation diving I went through.

---

_Want to see more posts about web development and technical problem-solving? Check out [The Evolution of Rust's Builder Pattern](/thoughts/rust-builder-pattern-evolution), where I explore how API design patterns evolve to solve real developer pain points._
