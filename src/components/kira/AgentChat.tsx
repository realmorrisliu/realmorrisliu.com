import React, { useState, useEffect, useRef } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { useCopilotChatHeadless_c } from "@copilotkit/react-core";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Mic, Settings } from "lucide-react";
import { useSchedule } from "@/context/ScheduleContext";
import type { EventType } from "@/types/kira";

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

  // Input state
  const [input, setInput] = useState("");

  // Register frontend actions (tools) with CopilotKit
  // These will be available to the LangGraph agent
  useCopilotAction({
    name: "addTask",
    description: "Add a new task to the user's inbox",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The task title or description",
        required: true,
      },
      {
        name: "tag",
        type: "string",
        description: "Task category (work, personal, urgent, wellness, study, social)",
        required: false,
      },
    ],
    handler: async ({ title, tag }) => {
      addTask({
        title,
        tag: (tag as EventType) || "work",
      });
      return `Task "${title}" added successfully`;
    },
  });

  useCopilotAction({
    name: "addEvent",
    description: "Add a calendar event to the user's schedule",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The event title",
        required: true,
      },
      {
        name: "start",
        type: "string",
        description: "Event start time in ISO format (e.g., 2025-01-15T10:00:00)",
        required: true,
      },
      {
        name: "end",
        type: "string",
        description: "Event end time in ISO format (e.g., 2025-01-15T11:00:00)",
        required: true,
      },
      {
        name: "type",
        type: "string",
        description: "Event type (work, personal, urgent, wellness, study, social)",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Optional event description",
        required: false,
      },
    ],
    handler: async ({ title, start, end, type, description }) => {
      const newEvent = {
        title,
        start: new Date(start),
        end: new Date(end),
        type: (type as EventType) || "work",
        description,
      };
      addEvent(newEvent);
      return `Event "${title}" scheduled for ${new Date(start).toLocaleTimeString()}`;
    },
  });

  // CopilotKit chat hook - for headless UI
  const { messages, sendMessage, isLoading } = useCopilotChatHeadless_c();

  // Focus Input on Trigger
  useEffect(() => {
    if (focusTrigger > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusTrigger]);

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
        {messages.map(m => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "user" ? (
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-blue-500/30 px-5 py-3 text-[15px] leading-relaxed text-black/90 backdrop-blur-md dark:bg-blue-400/20 dark:text-white/90">
                {m.content}
              </div>
            ) : (
              <div className="max-w-[90%] text-[15px] leading-relaxed text-black/70 dark:text-white/70">
                {m.content}
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
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
          onSubmit={async e => {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              await sendMessage({
                id: Date.now().toString(),
                role: "user",
                content: input,
              });
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
                disabled={isLoading}
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
