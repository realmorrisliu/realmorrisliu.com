# Kira Calendar Agent

AI-powered calendar and task management assistant built with LangGraph, CopilotKit, and OpenRouter.

## 🎯 Architecture Highlights

- **LangGraph**: State machine workflow engine with multi-turn conversation support
- **CopilotKit**: Seamless frontend-backend integration framework
- **OpenRouter**: Unified multi-model LLM interface (supports GPT-4, Claude, Gemini, etc.)
- **Turso Embedded Replica**: Local SQLite file + automatic cloud sync (optional)

## 🚀 Quick Start

### 1. Install Dependencies

Ensure [uv](https://docs.astral.sh/uv/) is installed, then run:

```bash
cd agent
uv sync
```

### 2. Configure Environment Variables

Edit the `.env` file (or copy from template):

```bash
# Required: OpenRouter API Key (get from https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Optional: Select model (default: google/gemini-2.0-flash-exp)
OPENROUTER_MODEL=google/gemini-2.0-flash-exp

# Environment (keep as 'dev' for development)
ENVIRONMENT=dev
```

### 3. Start the Service

```bash
uv run python main.py
```

The service will start on `http://localhost:8000`, and you'll see:

```
✓ Using SQLite checkpointer (local file: /path/to/agent/data/checkpoints.db)
✓ Database initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 🎯 Model Selection

OpenRouter supports multiple models - choose based on your needs:

| Category     | Model                         | Cost                | Use Case                  |
| ------------ | ----------------------------- | ------------------- | ------------------------- |
| **Free**     | `google/gemini-2.0-flash-exp` | Free (experimental) | Development & testing     |
| **Fast**     | `openai/gpt-4o-mini`          | $0.15/1M tokens     | Daily conversations       |
| **Balanced** | `anthropic/claude-3.5-sonnet` | $3/1M tokens        | Complex tasks             |
| **Advanced** | `openai/o1-preview`           | $15/1M tokens       | Reasoning-intensive tasks |

Full list: https://openrouter.ai/models

## 📚 Verify Deployment

After starting, verify the service is running by accessing these endpoints:

```bash
# Health check
curl http://localhost:8000/health
# Response: {"status": "healthy"}

# API documentation
open http://localhost:8000/docs
```

## 🗄️ Database Configuration Guide

### Three-Stage Evolution Strategy

```
Stage 1 (Now): SQLite Local File
  ↓ Zero configuration, ready to use
Stage 2 (Real Users): Turso Free Tier
  ↓ 9GB free storage, global edge deployment
Stage 3 (Scale): Turso Paid or migrate to other solutions
```

### Stage 1: Local Development (Recommended Starting Point)

**Configuration**: Set `ENVIRONMENT=dev` in `.env`

```bash
ENVIRONMENT=dev
```

**Effect**:

- Automatically creates SQLite database at `agent/data/checkpoints.db`
- Conversation history persisted to local file
- No data loss on service restart
- Suitable for development, testing, and demos

**Advantages**:

- ✅ Zero configuration, works out of the box
- ✅ No network connection required
- ✅ Completely free
- ✅ Directly inspect data with SQLite tools

### Stage 2: Production Deployment (Using Turso Embedded Replica)

When you're ready to deploy to production and need cloud sync, enable Turso Embedded Replica mode.

#### What is Embedded Replica?

Turso's Embedded Replica is an intelligent sync mechanism:

```
Local Operations (Your App)
    ↓ Read/write local SQLite file
data/checkpoints.db (Low latency)
    ↓ libsql auto-syncs in background
Turso Cloud Database (Distributed access + Auto backup)
```

#### Why Choose Embedded Replica?

| Advantage                 | Description                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| **Zero Code Intrusion**   | No need to modify LangGraph code                                    |
| **Local First**           | Read/write operations directly access local file, ultra-low latency |
| **Auto Sync**             | Background sync to cloud, no manual handling                        |
| **Offline Works**         | Continues to function during network outages                        |
| **Generous Free Tier**    | 9GB storage + 1B row reads/month                                    |
| **No Cold Starts**        | Unlike Supabase sleep mode, always online                           |
| **Perfect Compatibility** | Based on LibSQL (SQLite fork), consistent API                       |

#### Turso Configuration Steps

**1. Install Turso CLI**

```bash
# macOS / Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex
```

**2. Sign Up and Login**

```bash
turso auth signup  # First-time registration
turso auth login   # Subsequent logins
```

**3. Create Database**

```bash
# Create database
turso db create kira-agent

# View database info
turso db show kira-agent
```

**4. Get Connection Credentials**

```bash
# Get database URL
turso db show kira-agent --url
# Example output: libsql://kira-agent-yourorg.turso.io

# Create access token (never expires)
turso db tokens create kira-agent --expiration none
# Example output: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

**5. Update `.env` File**

```bash
# Keep or switch to production mode (optional)
ENVIRONMENT=prod

# Fill in Turso credentials (enables cloud sync)
TURSO_DATABASE_URL=libsql://kira-agent-yourorg.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
TURSO_SYNC_INTERVAL=60  # Optional, default 60 seconds
```

**6. Restart Service**

```bash
uv run python main.py
```

You'll see:

```
✓ Initializing Turso embedded replica
  Local DB: /path/to/agent/data/checkpoints.db
  Sync URL: libsql://kira-agent-yourorg.turso.io
  Sync interval: 60s
✓ Turso sync enabled (embedded replica mode)
✓ Checkpointer initialized
✓ Graph compiled successfully
```

**How it works**:

- App continues to read/write local SQLite file (low latency)
- libsql automatically syncs to Turso cloud every 60 seconds in the background
- Cloud data can be accessed by other instances, enabling distributed capabilities
- If network is interrupted, app continues running locally, and syncs when restored

#### Turso Data Management

```bash
# List all databases
turso db list

# Connect to database (SQL shell)
turso db shell kira-agent

# View table schema
.schema

# Query conversation history
SELECT * FROM checkpoints LIMIT 10;

# Delete database (dangerous!)
turso db destroy kira-agent
```

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────┐
│          Frontend (Astro + React)            │
│  src/components/kira/KiraApp.tsx             │
│  - useCopilotChat (conversation management)  │
│  - useCopilotAction (frontend Actions)       │
│  - thread_id session isolation               │
└─────────────────┬────────────────────────────┘
                  │
                  │ HTTP POST /api/copilotkit
                  │ GraphQL streaming
                  │
┌─────────────────▼────────────────────────────┐
│      FastAPI Backend (agent/main.py)         │
│  - CopilotKit Runtime                        │
│  - CORS middleware                           │
│  - LangGraph agent integration               │
└─────────────────┬────────────────────────────┘
                  │
                  │ Calls graph.stream()
                  │
┌─────────────────▼────────────────────────────┐
│     LangGraph Workflow (agent/agent.py)      │
│  ┌──────────────────────────────────────┐   │
│  │  chat_node:                          │   │
│  │  1. Get frontend Actions             │   │
│  │  2. Bind LLM tools                   │   │
│  │  3. Call OpenRouter                  │   │
│  │  4. Stream responses                 │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  State: KiraAgentState                      │
│  - messages: conversation history           │
│  - copilotkit: frontend Actions             │
└─────────────────┬────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐  ┌──────────┐  ┌──────────────┐
│OpenRouter│  │Checkpointer│  │Frontend Actions│
│API      │  │(SQLite/   │  │(addEvent,    │
│         │  │ Turso)    │  │ addTask...)  │
└────────┘  └──────────┘  └──────────────┘
 Multi-model   State         Frontend tool
 support       persistence   calling
```

### Key Component Description

| Component           | Responsibility                                           | Tech Stack                 |
| ------------------- | -------------------------------------------------------- | -------------------------- |
| **Frontend**        | UI rendering, user interaction, Action registration      | Astro + React + CopilotKit |
| **FastAPI Server**  | HTTP service, CORS, CopilotKit Runtime integration       | FastAPI + Uvicorn          |
| **LangGraph Agent** | Workflow orchestration, LLM calls, state management      | LangGraph + LangChain      |
| **Checkpointer**    | Conversation history persistence, cross-session recovery | SQLite / Turso (LibSQL)    |
| **OpenRouter**      | Unified LLM interface, multi-model switching             | OpenRouter API             |

## 🛠️ Environment Variables Reference

| Variable             | Required    | Default                       | Description                                       |
| -------------------- | ----------- | ----------------------------- | ------------------------------------------------- |
| `OPENROUTER_API_KEY` | ✅          | -                             | OpenRouter API key                                |
| `OPENROUTER_MODEL`   | ❌          | `google/gemini-2.0-flash-exp` | LLM model name                                    |
| `ENVIRONMENT`        | ❌          | `dev`                         | Runtime environment: `dev`(local) / `prod`(Turso) |
| `TURSO_DATABASE_URL` | Conditional | -                             | Turso database URL (required for prod)            |
| `TURSO_AUTH_TOKEN`   | Conditional | -                             | Turso access token (required for prod)            |
| `ALLOWED_ORIGINS`    | ❌          | `http://localhost:4321`       | CORS allowed origins (comma-separated)            |
| `PORT`               | ❌          | `8000`                        | Service port                                      |

## 🔧 Troubleshooting

### Q: "no checkpointer set" error

**Cause**: LangGraph requires a checkpointer to persist state.

**Solution**: Ensure `graph = workflow.compile(checkpointer=checkpointer)` in `agent.py` is correctly configured. This project is already configured, but if you still see the error, check that dependencies are installed:

```bash
uv sync
```

### Q: Invalid OpenRouter API Key

**Checklist**:

1. Confirm `.env` file is in the `agent/` directory
2. Visit https://openrouter.ai/keys to verify key validity
3. Ensure key prefix is `sk-or-v1-`

### Q: CORS Error

**Cause**: Frontend domain not in allowed list.

**Solution**: Update `ALLOWED_ORIGINS` in `.env`:

```bash
ALLOWED_ORIGINS=http://localhost:4321,https://yourdomain.com
```

### Q: Turso Connection Failed

**Checklist**:

- [ ] Confirm `ENVIRONMENT=prod`
- [ ] `TURSO_DATABASE_URL` format: `libsql://xxx.turso.io`
- [ ] `TURSO_AUTH_TOKEN` is complete JWT token
- [ ] Run `turso db list` to confirm database exists
- [ ] Network can access Turso service (check firewall)

### Q: Model Response Slow or Timeout

**Optimization Tips**:

1. **Choose faster model**: e.g., `google/gemini-2.0-flash-exp`
2. **Adjust timeout settings**: Add `timeout` parameter in `agent.py`
3. **Check network**: OpenRouter API may be slower in certain regions

### Q: Where is the local database file?

**Location**: `agent/data/checkpoints.db`

**View contents**:

```bash
# Use sqlite3 command-line tool
sqlite3 agent/data/checkpoints.db

# View table schema
.schema

# Query conversation history
SELECT * FROM checkpoints;
```

### Q: How to clear conversation history?

**Development Environment**:

```bash
# Delete local database file
rm agent/data/checkpoints.db

# Restart service will auto-rebuild
uv run python main.py
```

**Production Environment (Turso)**:

```bash
# Connect to database
turso db shell kira-agent

# Clear table data
DELETE FROM checkpoints;
DELETE FROM checkpoint_writes;
```

## 🚀 Deploy to Production

### Cloudflare Pages (Recommended)

Your frontend is already hosted on Cloudflare Pages. The backend can use Cloudflare Workers or other services.

#### Option 1: Railway (Easiest)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd agent
railway init

# 4. Set environment variables
railway variables set ENVIRONMENT=prod
railway variables set OPENROUTER_API_KEY=your-key
railway variables set TURSO_DATABASE_URL=your-url
railway variables set TURSO_AUTH_TOKEN=your-token

# 5. Deploy
railway up
```

#### Option 2: Render

1. Create Web Service in Render Dashboard
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `cd agent && uv sync`
   - **Start Command**: `cd agent && uv run python main.py`
   - **Environment**: Add environment variables above
4. Deploy

### Frontend Configuration

After deploying backend, update frontend API address:

```typescript
// src/pages/api/copilotkit.ts
const AGENT_API_URL = import.meta.env.AGENT_API_URL || "https://your-backend.railway.app";
```

Add to Cloudflare Pages environment variables:

```
AGENT_API_URL=https://your-backend.railway.app
```

## 📊 Monitoring and Logs

### View Conversation Statistics

```bash
# Development environment (local database)
sqlite3 agent/data/checkpoints.db "SELECT COUNT(*) as total_conversations FROM checkpoints;"

# Production environment (Turso)
turso db shell kira-agent "SELECT COUNT(*) as total_conversations FROM checkpoints;"
```

### View Recent Conversations

```sql
-- Recent 10 conversation records
SELECT
    thread_id,
    checkpoint_id,
    datetime(checkpoint_ns / 1000000000, 'unixepoch') as created_at
FROM checkpoints
ORDER BY checkpoint_ns DESC
LIMIT 10;
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Local Development Workflow

1. Fork the repository
2. Clone locally: `git clone https://github.com/your-username/realmorrisliu.com`
3. Install dependencies: `cd agent && uv sync`
4. Create branch: `git checkout -b feature/your-feature`
5. Commit changes: `git commit -am 'Add some feature'`
6. Push branch: `git push origin feature/your-feature`
7. Create Pull Request

## 📚 Related Documentation

- [LangGraph Official Docs](https://langchain-ai.github.io/langgraph/)
- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Turso Documentation](https://docs.turso.tech/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details
