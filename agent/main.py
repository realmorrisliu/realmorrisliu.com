"""
Kira Calendar Agent - FastAPI Server
Integrates LangGraph agent with CopilotKit
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from copilotkit import LangGraphAGUIAgent
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from dotenv import load_dotenv
from agent import workflow, get_checkpointer

# Load environment variables
load_dotenv()

# Global variables for graph and checkpointer
graph = None
checkpointer = None
turso_checkpointer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan event handler
    Handles startup and shutdown logic for proper resource management
    """
    global graph, checkpointer, turso_checkpointer

    # Startup: Initialize agent
    print("🚀 Starting Kira agent...")

    # Initialize checkpointer (with Turso sync if configured)
    checkpointer, turso_checkpointer = await get_checkpointer()
    print("✓ Checkpointer initialized")

    # Compile graph with checkpointer
    graph = workflow.compile(checkpointer=checkpointer)
    print("✓ Graph compiled successfully")

    # Register LangGraph + CopilotKit endpoint with compiled graph
    add_langgraph_fastapi_endpoint(
        app=app,
        agent=LangGraphAGUIAgent(
            name="kira_calendar_agent",
            description="Intelligent calendar and task management assistant that helps you organize your schedule, add events, manage tasks, and stay productive.",
            graph=graph,
        ),
        path="/copilotkit",
    )
    print("✓ CopilotKit endpoint registered")
    print("✓ Kira agent ready")

    yield

    # Shutdown: Clean up resources
    print("\n🛑 Shutting down Kira agent...")

    if turso_checkpointer:
        await turso_checkpointer.close()

    print("✓ Kira agent shutdown complete")


# Initialize FastAPI app with lifespan handler
app = FastAPI(
    title="Kira Calendar Agent API",
    description="AI-powered calendar and task management assistant",
    version="1.0.0",
    lifespan=lifespan,
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


@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "status": "ok",
        "message": "Kira Calendar Agent API is running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    # Run the server
    uvicorn.run(
        app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)), log_level="info"
    )
