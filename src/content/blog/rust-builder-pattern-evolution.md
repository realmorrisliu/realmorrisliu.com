---
title: "Rust Builder Pattern Guide: derive_builder vs Hand-Written Constructors"
description: "Learn Rust builder pattern with derive_builder crate. Step-by-step tutorial from complex constructors to clean API design. Includes real code examples and best practices."
pubDate: 2025-08-06
tags: ["rust", "api-design", "builder-pattern", "sdk"]
draft: false
---

Building openrouter-rs started simply enough. A few request structs, some HTTP calls, done. But AI APIs are... thorough. OpenRouter's chat completion endpoint supports reasoning tokens, tool calling, response formatting, streaming options, and about twenty other parameters.

So I did what seemed reasonable: put them all in a constructor function.

```rust
impl ChatCompletionRequest {
    pub fn new(
        model: String,
        messages: Vec<Message>,
        frequency_penalty: Option<f64>,
        logit_bias: Option<HashMap<String, f64>>,
        logprobs: Option<bool>,
        top_logprobs: Option<i32>,
        max_completion_tokens: Option<i32>,
        max_tokens: Option<i32>,
        n: Option<i32>,
        presence_penalty: Option<f64>,
        response_format: Option<ResponseFormat>,
        seed: Option<i64>,
        service_tier: Option<ServiceTier>,
        stop: Option<StopSequence>,
        stream: Option<bool>,
        stream_options: Option<StreamOptions>,
        temperature: Option<f64>,
        tool_choice: Option<ToolChoice>,
        tools: Option<Vec<Tool>>,
        top_p: Option<f64>,
        user: Option<String>,
        reasoning_effort: Option<Effort>,
        modalities: Option<Vec<String>>,
    ) -> Self {
        // ...
    }
}
```

Twenty-three parameters. And that was just the beginning—every time OpenRouter added a new feature, I'd be back here adding another line.

This is the story of how I learned that sometimes the obvious solution is wrong, and why Rust's builder pattern turned out to be exactly what I needed.

## The Constructor Nightmare

Using this constructor felt like filling out the world's most tedious tax form:

```rust
let request = ChatCompletionRequest::new(
    "anthropic/claude-sonnet-4".to_string(),
    vec![Message::new(Role::User, "Hello".to_string())],
    None,    // frequency_penalty
    None,    // logit_bias
    None,    // logprobs
    None,    // top_logprobs
    None,    // max_completion_tokens
    Some(100), // max_tokens
    None,    // n
    None,    // presence_penalty
    None,    // response_format
    None,    // seed
    None,    // service_tier
    None,    // stop
    None,    // stream
    None,    // stream_options
    Some(0.7), // temperature
    None,    // tool_choice
    None,    // tools
    None,    // top_p
    None,    // user
    Some(Effort::High), // reasoning_effort
    None,    // modalities
);
```

Look at all those `None`s. It's like a monument to poor API design. And God forbid you want to add a new parameter—every single callsite breaks.

But the real kicker? You have to remember the exact parameter order. Miss one, and suddenly your temperature is being passed as max_tokens. The compiler can't save you from logical errors in parameter ordering.

## Enter the Builder Pattern

I'd heard about builder patterns before, mostly in the Java world where everything needs to be abstracted seven layers deep. But in Rust? Maybe it could actually be... pleasant?

My first instinct was to write my own builder. How hard could it be? Just a struct with optional fields and some setter methods:

```rust
#[derive(Default)]
pub struct ChatCompletionRequestBuilder {
    model: Option<String>,
    messages: Option<Vec<Message>>,
    stream: Option<bool>,
    max_tokens: Option<u32>,
    temperature: Option<f64>,
    seed: Option<u32>,
    // ... 17 more Option<T> fields
}

impl ChatCompletionRequestBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn model(mut self, model: String) -> Self {
        self.model = Some(model);
        self
    }

    pub fn messages(mut self, messages: Vec<Message>) -> Self {
        self.messages = Some(messages);
        self
    }

    // ... 20 more nearly identical setter methods

    pub fn build(self) -> Result<ChatCompletionRequest, OpenRouterError> {
        Ok(ChatCompletionRequest {
            model: self.model.ok_or(OpenRouterError::Validation("model is required".into()))?,
            messages: self.messages.ok_or(OpenRouterError::Validation("messages are required".into()))?,
            stream: self.stream,
            max_tokens: self.max_tokens,
            temperature: self.temperature,
            // ... 18 more field assignments
        })
    }
}
```

It worked! The API was immediately more pleasant to use:

```rust
let request = ChatCompletionRequest::builder()
    .model("anthropic/claude-sonnet-4".to_string())
    .messages(vec![Message::new(Role::User, "Hello".to_string())])
    .temperature(0.7)
    .max_tokens(100)
    .build()?;
```

No more `None`s everywhere. Named parameters. Order independence. I felt pretty clever.

## The Hand-Written Reality Check

Then I realized I needed builders for `CompletionRequest` too. And `CoinbaseChargeRequest`. And the client configuration. Each one meant another 50+ lines of nearly identical boilerplate.

I tried to be smart about it with a macro:

```rust
macro_rules! setter {
    ($field:ident, $field_type:ty) => {
        pub fn $field(mut self, $field: $field_type) -> Self {
            self.$field = Some($field);
            self
        }
    };
}

impl ChatCompletionRequestBuilder {
    setter!(model, String);
    setter!(temperature, f64);
    setter!(max_tokens, u32);
    // ... 20 more macro calls
}
```

Better, but still repetitive. And then came the special cases. Vec fields needed different handling. HashMap fields were a pain. The macro got more complex, then more complex again.

Meanwhile, I had four different request types, each with their own builder, each with slightly different field types, each needing maintenance every time OpenRouter added a new parameter.

The build methods were particularly annoying. So much repetitive Option unwrapping:

```rust
pub fn build(self) -> Result<ChatCompletionRequest, OpenRouterError> {
    Ok(ChatCompletionRequest {
        model: self.model.ok_or(OpenRouterError::Validation("model is required".into()))?,
        messages: self.messages.ok_or(OpenRouterError::Validation("messages are required".into()))?,
        stream: self.stream,
        max_tokens: self.max_tokens,
        // This pattern repeated 20+ times...
    })
}
```

I was spending more time maintaining builder boilerplate than building actual features.

## The derive_builder Revelation

That's when I discovered the `derive_builder` crate. It promised to generate all this boilerplate automatically. Just add `#[derive(Builder)]` and watch the magic happen:

```rust
#[derive(Builder, Debug, Clone, Serialize)]
#[builder(build_fn(error = "OpenRouterError"))]
pub struct ChatCompletionRequest {
    #[builder(setter(into))]
    model: String,

    messages: Vec<Message>,

    #[builder(setter(strip_option), default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    max_tokens: Option<u32>,

    #[builder(setter(strip_option), default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    temperature: Option<f64>,

    // ... all the other optional fields
}

impl ChatCompletionRequestBuilder {
    // Only need custom setters for complex types
    strip_option_vec_setter!(models, String);
    strip_option_map_setter!(logit_bias, String, f64);
}
```

The transformation was dramatic. My 100+ lines of hand-written builder code became 20 lines of annotations. The `#[builder(setter(strip_option), default)]` tells derive_builder to generate setters that take the unwrapped type directly, not `Option<T>`. So instead of calling `.temperature(Some(0.7))`, you just call `.temperature(0.7)`.

The `#[builder(build_fn(error = "OpenRouterError"))]` automatically generates the build method with proper error handling for required fields. No more repetitive Option unwrapping in every build method.

Now the same request becomes:

```rust
let request = ChatCompletionRequest::builder()
    .model("anthropic/claude-sonnet-4")
    .messages(vec![Message::new(Role::User, "Hello")])
    .temperature(0.7)
    .max_tokens(100)
    .reasoning_effort(Effort::High)
    .build()?;
```

Six lines instead of 25. Every parameter has a name. The order doesn't matter. You only specify what you actually want to set.

But the real win wasn't just the cleaner API—it was the maintainability. When I updated all four request types (`ChatCompletionRequest`, `CompletionRequest`, `CoinbaseChargeRequest`, and `OpenRouterClient`) to use derive_builder, I deleted over 400 lines of repetitive builder code. Adding new fields to any request type now takes seconds instead of minutes.

It's like switching from assembly to a high-level language—not because you're lazy, but because the computer should handle the mechanical parts so you can focus on the interesting problems.

## Custom Setters for the Edge Cases

The derive_builder approach handles 90% of cases perfectly, but there are a few edge cases where you need more control. Take `Vec` fields—the generated builder wants you to call a method multiple times to add individual items:

```rust
// Generated builder approach
let request = MyRequest::builder()
    .model("gpt-4")
    .message(Message::new(Role::User, "First message"))
    .message(Message::new(Role::Assistant, "Response"))
    .message(Message::new(Role::User, "Follow up"))
    .build()?;
```

But when you're building an API client, you usually have the entire vector ready to go:

```rust
// What I actually want
let messages = vec![
    Message::new(Role::User, "First message"),
    Message::new(Role::Assistant, "Response"),
    Message::new(Role::User, "Follow up"),
];

let request = MyRequest::builder()
    .model("gpt-4")
    .messages(messages)  // Set the whole vector at once
    .build()?;
```

Enter custom setter macros. I created `strip_option_vec_setter!` to generate the setters I actually wanted:

```rust
strip_option_vec_setter!(ChatCompletionRequestBuilder, messages, Message, "Set the messages for the chat completion");
strip_option_vec_setter!(ChatCompletionRequestBuilder, tools, Tool, "Set the tools available for the chat completion");
```

This generates setters that take `Vec<T>` directly, handle the `Option` wrapping automatically, and provide nice documentation. Now I can pass entire vectors without jumping through hoops.

The same trick works for `HashMap` fields:

```rust
strip_option_map_setter!(ChatCompletionRequestBuilder, logit_bias, String, f64, "Set the logit bias for specific tokens");
```

These custom macros (`strip_option_vec_setter!` and `strip_option_map_setter!`) handle the edge cases that derive_builder can't address automatically. But they're focused, specialized tools instead of the general-purpose boilerplate generators I was building earlier.

## The Type Safety Dividend

Here's what I didn't expect: better error messages. With constructor functions, if you pass the wrong type, you get generic "expected X, found Y" errors that don't tell you which parameter is wrong.

With builders, each setter method has its own type signature. The error messages become laser-focused:

```rust
let request = ChatCompletionRequest::builder()
    .model("gpt-4")
    .temperature("hot");  // Error: expected f64, found &str in temperature()
```

The compiler tells you exactly which field is wrong and what it expected. It's like having a dedicated QA engineer for your API calls.

And because the builder enforces required fields at compile time, you can't accidentally forget to set the model or messages. Try to build without them, and the code won't compile.

## The Ergonomics Payoff

The real test isn't the toy examples—it's how it feels when you're actually using the library. In openrouter-rs, I can now write API calls that read like configuration:

```rust
let client = OpenRouterClient::builder()
    .api_key(env::var("OPENROUTER_KEY")?)
    .http_referer("https://myapp.com")
    .user_agent("MyApp/1.0")
    .build()?;

let response = client.chat()
    .model("anthropic/claude-sonnet-4")
    .messages(conversation.to_messages())
    .temperature(0.7)
    .max_tokens(1000)
    .reasoning_effort(Effort::High)
    .send()
    .await?;
```

It's self-documenting. You can scan it and immediately understand what's happening. Compare that to the wall of `None` parameters from earlier.

The builder pattern also makes the API future-proof. When OpenRouter adds new parameters (and they will), I can add them to the struct without breaking any existing code. Semver-compatible API evolution for free.

## When to Build (and When Not To)

Not everything needs a builder. The `Message::new(role, content)` constructor is fine as-is. Two required parameters, clear purpose, no complexity.

But once you hit these conditions, builders start paying dividends:
- More than 4-5 parameters total
- More than 2-3 optional parameters
- Parameters that commonly get used together in different combinations
- Public APIs that need to evolve over time

In openrouter-rs, request objects hit all these criteria. The client configuration hit some of them. Simple data structures like `Message` didn't need the complexity.

The `derive_builder` crate makes this decision easier because the implementation cost is so low. Add the derive, maybe write a few custom setters, and you're done. No massive refactoring, no complex hand-written builder implementations.

## The Rust Advantage

Here's what makes builder patterns special in Rust: the type system actually helps instead of getting in your way.

In languages with nullable types everywhere, you still need to check for null at runtime even with builders. In Rust, `Option<T>` is explicit and the borrow checker ensures memory safety in the generated code.

The `derive_builder` crate leverages this by generating builders that are both ergonomic and zero-cost. The builder methods often compile down to simple field assignments. You get the nice API without runtime overhead.

And because everything is explicitly typed, your IDE can provide perfect autocomplete. IntelliSense knows exactly which methods are available on your builder, what parameters they expect, and what they return.

## Building Forward

Working on openrouter-rs taught me that API design is really user experience design. The technical implementation matters, but what really matters is how it feels to use your library day after day.

Builder patterns in Rust aren't just about handling complex constructors—they're about creating APIs that are a joy to use. They're about error messages that help instead of frustrate. They're about code that documents itself.

If you're building any kind of client library, configuration system, or complex data structure in Rust, consider the builder pattern. Start with `derive_builder`, add custom setters where you need them, and watch your API transform from necessary evil to genuine pleasure to use.

The next time you're staring at a constructor with more than a handful of parameters, remember: you don't have to live in constructor hell. Builder heaven is just a `#[derive(Builder)]` away.

---

*Building something with complex APIs in Rust? Check out [openrouter-rs](https://github.com/realmorrisliu/openrouter-rs) to see these patterns in action, or read about [building Sealbox](/thoughts/why-i-built-sealbox) for more thoughts on API design philosophy.*
