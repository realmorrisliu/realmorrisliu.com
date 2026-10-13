---
title: "Typed Tools in a Bounded Rust Agent Loop"
description: "A runnable openrouter-rs tool loop with typed arguments, correlated tool results, recoverable argument errors, and explicit stopping limits."
pubDate: 2026-10-13
tags: ["rust", "openrouter", "tool-calling", "agents"]
draft: false
readingTime: 7
---

The old version of my typed-tool agent could print `(empty response)` and exit successfully. Reaching its four-step limit also returned `Ok(())`.

That made a successful process exit a poor way to check whether the example had actually answered the question. While preparing this tutorial, I changed those paths to fail and added a check that requires both tool results and a final answer.

The example asks about a simulated incident in a checkout service. The model chooses two tools, Rust validates their arguments and returns fixed demonstration data, and the model uses those results to make a recommendation. It never queries or changes real infrastructure.

## Run the complete example

The [source and tests](https://github.com/realmorrisliu/openrouter-rs/blob/f6d4a06832e891c51f00e178e122fa7ffbe0f906/examples/typed_tool_agent.rs) use the published `openrouter-rs` 0.19.0 API. You'll need Git, a stable Rust toolchain, and an OpenRouter API key with credit and access to [DeepSeek V4.1 Flash](https://openrouter.ai/deepseek/deepseek-v4.1-flash).

```bash
git clone https://github.com/realmorrisliu/openrouter-rs.git
cd openrouter-rs
git checkout f6d4a06832e891c51f00e178e122fa7ffbe0f906
cargo test --locked --example typed_tool_agent
```

Set the key without saving it in shell history. These commands work in Bash and Zsh:

```bash
printf 'OpenRouter API key: '
read -rs OPENROUTER_API_KEY
printf '\n'
export OPENROUTER_API_KEY
export OPENROUTER_MODEL=deepseek/deepseek-v4.1-flash
cargo run --locked --example typed_tool_agent
```

The program reads the process environment, not a `.env` file. Its stdout is JSON lines: `completion` records hold model responses and usage, `tool_result` records show what Rust returned, and `final` carries the answer. Credentials are not part of those records. Requests use your OpenRouter credit.

The two tools are `get_deployment_status` and `lookup_runbook`. A successful run should include both and end with a nonempty `final`. The smoke check near the end of this post verifies that sequence.

## Define the arguments once

Here is the deployment tool's argument type:

```rust
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
enum Environment {
    Production,
    Staging,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
#[serde(deny_unknown_fields)]
struct DeploymentStatusParams {
    service: String,
    environment: Environment,
}
```

`JsonSchema` comes from `schemars`. The SDK's `TypedTool` implementation gives the tool its name and description; `.typed_tool::<DeploymentStatusParams>()` adds the generated schema to the request. The runbook tool follows the same pattern with `service` and `symptom` fields.

The environment enum is useful at the boundary. If the model sends `"prod"` instead of `"production"`, Serde rejects it. Missing fields, wrong types, malformed JSON, and unexpected fields are rejected too.

A schema still doesn't make model output trustworthy. `service: String` accepts any string, so the dispatcher separately checks that the requested service is `checkout`, the only fixture this example has. It also checks that a runbook symptom isn't blank or longer than 512 bytes.

`parse_params::<T>()` deserializes JSON; it doesn't automatically run the separate `TypedToolParams::validate()` method. Put the checks your application needs in the execution path.

## The model asks; Rust executes

Each model request includes both tools:

```rust
let request = builder
    .model(model)
    .messages(messages.clone())
    .typed_tool::<DeploymentStatusParams>()
    .typed_tool::<RunbookLookupParams>()
    .tool_choice_auto()
    .parallel_tool_calls(false)
    .max_tokens(2048)
    .build()?;
```

The model returns names and JSON arguments. The dispatcher selects an allowed tool before parsing its arguments:

```rust
if tool_call.is_tool::<DeploymentStatusParams>() {
    let Ok(params) = tool_call.parse_params::<DeploymentStatusParams>() else {
        return json!({"error":"invalid_arguments"});
    };
    if params.service != "checkout" {
        return json!({"error":"unknown_service", "supported_service":"checkout"});
    }
    // Return the fixed demo snapshot.
}
```

The complete dispatcher returns a `serde_json::Value`. That matters for error paths too: an unknown tool name goes into `json!({"error":"unknown_tool", "tool":tool_call.name()})`, so quotes in the name can't break the result JSON.

Argument errors become tool results, giving the model a chance to correct the request on its next turn. Network errors, malformed completion messages, empty answers, and exhausted limits stop the program instead. A model can still fail to recover; the loop has a fixed budget.

The demo tools only read fixtures and mark their results with `"demo": true`. Replacing them with database access or deployment actions also means adding authorization and a policy for what the model is allowed to request. Rust argument types don't grant that permission.

## Keep the assistant message with its results

After the model asks for a tool, the next request needs the assistant message that made the request and the matching tool result. Sending only the result loses the call it belongs to.

The example appends the full modeled assistant message:

```rust
messages.push(Message::try_from(message)?);
```

That conversion preserves its tool calls, null content, and modeled reasoning details. Rebuilding an assistant message from text would lose information needed by some reasoning models.

Then each result carries the original call ID:

```rust
messages.push(Message::tool_response_named(
    tool_call.id(),
    tool_call.name(),
    serde_json::to_string(&result)?,
));
```

The history now contains the original question, the assistant's tool request, and its result. The next request includes that history and both tool schemas again. OpenRouter's [tool-calling guide](https://openrouter.ai/docs/guides/features/tool-calling) shows the corresponding wire format.

Call IDs need to be nonempty and unique in this loop. They identify a result's place in the conversation; the tool's name alone is insufficient if it is called more than once.

## Give the loop an end

There are four model requests available, including the final-answer request. Each response can contain at most two tool calls, and each arguments string is limited to 8,192 bytes. `parallel_tool_calls(false)` is a request to the provider; the dispatcher still bounds and checks the returned calls. The verified DeepSeek response contained both calls in one turn, and the example executed them sequentially.

A single sixty-second deadline covers all model requests:

```rust
let response = timeout_at(deadline, client.chat().create(&request))
    .await
    .map_err(|_| "Agent exceeded its total deadline")??;
```

The HTTP client also has a ten-second connection timeout. Resetting the total deadline after every turn would defeat the loop's time bound. These limits apply to this example's synchronous fixture tools; a real asynchronous tool needs to obey a deadline as well.

A final answer needs `finish_reason: "stop"` and nonempty content. `length`, provider errors, missing choices, and a tool-call finish without tool calls fail. If the model keeps asking for tools until the budget is exhausted, the process exits unsuccessfully.

The model is configurable through `OPENROUTER_MODEL`. The tutorial's DeepSeek default disables reasoning to leave the output budget for calls and the answer. `OPENROUTER_REASONING` accepts a JSON `ReasoningConfig` and takes precedence; other models retain their provider defaults when it is omitted. Changing the model can change tool support and token requirements, so check the resulting run.

## Check the whole round trip

The local tests send requests through HTTP to a controlled upstream. They check correlated results, preserved assistant metadata, invalid-argument feedback, model/reasoning overrides, failed completions, step limits, and deadlines. The same seven tests also pass in a separate project using the published `openrouter-rs = "=0.19.0"` crate.

For a live check, with the same exported API key:

```bash
cargo build --locked --example typed_tool_agent
python3 scripts/smoke_typed_tool_agent.py
```

This requires Python 3. The script runs the actual binary and requires both demonstration tools, matching call IDs and results, usage from each completion, and one final answer. Missing credentials and unsuccessful exits fail the check. It saves the JSON-line trace, stderr, and summary under `typed-tool-smoke-artifacts/`.

On October 13, 2026, the [live verification run](https://github.com/realmorrisliu/openrouter-rs/actions/runs/38362237401) completed two requests with `deepseek/deepseek-v4.1-flash`. The first returned both tool calls; the second returned a nonempty final answer after receiving their results. Both completions included usage. The answer recommended pausing the demo rollout and comparing configuration, and explicitly said it had not queried or changed real infrastructure.

The number of turns and the wording can vary. The verified boundary is the complete model → Rust tools → model round trip; the deployment and runbook data are fixed fixtures.

If you want to adapt the example, start with the [complete file](https://github.com/realmorrisliu/openrouter-rs/blob/f6d4a06832e891c51f00e178e122fa7ffbe0f906/examples/typed_tool_agent.rs). The tool dispatcher is the place to replace the fixtures with your own allowed operations. For a streaming HTTP endpoint using the same SDK, see [the Axum tutorial](/thoughts/streaming-openrouter-rust-axum).
