---
title: "Why I Built Sealbox"
description: "How a simple need for secret storage led to building a Rust-based alternative to enterprise secret management solutions."
pubDate: 2025-07-19
tags: ["rust", "security", "development", "tools"]
featured: true
---

I needed to store API keys for a side project. Simple requirement, right?

After spending an afternoon trying to set up HashiCorp Vault for what should have been a five-minute task, I realized the secret management ecosystem had a problem: everything was designed for enterprises, not developers.

## The Enterprise Tax

Most secret management solutions—Vault, AWS Secrets Manager, GCP Secret Manager—are powerful. They're also complex, over-engineered, and deeply cloud-integrated. They assume you need dynamic database credentials, complex access policies, and multi-region replication.

But what if you just want to store some API keys securely?

## What I Actually Needed

Looking at my use cases, the requirements were straightforward:

- Store secrets securely (obviously)
- Use them in CI/CD pipelines
- Share them with small teams
- Deploy anywhere without cloud dependencies
- Single binary, minimal configuration

No dynamic credentials. No complex policies. No clustering. Just secure, predictable secret storage.

## The Design

Sealbox is built around one core insight: most developers need 90% less complexity for 100% of their secret management needs.

### Encryption Architecture

I designed Sealbox with end-to-end encryption as the foundation:

- Each user generates a public/private key pair
- Every secret gets encrypted with a unique data key
- Data keys are encrypted with the user's public key
- Only the user can decrypt with their private key

This means Sealbox never sees plaintext secrets. Even if someone compromises the server, they get encrypted blobs without the keys to decrypt them.

### SQLite as a Feature

Instead of requiring PostgreSQL or MongoDB, Sealbox uses embedded SQLite. This isn't a compromise—it's a feature. SQLite means:

- Zero database setup
- Atomic operations by default
- Predictable performance
- Easy backups (just copy a file)

For most secret management use cases, SQLite is more than sufficient.

## What I Learned

Building Sealbox taught me that constraints enable clarity. By explicitly not supporting enterprise features, I could focus on making the core experience exceptional.

Every design decision started with: "What would I want if I just needed to store some secrets?"

The result is a single Rust binary that handles encryption, storage, and API access. No configuration files. No external dependencies. No surprises.

## The 90% Solution

Sealbox doesn't aim to replace Vault. It aims to be the 90% simpler alternative when you don't need dynamic database credentials or secret leasing—but still want safe, verifiable secret storage.

Sometimes the most valuable thing you can build is something that gets out of the way.

If you're tired of fighting enterprise tools for simple problems, [check out Sealbox](https://github.com/realmorrisliu/sealbox). It might be exactly what you didn't know you needed.
