---
title: "Stream OpenRouter Chat with Rust and Axum"
description: "Build and run an Axum SSE endpoint with openrouter-rs: incremental output, explicit stream errors, final usage, deadlines, and disconnect handling."
pubDate: 2026-10-13
tags: ["rust", "openrouter", "axum", "streaming"]
draft: false
readingTime: 8
---

A streaming chat endpoint needs to do more than print tokens. It needs to tell the caller when an answer failed, keep the final usage information, and release its upstream connection when the caller leaves.

This tutorial adds `POST /chat/stream` to the [openrouter-rs Axum gateway example](https://github.com/realmorrisliu/openrouter-rs/blob/dde7c59c8bdc2d3d0036de484f341c648dc54cee/examples/axum_chat_gateway.rs). The existing `POST /chat` JSON endpoint still works. Both use one `OpenRouterClient` stored in Axum application state.

The complete example includes tests. The snippets below explain that file; they are not a separate application you need to assemble.

## Run the complete example

This version uses [DeepSeek V4.1 Flash](https://openrouter.ai/deepseek/deepseek-v4.1-flash), with its exact model ID pinned in the example and smoke test.

You need Git, curl, a current stable Rust toolchain, and an OpenRouter API key with access and credit for `deepseek/deepseek-v4.1-flash`. This is a paid API request. Keep the key on the server, never in browser code.

Check out the exact version used by this tutorial:

```bash
git clone https://github.com/realmorrisliu/openrouter-rs.git
cd openrouter-rs
git checkout dde7c59c8bdc2d3d0036de484f341c648dc54cee
cargo test --locked --example axum_chat_gateway
```

Set your key without putting its value into shell history. The following works in Bash and Zsh:

```bash
printf 'OpenRouter API key: '
read -rs OPENROUTER_API_KEY
printf '\n'
export OPENROUTER_API_KEY
export OPENROUTER_MODEL=deepseek/deepseek-v4.1-flash
cargo run --locked --example axum_chat_gateway
```

The example reads the process environment; it does **not** automatically load a `.env` file. It binds to `127.0.0.1:3000` by default. In a second terminal:

```bash
curl --no-buffer --fail-with-body --max-time 75 \
  http://127.0.0.1:3000/chat/stream \
  -H 'content-type: application/json' \
  -d '{"prompt":"Write three short sentences about Rust.","max_tokens":128}'
```

`--no-buffer` makes curl display bytes as they arrive. The response is Server-Sent Events (SSE), with three event names:

- **`chunk`** carries a JSON-serialized SDK completion chunk. Append text from each choice's `delta.content` when present, and retain metadata and optional usage.
- **`done`** carries `{}`. The SDK stream ended after a non-error finish reason.
- **`error`** carries a short error code. Show a failed/incomplete answer and stop expecting a `done` event.

Not every chunk contains text. Some carry a role, a finish reason, or usage. Also inspect `finish_reason`: `length`, for example, means the output hit its token limit. A `done` event does not promise an untruncated answer.

The SDK consumes OpenRouter's raw `[DONE]` marker internally. This gateway's `done` is its own event based on the SDK stream ending after a finish reason; it is not a forwarded upstream marker.

For a browser client, use `fetch` with a POST body and an SSE parser that handles frames split across network reads. Native `EventSource` does not send this JSON POST request. This article uses curl so the complete path is easy to reproduce without a frontend build.

## Build one request and share one client

The gateway uses the domain-oriented SDK interface:

```rust
let request = ChatCompletionRequest::builder()
    .model(model)
    .messages(messages)
    .max_tokens(payload.max_tokens)
    .reasoning_effort(Effort::None)
    .build()?;
```

That builder belongs inside the handler's error mapping, as shown in the complete example. `client.chat().stream(&request)` enables streaming and returns an asynchronous stream of parsed completion chunks. There is no need to parse OpenRouter's SSE comments yourself.

For this short chat demo, `.reasoning_effort(Effort::None)` sends `reasoning: {"effort":"none"}`. The first live DeepSeek test without it spent all 128 completion tokens on reasoning and returned empty visible content with `finish_reason: "length"`; the smoke check correctly failed. A model change can require a request-policy change, not just a different model string. Hiding reasoning with `exclude: true` would not solve this: it still consumes the token budget. See OpenRouter's [reasoning-token guidance](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens).

This example requests non-reasoning chat on both routes. If you adapt it to a model that requires reasoning, change that setting and provide an appropriate token budget, then rerun the live check.

`AppState` holds the reusable client, default model, and request deadline duration. The client uses a shared `reqwest::Client` with a ten-second connection timeout. The example applies a sixty-second total upstream deadline, including opening the stream and reading it.

Both chat routes validate the request before contacting OpenRouter:

- A nonempty prompt and at most 8,192 combined prompt/system bytes.
- `max_tokens` between 1 and 2,048, defaulting to 512.
- A maximum JSON request body of 16 KiB.

These are example limits, not estimates of token counts or money. UTF-8 bytes and model tokens are different units. A caller can also override `model`; a public service should decide which models it allows.

## Let the response body own the stream

The streaming handler opens the upstream request before returning SSE headers:

```rust
let deadline = Instant::now() + state.request_timeout;
let request = build_request(&state, payload)?;
let upstream = timeout_at(deadline, state.client.chat().stream(&request))
    .await
    .map_err(|_| error_response(StatusCode::GATEWAY_TIMEOUT, "Upstream timed out"))?
    .map_err(map_sdk_error)?;
```

It then uses `futures_util::stream::unfold` to produce Axum `Event` values. The unfold state owns the upstream stream directly. There is no detached task continuing to drain tokens into a channel after the response disappears.

For each successful SDK chunk, the gateway emits:

```rust
Event::default().event("chunk").json_data(&chunk)
```

The actual handler checks errors and finish reasons before that step. It keeps reading after a normal finish reason because a later chunk may carry usage and cost. Stopping at the first `finish_reason` can discard that accounting information.

Each read uses `timeout_at` with the **same** deadline. Restarting a sixty-second timeout on every chunk would allow a slow stream to run indefinitely. Axum's `KeepAlive` adds SSE comments while waiting; comments are not completion events and do not extend this deadline.

When the downstream HTTP body is dropped, its upstream stream is dropped as well. A local HTTP test checks that ownership behavior on an actual socket. This releases the gateway's connection; it does **not** guarantee that every provider stops generation or billing. OpenRouter documents [provider-dependent cancellation behavior](https://openrouter.ai/docs/api/reference/streaming).

## Treat failures as part of the protocol

Before streaming headers are sent, errors can still use ordinary HTTP responses: invalid input returns `400`, an oversized body returns `413`, an upstream request failure returns `502`, and an upstream timeout returns `504`. Invalid JSON and incompatible JSON shapes use Axum's JSON rejection responses.

After the SSE response starts, its status is already `200`. A later upstream failure must be reported in the body. The gateway emits an `error` event for SDK parse/transport errors, error finish reasons, an unexpected early EOF, or expiration of the deadline. It never follows that event with `done`.

This matters for curl too: `--fail-with-body` catches HTTP failures, but it cannot turn an SSE `error` inside HTTP `200` into a nonzero exit code. An application must check the event protocol. The smoke script below does exactly that.

Errors sent to the caller are deliberately generic. Forwarding raw provider error text can expose internal details. A deployed service can add appropriate server-side diagnostics without reflecting them into the response.

## Verify the path you will actually use

The six tests in the example exercise the real local HTTP path, with a controlled upstream server:

1. The caller receives a chunk while the upstream is deliberately paused, proving that the response is not buffered until completion. A final usage chunk is retained.
2. Upstream HTTP failures are sanitized on both routes.
3. Midstream errors, malformed upstream data, and premature EOF produce errors instead of success.
4. Invalid and oversized input is rejected before an upstream call.
5. Header and body stalls hit their deadlines.
6. Dropping the downstream response drops the upstream response body.

To verify against your own OpenRouter account, stop the running gateway, then run:

```bash
cargo build --locked --example axum_chat_gateway
python3 scripts/smoke_axum_gateway.py
```

This needs Python 3, curl, a free port 3000, and the exported API key. The script starts the gateway, runs the documented curl request, and requires multiple JSON chunks, nonempty generated text, one final `done`, no `error`, and a final usage object with nonnegative integer `prompt_tokens`, `completion_tokens`, and `total_tokens`. Cost remains optional. Missing credentials fail the check rather than silently skipping it. It saves the actual SSE transcript and summary under `axum-smoke-artifacts/`.

On October 13, 2026, the [live verification run](https://github.com/realmorrisliu/openrouter-rs/actions/runs/38343741881) exercised that same curl → Axum → OpenRouter path with `deepseek/deepseek-v4.1-flash`. It received **26 chunks**, generated text, final usage (11 prompt tokens and 53 completion tokens), and one `done`, with no error events. The generation ID was `gen-1791863585-nNPTd421Iq7csghCY3ua`.

The returned text began: “1. Rust is a systems programming language that guarantees memory safety without needing a garbage collector.” The reported optional cost was `0.0000404415`. Treat that as a value from this one response, not a pricing quote; preserve missing cost as unknown rather than zero. The run retains the full SSE transcript as a downloadable artifact for 30 days. Model availability, account permissions, latency, and pricing can change.

The [original GPT-4o mini run](https://github.com/realmorrisliu/openrouter-rs/actions/runs/38342367463) remains a separate historical verification; the run above verifies the current DeepSeek example.

The example also compiles and passes its six tests in a separate project using the **published** `openrouter-rs = "=0.19.0"` crate, with Axum 0.8. It does not depend on an unreleased SDK method.

## Take it into your application

The example stays on loopback and has no gateway authentication. Before exposing it publicly, add your application's authentication, rate/concurrency limits, and a model policy. If you use a reverse proxy, verify that it passes SSE incrementally; this tutorial does not test your proxy configuration.

The core pieces are already here: shared client state, bounded input and generation, a total deadline, incremental forwarding, explicit failure events, and preserving final usage. Start with the [complete tested source](https://github.com/realmorrisliu/openrouter-rs/blob/dde7c59c8bdc2d3d0036de484f341c648dc54cee/examples/axum_chat_gateway.rs), then adapt those limits to your application.

For other integrations, see the [openrouter-rs application examples](https://github.com/realmorrisliu/openrouter-rs#application-patterns). For background on the request API, I also wrote about [the Rust builder pattern](/thoughts/rust-builder-pattern-evolution).
