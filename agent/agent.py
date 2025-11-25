"""
Kira Calendar Agent - LangGraph Implementation
This agent helps users manage their calendar events and tasks.
Uses OpenRouter for flexible model selection.
Supports SQLite (local dev) and Turso embedded replica (production) for persistent state storage.
"""

import os
from typing import Annotated, List
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableConfig
from copilotkit import CopilotKitState
from turso_checkpointer import get_turso_checkpointer_from_env


class KiraAgentState(CopilotKitState):
    """
    Kira agent state - inherits CopilotKitState to get frontend actions

    CopilotKitState provides:
    - copilotkit: dict containing frontend actions registered via useCopilotAction
    - messages: list of conversation messages
    """

    messages: Annotated[List[BaseMessage], add_messages]


async def chat_node(state: KiraAgentState, config: RunnableConfig):
    """
    Main chat node - calls LLM and binds frontend tools

    This node:
    1. Gets frontend actions (addTask, addEvent, etc.) from state
    2. Initializes the LLM model via OpenRouter
    3. Binds frontend tools to the model
    4. Calls the LLM with system prompt and conversation history
    5. Returns the response
    """
    # 1. Get frontend actions registered via useCopilotAction
    frontend_actions = state.get("copilotkit", {}).get("actions", [])

    # 2. Initialize LLM via OpenRouter
    # OpenRouter provides access to multiple models with a unified API
    model = ChatOpenAI(
        model=os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        temperature=0.7,
        streaming=True,
        default_headers={
            "HTTP-Referer": "https://realmorrisliu.com",  # Optional: for rankings
            "X-Title": "Kira Calendar Agent",  # Optional: for rankings
        },
    )

    # 3. Bind frontend tools to the model
    # Tools will be executed on the frontend via CopilotKit
    model_with_tools = model.bind_tools(frontend_actions)

    # 4. Define system prompt
    system_message = SystemMessage(
        content="""You are Kira, an intelligent and efficient calendar assistant.

Your capabilities:
- Help users schedule events and manage their calendar
- Add, update, and delete calendar events
- Manage tasks in the user's inbox
- Provide smart scheduling suggestions
- Answer questions about the user's schedule

Guidelines:
- Be concise and friendly
- Always confirm actions before executing them
- Suggest optimal time slots when scheduling
- Respect the user's working hours (6 AM - 10 PM by default)
- Check for conflicts before adding events"""
    )

    # 5. Call LLM with full conversation history
    response = await model_with_tools.ainvoke(
        [system_message, *state["messages"]], config
    )

    return {"messages": [response]}


async def get_checkpointer():
    """
    Get checkpointer for conversation history persistence

    Returns:
        Tuple[AsyncSqliteSaver, TursoSyncedCheckpointer]:
            - checkpointer: LangGraph checkpointer with optional Turso sync
            - turso_checkpointer: TursoSyncedCheckpointer instance for cleanup

    Behavior:
        - Development (ENVIRONMENT=dev): Local SQLite only
        - Production (ENVIRONMENT=prod + Turso config): Local SQLite + Cloud sync
    """
    environment = os.getenv("ENVIRONMENT", "dev")
    print(f"✓ Initializing checkpointer (environment: {environment})")

    # Create Turso synced checkpointer
    turso_checkpointer = get_turso_checkpointer_from_env()

    # Get async checkpointer instance
    checkpointer = await turso_checkpointer.get_checkpointer()

    # Return both for cleanup access
    return checkpointer, turso_checkpointer


# Build the StateGraph
workflow = StateGraph(KiraAgentState)

# Add nodes
workflow.add_node("chat", chat_node)

# Define edges
workflow.set_entry_point("chat")
workflow.add_edge("chat", END)

# Note: Graph compilation is done in main.py after async initialization
# This allows proper setup of async checkpointer
