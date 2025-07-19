---
title: "Rust Type-Driven APIs"
description: "Exploring how Rust's type system can guide API design for better safety and clarity, with practical examples from real-world applications."
pubDate: 2025-01-10
tags: ["rust", "api-design", "types"]
---

# Rust Type-Driven APIs

Type systems aren't just for catching bugs—they're for expressing intent. When designing APIs in Rust, the type system becomes your most powerful tool for creating interfaces that are both safe and intuitive.

## Beyond Error Handling

Most discussions about Rust APIs focus on `Result<T, E>` and error handling. That's important, but it's just the beginning. The real power comes from using types to make invalid states unrepresentable.

```rust
// Instead of this
pub fn process_data(data: String, mode: String) -> Result<String, Error> {
    match mode.as_str() {
        "strict" => process_strict(data),
        "lenient" => process_lenient(data),
        _ => Err(Error::InvalidMode),
    }
}

// Write this
pub enum ProcessMode {
    Strict,
    Lenient,
}

pub fn process_data(data: String, mode: ProcessMode) -> Result<String, Error> {
    match mode {
        ProcessMode::Strict => process_strict(data),
        ProcessMode::Lenient => process_lenient(data),
    }
}
```

## Making States Explicit

The type system can encode your application's state machine directly:

```rust
pub struct Draft {
    content: String,
}

pub struct Published {
    content: String,
    published_at: DateTime<Utc>,
}

pub struct Archived {
    content: String,
    published_at: DateTime<Utc>,
    archived_at: DateTime<Utc>,
}

impl Draft {
    pub fn publish(self) -> Published {
        Published {
            content: self.content,
            published_at: Utc::now(),
        }
    }
}

impl Published {
    pub fn archive(self) -> Archived {
        Archived {
            content: self.content,
            published_at: self.published_at,
            archived_at: Utc::now(),
        }
    }
}
```

## The Principle

When you can't compile invalid usage, you don't need to document it. The type system becomes living documentation that stays in sync with your code.

This isn't just about preventing bugs—it's about creating APIs that guide users toward correct usage naturally. The types tell the story of how your system works.

## In Practice

I've found that spending time upfront on type design pays dividends throughout the project's lifecycle. Changes that would break usage patterns become compile-time errors rather than runtime surprises.

The best APIs feel inevitable once you understand the problem. Rust's type system helps you build that inevitability into the interface itself.