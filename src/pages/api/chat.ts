import type { APIRoute } from "astro";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();

    // 1. Get Configuration from Headers
    const provider = request.headers.get("X-Provider") || "openai";
    const apiKey = request.headers.get("X-Api-Key");

    if (!apiKey) {
      return new Response("Missing API Key", { status: 401 });
    }

    // 2. Initialize Provider based on selection
    let model;
    if (provider === "google") {
      const google = createGoogleGenerativeAI({ apiKey });
      model = google("gemini-1.5-flash");
    } else if (provider === "openrouter") {
      const openrouter = createOpenRouter({
        apiKey,
      });
      model = openrouter("openai/gpt-4o-mini");
    } else {
      const openai = createOpenAI({ apiKey });
      model = openai("gpt-4o-mini"); // Default to mini for speed/cost
    }

    // 3. Stream Text with Tools
    const result = streamText({
      model,
      messages: convertToModelMessages(messages),
      system: `You are Kira, an intelligent and efficient calendar assistant.
      
      Your goal is to help the user manage their schedule and tasks.
      You have access to tools to View, Add, Update, and Delete events and tasks.
      
      Current Date: ${new Date().toLocaleString()}
      
      Rules:
      - Be concise and direct.
      - When adding events, ask for clarification if the time or duration is ambiguous, but make reasonable assumptions (e.g., "tomorrow morning" = 9 AM).
      - Always confirm the action you are about to take or have taken.
      - If the user asks to "Focus", suggest moving tasks to the Day Pool.
      `,
      tools: {
        addEvent: tool({
          description: "Add a new event to the schedule",
          inputSchema: z.object({
            title: z.string().describe("The title of the event"),
            start: z.string().describe("ISO date string for start time"),
            end: z.string().describe("ISO date string for end time"),
            description: z.string().optional().describe("Optional description"),
          }),
        }),
        addTask: tool({
          description: "Add a new task to the inbox or day pool",
          inputSchema: z.object({
            title: z.string().describe("The title of the task"),
            tag: z.enum(["work", "personal", "urgent"]).optional().describe("Tag for the task"),
          }),
        }),
        updateEvent: tool({
          description: "Update an existing event",
          inputSchema: z.object({
            id: z.string().describe("The ID of the event to update"),
            updates: z
              .object({
                title: z.string().optional(),
                start: z.string().optional(),
                end: z.string().optional(),
              })
              .describe("Fields to update"),
          }),
        }),
        deleteEvent: tool({
          description: "Delete an event",
          inputSchema: z.object({
            id: z.string().describe("The ID of the event to delete"),
          }),
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
