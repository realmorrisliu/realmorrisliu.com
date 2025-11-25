---
title: "FastAPI Graceful Shutdown: 3 Resource Management Traps"
description: "FastAPI won't exit with one Ctrl+C? Discover three hidden resource management traps—aiosqlite leaks, thread chaos, and asyncio.run() pitfalls."
pubDate: 2025-11-25
tags: ["fastapi", "python", "resource-management", "async", "backend"]
draft: false
---

While building the Kira agent backend, I hit a seemingly minor issue: **pressing Ctrl+C once wouldn't shut down the FastAPI dev server. I had to press it twice to force termination.**

The first press did nothing. The second press finally killed the process, throwing this exception:

```bash
INFO:     127.0.0.1:58135 - "POST /copilotkit HTTP/1.1" 200 OK
^CINFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Application shutdown complete.
INFO:     Finished server process [37020]
^CException ignored in: <module 'threading' from '/path/to/threading.py'>
Traceback (most recent call last):
  File "/path/to/threading.py", line 1567, in _shutdown
    lock.acquire()
KeyboardInterrupt:
```

Was this just a minor dev environment annoyance?

**Not at all.** If your application can't gracefully shut down in development, then in production:

- **Container restarts will timeout**: Kubernetes sends SIGTERM and waits 30 seconds before forcing SIGKILL
- **Connection pools will exhaust**: Database connections and HTTP connections leak, causing resource exhaustion
- **Data may be lost**: Unflushed caches, uncommitted transactions, unacknowledged message queues

This post takes you through the debugging process, explores the proper way to manage Python async resources, and builds a systematic understanding of **resource lifecycle management**.

## Investigation: From Symptoms to Root Cause

### Step 1: Where Is the Exit Getting Stuck?

From the stack trace, the second `KeyboardInterrupt` happens in `threading.py`'s `_shutdown` method. This is Python's interpreter logic for waiting for all non-daemon threads to finish when exiting.

Let's look at the simplified version from Python's source code:

```python
# cpython/Lib/threading.py
def _shutdown():
    """Wait for all non-daemon threads to finish"""
    for thread in _enumerate():
        if thread.daemon:
            continue
        thread.join()  # Blocks, waiting for thread to end
```

**Key finding**: Background threads are preventing the process from exiting, and these threads are not daemon threads.

### Step 2: Three Resource Management Traps

Through code review, I discovered three traps causing resource leaks:

#### Trap 1: The aiosqlite Connection Never Closed

In `agent.py`, my `get_checkpointer()` function created a database connection but never explicitly closed it:

```python
# agent.py (problem code)
async def get_checkpointer():
    """Initialize checkpointer"""
    turso_checkpointer = get_turso_checkpointer_from_env()

    # Create connection
    checkpointer = await turso_checkpointer.get_checkpointer()

    # Problem: connection stays open after return, never closed
    return checkpointer
```

Even worse, in `turso_checkpointer.py`, I relied on the `__del__` destructor to clean up resources:

```python
# turso_checkpointer.py (problem code)
class TursoSyncedCheckpointer:
    def __del__(self):
        """Try final sync on destruction"""
        if self.turso_client:
            try:
                self.turso_client.sync()  # Execution timing completely uncertain
            except:
                pass
```

**Why is `__del__` unreliable?**

1. **Uncertain execution timing**: Python's garbage collector may call `__del__` at any moment, even after the main thread has closed
2. **Circular reference problem**: If objects have circular references, `__del__` may never be called
3. **Exceptions are ignored**: Exceptions in `__del__` are silently swallowed (the `except: pass` above)

#### Trap 2: libsql Background Sync Thread Keeps Running

I used Turso's embedded replica feature, where the libsql client starts a background sync thread:

```python
# turso_checkpointer.py
self.turso_client = libsql.connect(
    database=self.local_db_path,
    sync_url=self.sync_url,
    auth_token=self.auth_token,
    sync_interval=60,  # Sync every 60 seconds
)
```

This background thread **is not a daemon thread**, so it prevents Python's interpreter from exiting. Even after the main program ends, `threading._shutdown` still waits for this thread to complete.

#### Trap 3: Side Effects of Global `asyncio.run()`

At the module level in `main.py`, I initialized the agent using `asyncio.run()`:

```python
# main.py (problem code)
import asyncio
from agent import workflow, get_checkpointer

# Problem: creating global resources at module load time
graph = None
checkpointer = None

async def initialize_agent():
    global graph, checkpointer
    checkpointer = await get_checkpointer()
    graph = workflow.compile(checkpointer=checkpointer)

# Executes immediately at module load
asyncio.run(initialize_agent())  # Lifecycle management chaos

app = FastAPI(...)
```

This pattern has two serious problems:

1. **Event loop lifecycle chaos**: `asyncio.run()` creates a new event loop, closes it immediately after execution, but the global `checkpointer` variable still holds resources
2. **No cleanup timing**: Module-level code only executes once during import, with no corresponding "cleanup on exit" logic

### Why Does It Take Two Ctrl+C Presses?

Now I can piece together the whole flow:

1. **First Ctrl+C**: uvicorn receives SIGINT, begins graceful shutdown
2. **Main thread exits**: FastAPI app stops accepting new requests, finishes current requests and exits
3. **Waiting for non-daemon threads**: Python interpreter calls `threading._shutdown`, finds libsql's background sync thread still running
4. **Blocks waiting**: `thread.join()` waits indefinitely (because the thread never received a stop signal)
5. **Second Ctrl+C**: Forces `KeyboardInterrupt`, interrupts `lock.acquire()`, brutally terminates the process

## The Fix: Proper Resource Lifecycle Management

### Core Principles

To solve this problem, we need to follow three principles:

1. **Explicit cleanup > Implicit cleanup**: Don't rely on `__del__`, use explicit `close()` methods
2. **Framework lifecycle > Global variables**: Leverage FastAPI's lifespan events to manage resources
3. **Structured concurrency > Background threads**: Prefer asyncio.Task, properly manage thread lifecycle when necessary

### Code Fixes (Three Files)

#### Fix 1: turso_checkpointer.py - Add Explicit Cleanup

```python
class TursoSyncedCheckpointer:
    def __init__(self, ...):
        self.local_db_path = local_db_path
        self.turso_client = None
        self.aiosqlite_conn = None  # Save connection reference for cleanup

        if sync_url and auth_token:
            self._init_turso_sync()

    async def get_checkpointer(self) -> AsyncSqliteSaver:
        """Get LangGraph checkpointer"""
        # Save connection reference
        self.aiosqlite_conn = await aiosqlite.connect(self.local_db_path)
        checkpointer = AsyncSqliteSaver(self.aiosqlite_conn)
        await checkpointer.setup()
        return checkpointer

    async def close(self):
        """
        Explicitly close all resources (aiosqlite + libsql)

        Should be called on app shutdown to ensure:
        1. Final sync to cloud
        2. Database connection closed
        3. Background sync thread stopped
        """
        print("Closing checkpointer resources...")

        # 1. Final sync to Turso
        if self.turso_client:
            try:
                print("  Final sync to Turso...")
                self.turso_client.sync()  # Ensure data is synced
                print("  Final sync completed")
            except Exception as e:
                print(f"  Warning: Final sync failed: {e}")

        # 2. Close aiosqlite connection
        if self.aiosqlite_conn:
            try:
                print("  Closing aiosqlite connection...")
                await self.aiosqlite_conn.close()
                print("  aiosqlite connection closed")
            except Exception as e:
                print(f"  Warning: Failed to close aiosqlite: {e}")

        # 3. Close libsql client (stop background thread)
        if self.turso_client:
            try:
                print("  Closing Turso client...")
                self.turso_client.close()  # Stop background sync thread
                print("  Turso client closed")
            except Exception as e:
                print(f"  Warning: Failed to close Turso client: {e}")

        print("Checkpointer resources cleaned up")
```

**Key improvements:**

- Save all resource references that need cleanup (`aiosqlite_conn`, `turso_client`)
- Provide explicit `async def close()` method
- Cleanup steps are ordered with error handling
- Removed unreliable `__del__` method

#### Fix 2: agent.py - Return Checkpointer Instance

```python
async def get_checkpointer():
    """
    Get checkpointer for conversation history persistence

    Returns:
        Tuple[AsyncSqliteSaver, TursoSyncedCheckpointer]:
            - checkpointer: LangGraph checkpointer
            - turso_checkpointer: Instance for later cleanup
    """
    environment = os.getenv("ENVIRONMENT", "dev")
    print(f"Initializing checkpointer (environment: {environment})")

    # Create Turso synced checkpointer
    turso_checkpointer = get_turso_checkpointer_from_env()

    # Get async checkpointer instance
    checkpointer = await turso_checkpointer.get_checkpointer()

    # Return both so main.py can call close()
    return checkpointer, turso_checkpointer
```

**Key improvements:**

- Return tuple `(checkpointer, turso_checkpointer)`
- Let the caller (main.py) access the original instance to call `close()` method

#### Fix 3: main.py - Use FastAPI Lifespan

```python
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from copilotkit import LangGraphAGUIAgent
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from dotenv import load_dotenv
from agent import workflow, get_checkpointer

load_dotenv()

# Global variables
graph = None
checkpointer = None
turso_checkpointer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan event handler
    Handles startup and shutdown logic to ensure proper resource management
    """
    global graph, checkpointer, turso_checkpointer

    # Startup: initialize agent
    print("Starting Kira agent...")

    # Initialize checkpointer (with Turso sync)
    checkpointer, turso_checkpointer = await get_checkpointer()
    print("Checkpointer initialized")

    # Compile graph
    graph = workflow.compile(checkpointer=checkpointer)
    print("Graph compiled successfully")
    print("Kira agent ready")

    yield  # App runs during this period

    # Shutdown: clean up resources
    print("\nShutting down Kira agent...")

    if turso_checkpointer:
        await turso_checkpointer.close()  # Explicitly clean all resources

    print("Kira agent shutdown complete")


# FastAPI app uses lifespan handler
app = FastAPI(
    title="Kira Calendar Agent API",
    description="AI-powered calendar and task management assistant",
    version="1.0.0",
    lifespan=lifespan  # Register lifecycle handler
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:4321").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CopilotKit endpoint
add_langgraph_fastapi_endpoint(
    app=app,
    agent=LangGraphAGUIAgent(
        name="kira_calendar_agent",
        description="Intelligent calendar and task management assistant",
        graph=graph,
    ),
    path="/copilotkit"
)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Kira Calendar Agent API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        log_level="info"
    )
```

**Key improvements:**

- Removed module-level `asyncio.run(initialize_agent())`
- Use `@asynccontextmanager` to define lifespan function
- Startup phase: initialize all resources
- Shutdown phase: explicitly call `turso_checkpointer.close()`
- Pass lifespan to `FastAPI(lifespan=lifespan)`

### Before and After Comparison

**Before the fix:**

```bash
$ cd agent && uv run python main.py
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
^C (first press - no response, stuck)
^C (second press - forced exit)
Exception ignored in: <module 'threading' from '...'>
KeyboardInterrupt
```

**After the fix:**

```bash
$ cd agent && uv run python main.py
Starting Kira agent...
Initializing checkpointer (environment: dev)
Checkpointer initialized
Graph compiled successfully
Kira agent ready
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)

^C (first Ctrl+C)
INFO:     Shutting down
Shutting down Kira agent...
Closing checkpointer resources...
  Closing aiosqlite connection...
  aiosqlite connection closed
  Closing Turso client...
  Turso client closed
Checkpointer resources cleaned up
Kira agent shutdown complete
INFO:     Finished server process [12345]
```

**One Ctrl+C, clean exit, all resources properly released.**

## Technical Deep Dive: Why This Fix Works

### Four Levels of Python Resource Cleanup

In Python, resource cleanup has different abstraction levels, with reliability increasing progressively:

#### 1. Worst: Relying on `__del__` (Uncertain Execution Timing)

```python
class Database:
    def __del__(self):
        self.conn.close()  # When will this be called? Will it definitely be called?
```

**Problems:**

- Garbage collector decides when to call, possibly after program exits
- Circular references can cause `__del__` to never execute
- Exceptions cannot be properly handled

#### 2. Basic: try-finally (Manual Management)

```python
conn = None
try:
    conn = connect_db()
    do_work(conn)
finally:
    if conn:
        conn.close()  # Guaranteed to execute
```

**Pros:** Ensures finally block always executes

**Cons:** Verbose code, easy to forget

#### 3. Recommended: Context Manager (with Statement)

```python
class Database:
    def __enter__(self):
        self.conn = connect_db()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()  # Automatically called

with Database() as db:
    do_work(db)  # Auto cleanup when leaving scope
```

**Pros:** Clear semantics, automatic management

**Suitable for:** Resources with clear scope (files, locks, transactions)

#### 4. Best: Framework Lifecycle Hooks (Automated Management)

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db = await init_database()
    yield
    # Shutdown
    await db.close()  # Framework guarantees call

app = FastAPI(lifespan=lifespan)
```

**Pros:**

- Bound to application lifecycle
- Framework guarantees proper invocation
- Supports async cleanup

**Suitable for:** Global resources (database connection pools, background tasks, caches)

### The Design Philosophy of FastAPI Lifespan

FastAPI's lifespan event handler is designed based on the ASGI specification's [Lifespan Protocol](https://asgi.readthedocs.io/en/latest/specs/lifespan.html).

**Why use `@asynccontextmanager`?**

1. **Semantic match**: Context manager's `__enter__`/`__exit__` naturally correspond to startup/shutdown
2. **Async support**: `async with` allows async operations during setup/teardown
3. **Exception handling**: Automatically propagates startup exceptions, preventing app from starting

**Comparison with old events API:**

```python
# Old API (deprecated)
@app.on_event("startup")
async def startup():
    await init_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

# New API (recommended)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(lifespan=lifespan)
```

**New version advantages:**

- Clearer scope semantics
- Supports multiple lifespan composition (via `contextlib.AsyncExitStack`)
- Better type hints

### Mixing Threads with asyncio

When your application uses both threads (like libsql's background sync) and asyncio, you need to pay special attention to lifecycle management.

**Daemon vs Non-daemon threads:**

```python
import threading
import time

# Non-daemon thread will block process exit
def worker():
    while True:
        time.sleep(1)

thread = threading.Thread(target=worker, daemon=False)
thread.start()
# After main thread exits, Python waits for this thread (waits forever)

# Daemon thread won't block process exit
thread = threading.Thread(target=worker, daemon=True)
thread.start()
# After main thread exits, daemon thread is forcibly terminated
```

**libsql's thread management:**

libsql's sync thread is non-daemon, so you must explicitly call `client.close()` to stop it:

```python
# At startup
self.turso_client = libsql.connect(...)  # Creates background sync thread

# At shutdown
self.turso_client.close()  # Stop background thread, release resources
```

If you forget to call `close()`, the background thread keeps running, causing `threading._shutdown` to wait indefinitely.

### Why Is `__del__` Unreliable?

Let's take a deeper look at `__del__` problems:

**Problem 1: Uncertain Execution Timing**

```python
class Resource:
    def __del__(self):
        print("Cleaning up")  # When will this print?

r = Resource()
del r  # May not immediately call __del__ at this point
# Need to wait for garbage collector to run, timing completely uncontrollable
```

**Problem 2: Circular References Lead to Never Being Called**

```python
class A:
    def __init__(self):
        self.b = B(self)  # Circular reference

    def __del__(self):
        print("A cleaned")  # Never prints

class B:
    def __init__(self, a):
        self.a = a

a = A()  # A and B reference each other, forming cycle
del a    # __del__ won't be called!
```

**Problem 3: Called After Main Thread Exits**

```python
class Database:
    def __del__(self):
        # At this point main thread may have exited, event loop closed
        asyncio.run(self.conn.close())  # RuntimeError!
```

**Correct approach: Explicit close()**

```python
class Database:
    async def close(self):
        """Explicit cleanup, controllable timing"""
        if self.conn:
            await self.conn.close()
            self.conn = None

# Manage with lifespan
@asynccontextmanager
async def lifespan(app):
    db = Database()
    yield
    await db.close()  # Guaranteed to be called before main thread exits
```

## Practical Advice: Building Reliable Async Applications

### Checklist: Resource Management Self-Check

When developing async applications, ask yourself these questions:

- [ ] **Every `open()` has a corresponding `close()`**
  - Database connections, file handles, network sockets, HTTP clients
  - Use context manager or lifespan to manage lifecycle

- [ ] **Database connections use connection pool**
  - Avoid creating new connections for each request
  - Set reasonable `max_overflow` and `pool_timeout`

- [ ] **Background tasks use `asyncio.Task` instead of threading**
  - Prefer `asyncio.create_task()`
  - When threads are necessary, ensure proper cleanup (`thread.join()` or `daemon=True`)

- [ ] **Global variables have clear lifecycle management**
  - Avoid module-level `asyncio.run()`
  - Use FastAPI lifespan or dependency injection

- [ ] **Test environment can gracefully shutdown**
  - Run `uvicorn` then press Ctrl+C, observe exit process
  - Ensure cleanup completes within 5 seconds (Kubernetes default grace period is 30 seconds)

### Common Anti-Patterns

#### Anti-Pattern 1: Module-Level `asyncio.run()`

```python
# Don't do this
import asyncio

async def init():
    return await expensive_operation()

# Executes at module load, can't control lifecycle
result = asyncio.run(init())

# Correct approach
@asynccontextmanager
async def lifespan(app):
    result = await expensive_operation()
    app.state.result = result
    yield
    await cleanup(result)
```

#### Anti-Pattern 2: Relying on `__del__` for Resource Cleanup

```python
# Don't do this
class Client:
    def __del__(self):
        self.close()  # Execution timing uncertain

# Correct approach
class Client:
    async def close(self):
        """Explicit cleanup"""
        pass

async with Client() as client:
    pass  # Automatically calls close()
```

#### Anti-Pattern 3: Background Thread Not Set to Daemon

```python
# Don't do this
thread = threading.Thread(target=worker)  # daemon=False (default)
thread.start()
# Main thread exit will wait for this thread

# Correct approach (Option 1: daemon thread)
thread = threading.Thread(target=worker, daemon=True)
thread.start()

# Correct approach (Option 2: explicit stop)
stop_event = threading.Event()
thread = threading.Thread(target=lambda: worker(stop_event))
thread.start()
# On shutdown
stop_event.set()
thread.join(timeout=5)
```

#### Anti-Pattern 4: Missing Timeout Mechanism

```python
# Don't do this
async def cleanup():
    await some_operation()  # If stuck, waits forever

# Correct approach
async def cleanup():
    try:
        await asyncio.wait_for(some_operation(), timeout=5.0)
    except asyncio.TimeoutError:
        logger.warning("Cleanup timeout, forcing shutdown")
```

### Debugging Tips

When you encounter "process won't exit" problems, these tips help you quickly locate the issue:

#### Tip 1: View Active Threads

```python
import threading

# Print all threads in shutdown logic
for thread in threading.enumerate():
    print(f"Thread: {thread.name}, daemon: {thread.daemon}, alive: {thread.is_alive()}")
```

#### Tip 2: Use faulthandler to Print Stack

```python
import faulthandler
import signal

# Register signal handler: press Ctrl+\ to print all thread stacks
faulthandler.register(signal.SIGQUIT, all_threads=True)

# Or print directly in code
faulthandler.dump_traceback()
```

#### Tip 3: Add Shutdown Logs

```python
@asynccontextmanager
async def lifespan(app):
    logger.info("Starting application")
    resources = await init_resources()

    yield

    logger.info("Shutting down application")
    logger.info("  Closing database connections...")
    await resources.db.close()
    logger.info("  Database closed")

    logger.info("  Stopping background tasks...")
    await resources.tasks.cancel()
    logger.info("  Tasks stopped")

    logger.info("Shutdown complete")
```

Every step has logs, making it easy to locate where it's stuck.

#### Tip 4: Set Shutdown Timeout

```python
# uvicorn configuration
if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        timeout_graceful_shutdown=10,  # Force exit after 10 seconds
    )
```

### Writing Graceful Shutdown Tests

The best way to ensure your application properly cleans up resources is to **write tests**:

```python
import asyncio
import signal
import pytest
from multiprocessing import Process

def run_server():
    """Run server in subprocess"""
    import uvicorn
    from main import app

    uvicorn.run(app, host="127.0.0.1", port=8000)

@pytest.mark.asyncio
async def test_graceful_shutdown():
    """Test graceful shutdown: completes cleanup within 5 seconds"""
    # Start server process
    proc = Process(target=run_server)
    proc.start()

    # Wait for startup
    await asyncio.sleep(2)

    # Send SIGTERM
    proc.terminate()

    # Wait up to 5 seconds
    proc.join(timeout=5)

    # Assert: process has exited
    assert not proc.is_alive(), "Server failed to shutdown gracefully"

    # Assert: exit code is 0 (normal exit)
    assert proc.exitcode == 0, f"Server exited with code {proc.exitcode}"
```

This test catches:

- Timeouts due to unreleased resources
- Non-zero exit codes due to exceptions
- Thread/coroutine leaks

## Conclusion

### Key Takeaways

1. **Resource cleanup should be explicit, controllable, and testable**
   - Never rely on `__del__` for critical cleanup work
   - Use `async def close()` + context manager or lifespan
   - Write tests to verify graceful shutdown

2. **Framework-provided lifecycle hooks are best practice**
   - FastAPI's lifespan is naturally suited for managing global resources
   - More reliable and elegant than global variables + manual cleanup

3. **Graceful shutdown isn't just dev experience, it's production stability guarantee**
   - Container orchestration (Kubernetes) relies on graceful shutdown
   - Database connection pools and message queues need proper cleanup
   - User experience: fast restarts, no data loss

### Extended Thinking

This debugging experience made me rethink several deeper architectural questions:

1. **The value of dependency injection**
   - Why do we need global variables? Can we use `fastapi.Depends` to manage checkpointer?
   - Each request gets an independent database session with clearer scope

2. **Observability design**
   - Add structured logging (startup/shutdown events)
   - Expose Prometheus metrics (database connection count, shutdown duration)
   - Integrate OpenTelemetry to trace lifecycle

3. **Test-driven development**
   - With integration tests, we would have caught this earlier
   - What tools do we need to write reliable tests for async applications?

**Final advice:**

When you press Ctrl+C in your dev environment and the terminal gets stuck—**don't ignore it**. This is an early warning signal of production disasters.

Taking time to understand resource lifecycle management will make your applications more reliable, maintainable, and professional.

---

**Further Reading:**

- [FastAPI Lifespan Events](https://fastapi.tiangolo.com/advanced/events/)
- [ASGI Lifespan Protocol](https://asgi.readthedocs.io/en/latest/specs/lifespan.html)
- [Python asyncio Best Practices](https://docs.python.org/3/library/asyncio-dev.html)
- [The Problem with `__del__`](https://docs.python.org/3/reference/datamodel.html#object.__del__)
