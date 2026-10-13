---
title: "Stream OpenRouter Chat with Rust and Axum"
description: "An Axum streaming chat example with openrouter-rs, including the empty response that led to configurable reasoning and the errors HTTP 200 cannot catch."
pubDate: 2026-10-13
tags: ["rust", "openrouter", "axum", "streaming"]
draft: false
readingTime: 7
---

The first live test of this example with DeepSeek V4.1 Flash returned no visible text. The request had used all 128 completion tokens on reasoning and ended with `finish_reason: "length"`.

The stream had reached its token limit before producing an answer. Checking that the request completed would have missed the problem.

I wanted a runnable streaming example for [openrouter-rs](https://github.com/realmorrisliu/openrouter-rs), so the example includes a check that reads the response and requires actual text. This post walks through the Axum handler, the reasoning setting behind that empty response, and what happens when a stream fails or its caller disconnects.

## Run it first

The [complete example](https://github.com/realmorrisliu/openrouter-rs/blob/6b251fcef56eea6ef1f3d031c5a06e8778865bd4/examples/axum_chat_gateway.rs) has two endpoints: `POST /chat` for JSON and `POST /chat/stream` for SSE. Both share an `OpenRouterClient` in application state. The snippets here are excerpts from that file.

You'll need Git, curl, stable Rust, and an OpenRouter API key with credit and access to [DeepSeek V4.1 Flash](https://openrouter.ai/deepseek/deepseek-v4.1-flash). Check out the tested version:

```bash
git clone https://github.com/realmorrisliu/openrouter-rs.git
cd openrouter-rs
git checkout 6b251fcef56eea6ef1f3d031c5a06e8778865bd4
cargo test --locked --example axum_chat_gateway
```

Set the key in your shell without saving its value in shell history. This works in Bash and Zsh:

```bash
printf 'OpenRouter API key: '
read -rs OPENROUTER_API_KEY
printf '\n'
export OPENROUTER_API_KEY
export OPENROUTER_MODEL=deepseek/deepseek-v4.1-flash
cargo run --locked --example axum_chat_gateway
```

The server reads environment variables directly; it doesn't load `.env`. Keep the key on the server. Each request uses your OpenRouter credit.

In a second terminal:

```bash
curl --no-buffer --fail-with-body --max-time 75 \
  http://127.0.0.1:3000/chat/stream \
  -H 'content-type: application/json' \
  -d '{"prompt":"Write three short sentences about Rust.","max_tokens":128}'
```

`--no-buffer` lets curl display the stream as it arrives. There are three event names:

- `chunk`: an SDK completion chunk. Text, when present, is in `choices[].delta.content`; other chunks carry metadata or usage.
- `done`: the upstream stream ended after a non-error finish reason.
- `error`: the request failed. There won't be a `done` after it.

Check `finish_reason` as well. A `done` following `length` means the response hit its token limit. The gateway generates its own `done` event; the SDK consumes OpenRouter's raw `[DONE]` marker internally.

For a browser client, use `fetch` and an SSE parser that handles frames split across network reads. Native `EventSource` can't send the JSON POST body this endpoint expects.

## Why the first response was empty

The curl command gives the model 128 completion tokens. With reasoning disabled, that was enough for three short sentences in the live test. In the first DeepSeek run, reasoning consumed the entire budget.

The example now defaults to `reasoning: {"effort":"none"}` for `deepseek/deepseek-v4.1-flash`. That setting belongs to this model's tutorial default. Applying it to every model would break overrides that don't support `none`.

Both routes accept a `reasoning` object using the SDK's `ReasoningConfig`. The shared request builder gives the caller's settings precedence:

```rust
let mut builder = ChatCompletionRequest::builder();
if let Some(reasoning) = payload.reasoning {
    builder.reasoning(reasoning);
} else if model == TUTORIAL_MODEL {
    builder.reasoning_effort(Effort::None);
}
let request = builder
    .model(model)
    .messages(messages)
    .max_tokens(payload.max_tokens)
    .build()?;
```

Here, `model` is the request's override or the server's `OPENROUTER_MODEL`, and `TUTORIAL_MODEL` is the DeepSeek model ID above. For any other model, omitting `reasoning` leaves the provider's default in control. An explicit `"reasoning": {}` uses the provider default even for DeepSeek; omission or `null` selects the gateway's model-specific default.

To use reasoning, pass it explicitly and give it more room:

```bash
curl --no-buffer --fail-with-body --max-time 75 \
  http://127.0.0.1:3000/chat/stream \
  -H 'content-type: application/json' \
  -d '{"prompt":"Write three short sentences about Rust.","max_tokens":2048,"reasoning":{"effort":"low"}}'
```

That request passed the live test too. Hiding reasoning with `exclude: true` wouldn't have fixed the original problem: hidden reasoning still uses tokens. OpenRouter's [reasoning-token guide](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens) explains the available settings; support varies by model.

## Who owns the stream?

Once the request is built, `client.chat().stream(&request)` opens the upstream stream. The handler does this before returning SSE headers, so connection failures can still become ordinary HTTP errors:

```rust
let deadline = Instant::now() + state.request_timeout;
let request = build_request(&state, payload)?;
let upstream = timeout_at(deadline, state.client.chat().stream(&request))
    .await
    .map_err(|_| error_response(StatusCode::GATEWAY_TIMEOUT, "Upstream timed out"))?
    .map_err(map_sdk_error)?;
```

The client has a ten-second connection timeout. The handler's sixty-second deadline covers opening the upstream request and reading the response.

After connecting, `futures_util::stream::unfold` turns SDK chunks into Axum events:

```rust
Event::default().event("chunk").json_data(&chunk)
```

The unfold state owns the upstream stream. When Axum drops the downstream response body, that stream is dropped too. There's no detached task left reading tokens into a channel for a caller who has gone away.

A local socket test checks this behavior. It releases the gateway's upstream connection, though whether generation and billing stop depends on the provider. OpenRouter documents that [cancellation boundary](https://openrouter.ai/docs/api/reference/streaming).

Two details in the loop are easy to miss. It keeps reading after a normal `finish_reason`, because a later chunk may contain usage and cost. And every read uses the **same** deadline. Resetting a sixty-second timeout for each chunk would let a slow stream keep the request open indefinitely. SSE keep-alive comments don't extend it either.

## HTTP 200 isn't the whole result

Before the headers go out, the handler can return `400` for invalid input, `413` for an oversized body, `502` for an upstream request failure, or `504` for a timeout. Axum handles malformed JSON and incompatible JSON shapes through its own rejection responses.

After streaming starts, the HTTP status is already `200`. Parse errors, transport failures, error finish reasons, an early EOF, and deadline expiry have to travel in the response body. The gateway sends an `error` event and stops. It never follows that error with `done`.

This is why `curl --fail-with-body` alone isn't a sufficient check: it catches HTTP failures, but an SSE error inside HTTP `200` still looks successful to curl. The client needs to read the events. Error messages are kept generic rather than reflecting raw provider responses; server-side logging can provide the diagnostic detail.

The same request validation runs before either route contacts OpenRouter: a nonempty prompt, at most 8,192 combined prompt/system bytes, `max_tokens` from 1 to 2,048 (default 512), and a 16 KiB JSON body limit. Those byte limits bound input size; they don't estimate token usage or cost.

## Checking the complete request

The example's eight tests cover incremental delivery over local HTTP, final usage, failures, deadlines, disconnects, input limits, and reasoning configuration. They also pass in a separate project using the published `openrouter-rs = "=0.19.0"` crate with Axum 0.8.

For a live check, stop the gateway first and run:

```bash
cargo build --locked --example axum_chat_gateway
python3 scripts/smoke_axum_gateway.py
```

The script needs Python 3, curl, port 3000 available, and your exported API key. It starts the gateway and sends both curl requests from this post. Each must return multiple chunks, nonempty text, valid final token usage, and one `done`, with no `error`. Missing credentials fail the check.

The [October 13, 2026 run](https://github.com/realmorrisliu/openrouter-rs/actions/runs/38344606219) passed both: 22 chunks with the default settings, and 45 with explicit low-effort reasoning. Both returned text and final usage. The script saves transcripts and summaries in `axum-smoke-artifacts/`, so you can inspect your own run as well.

The example binds to loopback and has no gateway authentication. Before exposing it publicly, add authentication, rate and concurrency limits, and a policy for allowed models. If you put it behind a reverse proxy, check that the proxy forwards chunks as they arrive.

The [full source](https://github.com/realmorrisliu/openrouter-rs/blob/6b251fcef56eea6ef1f3d031c5a06e8778865bd4/examples/axum_chat_gateway.rs) includes the handlers and tests. For another way into the SDK, see the [application examples](https://github.com/realmorrisliu/openrouter-rs#application-patterns) or my earlier post on [Rust's builder pattern](/thoughts/rust-builder-pattern-evolution).

For a tool-calling example, see [Typed Tools in a Bounded Rust Agent Loop](/thoughts/typed-tools-openrouter-rust-agent).
