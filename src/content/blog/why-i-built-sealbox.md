---
title: "Why I Built Sealbox: A Developer-First Secret Management Tool in Rust"
description: "After struggling with HashiCorp Vault's complexity for a simple API key storage task, I built Sealbox—a lightweight, single-binary secret manager in Rust with end-to-end encryption, SQLite storage, and zero cloud dependencies. Here's the story and technical decisions behind it."
pubDate: 2025-07-19
updatedDate: 2025-07-22
tags:
  [
    "rust",
    "security",
    "devops",
    "secret-management",
    "open-source",
    "encryption",
    "sqlite",
    "developer-tools",
  ]
featured: true
author: "Morris Liu"
readingTime: 4
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

---

_If you enjoyed this story about building developer-first tools, you might also be interested in [Building Kira: An AI-Native Second Brain](/thoughts/building-kira-an-ai-native-second-brain), where I explore similar principles applied to knowledge management._
