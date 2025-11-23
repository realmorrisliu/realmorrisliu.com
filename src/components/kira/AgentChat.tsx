import React, { useState, useEffect, useRef } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Loader2, Mic, Settings } from "lucide-react";
import { useSchedule } from "@/context/ScheduleContext";
import type { EventType } from "@/types/kira";

interface V5ToolCall {
  toolName: string;
  toolCallId: string;
  args: unknown;
}

interface RenderTool {
  toolName: string;
  toolCallId: string;
  result?: unknown;
}

interface AgentChatProps {
  onOpenSettings: () => void;
  focusTrigger?: number;
  className?: string;
}

export const AgentChat: React.FC<AgentChatProps> = ({
  onOpenSettings,
  focusTrigger = 0,
  className = "",
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    addTask,
    addEvent,
    updateEvent: _updateEvent,
    deleteEvent: _deleteEvent,
    state,
  } = useSchedule();
  const { tasks } = state;
  const todoCount = tasks.filter(t => t.status === "todo").length;

  // Load Config (Lazy Initialization)
  const [config, setConfig] = useState(() => {
    if (typeof window === "undefined") return { provider: "openai", apiKey: "" };
    const provider = localStorage.getItem("kira_provider") || "openai";
    const apiKey =
      provider === "google"
        ? localStorage.getItem("kira_google_key")
        : provider === "openrouter"
          ? localStorage.getItem("kira_openrouter_key")
          : localStorage.getItem("kira_openai_key");
    return { provider, apiKey: apiKey || "" };
  });

  // Listen for settings updates
  useEffect(() => {
    const loadConfig = () => {
      const provider = localStorage.getItem("kira_provider") || "openai";
      const apiKey =
        provider === "google"
          ? localStorage.getItem("kira_google_key")
          : provider === "openrouter"
            ? localStorage.getItem("kira_openrouter_key")
            : localStorage.getItem("kira_openai_key");
      setConfig({ provider, apiKey: apiKey || "" });
    };

    window.addEventListener("kira-settings-updated", loadConfig);
    return () => window.removeEventListener("kira-settings-updated", loadConfig);
  }, []);

  // Focus Input on Trigger
  useEffect(() => {
    if (focusTrigger > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusTrigger]);

  // Manual input state management for AI SDK v5
  const [input, setInput] = useState("");

  // Vercel AI SDK Hook
  const { messages, sendMessage, status, addToolOutput } = useChat({
    // @ts-ignore - api and headers are valid in v5 but types might be mismatched
    api: "/api/chat",
    headers: {
      "X-Provider": config.provider,
      "X-Api-Key": config.apiKey,
    },
    async onToolCall({ toolCall }) {
      console.log("Tool Call:", toolCall);

      // Cast to interface to access args which exists at runtime but is missing in strict type definition
      const call = toolCall as unknown as V5ToolCall;

      if (call.toolName === "addTask") {
        const taskArgs = call.args as { title: string; tag?: string };
        addTask({ title: taskArgs.title, tag: (taskArgs.tag as EventType) || "work" });
        // Use addToolOutput for v5 (addToolResult is deprecated)
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: `Task "${taskArgs.title}" added successfully`,
        });
      } else if (call.toolName === "addEvent") {
        const eventArgs = call.args as {
          title: string;
          start: string;
          end: string;
          description?: string;
        };
        addEvent({
          title: eventArgs.title,
          start: new Date(eventArgs.start),
          end: new Date(eventArgs.end),
          description: eventArgs.description,
          type: "work",
        });
        // Use addToolOutput for v5 (addToolResult is deprecated)
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: `Event "${eventArgs.title}" scheduled for ${new Date(eventArgs.start).toLocaleTimeString()}`,
        });
      }
    },
    onError: (error: Error) => {
      console.error("Chat Error:", error);
      if (error.message.includes("401")) {
        onOpenSettings();
      }
    },
  });

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-end px-4 py-6">
        <button 
            onClick={onOpenSettings}
            className="flex h-10 w-10 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/80 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white/80"
        >
            <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Chat History */}
      <div className="scrollbar-hide relative z-10 flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-6">
        {/* Empty State / Greeting */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[90%] space-y-3">
              <div className="text-[15px] leading-relaxed text-black/70 dark:text-white/70">
                <p>
                  Good morning, Morris.{" "}
                  <span className="text-purple-600/70 dark:text-purple-400/70">Ready to flow?</span>
                </p>
                <p className="mt-2 text-black/50 dark:text-white/50">
                  You have {todoCount} items in your inbox.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setInput("Review my tasks")}
                  className="group flex items-center gap-1.5 rounded-lg bg-purple-500/5 px-3 py-1.5 text-xs font-medium text-purple-700/70 transition-all hover:bg-purple-500/10 dark:bg-purple-400/5 dark:text-purple-300/70 dark:hover:bg-purple-400/10"
                >
                  <span>Review Tasks</span>
                  <ArrowRight className="h-3 w-3 opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => setInput("Start focus mode")}
                  className="group flex items-center gap-1.5 rounded-lg bg-black/5 px-3 py-1.5 text-xs font-medium text-black/60 transition-all hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
                >
                  <span>Start Focus Mode</span>
                  <ArrowRight className="h-3 w-3 opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((m: UIMessage) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "user" ? (
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-blue-500/30 px-5 py-3 text-[15px] leading-relaxed text-black/90 backdrop-blur-md dark:bg-blue-400/20 dark:text-white/90">
                {m.parts.map((part, i) => (
                  <React.Fragment key={i}>{part.type === "text" && part.text}</React.Fragment>
                ))}
              </div>
            ) : (
              <div className="max-w-[90%] text-[15px] leading-relaxed text-black/70 dark:text-white/70">
                {m.parts.map((part, i) => {
                  if (part.type === "text") {
                    return <span key={i}>{part.text}</span>;
                  }
                  if (part.type === "tool-invocation" && "toolInvocation" in part) {
                    const tool = part.toolInvocation as unknown as RenderTool;
                    return (
                      <div
                        key={tool.toolCallId}
                        className="mt-2 rounded bg-black/5 p-2 font-mono text-xs opacity-70 dark:bg-white/5"
                      >
                        <div className="flex items-center gap-2 font-bold">
                          <Sparkles className="h-3 w-3" />
                          {tool.toolName}
                        </div>
                        {"result" in tool ? (
                          <div className="mt-1 text-green-600 dark:text-green-400">
                            Done: {JSON.stringify(tool.result)}
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Running...
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </motion.div>
        ))}

        {(status === "submitted" || status === "streaming") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-black/5 px-4 py-2 dark:bg-white/10">
              <Loader2 className="h-4 w-4 animate-spin opacity-50" />
              <span className="text-xs opacity-50">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 lg:p-6">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) {
              if (!config.apiKey) {
                onOpenSettings();
                return;
              }
              // Use parts array for v5
              // @ts-ignore - sendMessage accepts options in v5
              sendMessage(
                { parts: [{ type: "text", text: input }] },
                { headers: { "X-Provider": config.provider, "X-Api-Key": config.apiKey } }
              );
              setInput("");
            }
          }}
          className="relative flex items-center overflow-hidden rounded-2xl border border-black/5 bg-white/40 p-1 backdrop-blur-xl transition-all duration-300 focus-within:border-purple-500/20 focus-within:bg-white/60 dark:border-white/5 dark:bg-black/20 dark:focus-within:border-purple-400/20 dark:focus-within:bg-black/30"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Kira..."
            className="flex-1 bg-transparent px-4 py-3 text-[15px] text-black/80 placeholder-black/30 transition-colors duration-300 outline-none dark:text-white/80 dark:placeholder-white/30"
          />

          <AnimatePresence>
            {input ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="submit"
                disabled={status === "submitted" || status === "streaming"}
                className="mr-1 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/30 text-black/80 backdrop-blur-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 dark:bg-blue-400/20 dark:text-white/80"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <div className="mr-1 flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-black/40 transition-colors hover:bg-black/5 hover:text-black/60 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white/60"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <div className="mr-2 hidden h-6 items-center justify-center rounded-lg bg-black/5 px-2 text-[10px] font-medium text-black/30 lg:flex dark:bg-white/5 dark:text-white/30">
                  ⌘K
                </div>
              </div>
            )}
          </AnimatePresence>
        </form>

        {/* Connection Status (Subtle) - Removed as it's now in the header */}
      </div>
    </div>
  );
};

