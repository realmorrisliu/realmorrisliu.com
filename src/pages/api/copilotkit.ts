/**
 * CopilotKit Runtime API Endpoint
 * Handles GraphQL requests from CopilotKit frontend and communicates with Python LangGraph agent
 */

import type { APIRoute } from "astro";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { LangGraphHttpAgent } from "@ag-ui/langgraph";

// Agent API URL - defaults to localhost in development
const AGENT_API_URL = import.meta.env.AGENT_API_URL || "http://localhost:8000";

// Use empty adapter since we're using a single LangGraph agent
const serviceAdapter = new ExperimentalEmptyAdapter();

// Create CopilotRuntime with LangGraph agent
const runtime = new CopilotRuntime({
  agents: {
    kira_calendar_agent: new LangGraphHttpAgent({
      url: `${AGENT_API_URL}/copilotkit`,
    }),
  },
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Use the Next.js App Router endpoint handler (works with standard Web API Request/Response)
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    return await handleRequest(request as any);
  } catch (error) {
    console.error("CopilotKit runtime error:", error);

    return new Response(
      JSON.stringify({
        error: "CopilotKit runtime error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Handle OPTIONS requests for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
