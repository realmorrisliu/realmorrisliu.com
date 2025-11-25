import React, { useState, useEffect } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { AgentChat } from "./AgentChat";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsPanel } from "./SettingsPanel";
import { UserButton, ClerkProvider } from "@clerk/clerk-react";
import { MessageSquare, Calendar as CalendarIcon } from "lucide-react";
import { ScheduleProvider } from "@/context/ScheduleContext";
import { CopilotKit } from "@copilotkit/react-core";

const PUBLISHABLE_KEY = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
const COPILOTKIT_LICENSE_KEY = import.meta.env.PUBLIC_COPILOTKIT_LICENSE_KEY;

/**
 * Get or create a unique thread ID for this user session
 * This enables conversation history persistence across page reloads
 */
function getThreadId(): string {
  const THREAD_ID_KEY = "kira_thread_id";

  // Try to get existing thread ID from localStorage
  let threadId = localStorage.getItem(THREAD_ID_KEY);

  if (!threadId) {
    // Generate new thread ID: timestamp + random string
    threadId = `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(THREAD_ID_KEY, threadId);
  }

  return threadId;
}

export const KiraApp: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeMobileView, setActiveMobileView] = useState<"chat" | "calendar">("chat");
  const [focusInputTrigger, setFocusInputTrigger] = useState(0); // Trigger for Cmd+K
  const [isInboxOpen, setIsInboxOpen] = useState(false); // State for Cmd+I
  const [jumpToTodayTrigger, setJumpToTodayTrigger] = useState(0); // Trigger for T
  const [rightPanelView, setRightPanelView] = useState<"chat" | "settings">("chat");

  // Get unique thread ID for conversation persistence
  const [threadId] = useState(() => getThreadId());

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if input is focused (except for Cmd+K/Esc)
      const isInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      // Cmd+K: Focus Chat (Global)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setFocusInputTrigger(prev => prev + 1);
        setActiveMobileView("chat");
        return;
      }

      // Cmd+I: Toggle Inbox (Global)
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        setIsInboxOpen(prev => !prev);
        if (activeMobileView === "chat") setActiveMobileView("calendar"); // Show calendar to see inbox
        return;
      }

      // Esc: Blur Input / Close Inbox
      if (e.key === "Escape") {
        if (isInputFocused) {
          (document.activeElement as HTMLElement).blur();
        } else if (isInboxOpen) {
          setIsInboxOpen(false);
        }
        return;
      }

      // Navigation Shortcuts (Only if input NOT focused)
      if (!isInputFocused) {
        // T: Jump to Today
        if (e.key === "t" || e.key === "T") {
          e.preventDefault();
          setJumpToTodayTrigger(prev => prev + 1);
          if (activeMobileView === "chat") setActiveMobileView("calendar");
        }

        // Cmd+Arrow: Navigate Days (handled in separate effect below)
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInboxOpen, activeMobileView]);

  if (!PUBLISHABLE_KEY) {
    return <div>Missing Clerk Publishable Key</div>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ScheduleProvider>
        <CopilotKit
          runtimeUrl="/api/copilotkit"
          publicLicenseKey={COPILOTKIT_LICENSE_KEY}
          agent="kira_calendar_agent"
          properties={{
            thread_id: threadId,
          }}
        >
          <div className={`${theme} h-full w-full`}>
            <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gray-50 text-gray-900 transition-colors duration-300 lg:flex-row dark:bg-black dark:text-white">
              {/* Background Ambient Effects */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[120px] transition-colors duration-300 dark:bg-purple-900/20" />
                <div className="absolute -right-[10%] -bottom-[10%] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[120px] transition-colors duration-300 dark:bg-blue-900/20" />
              </div>

              {/* Mobile Header (Visible only on mobile) */}
              <div className="relative z-20 flex items-center justify-between border-b border-black/5 bg-white/40 px-4 py-3 backdrop-blur-xl lg:hidden dark:border-white/5 dark:bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-black/10 dark:border-white/10">
                    <UserButton appearance={{ elements: { avatarBox: "w-full h-full" } }} />
                  </div>
                  <span className="font-semibold text-black dark:text-white">Kira</span>
                </div>

                {/* Mobile View Toggle */}
                <div className="flex items-center rounded-full bg-black/5 p-1 dark:bg-white/10">
                  <button
                    onClick={() => setActiveMobileView("calendar")}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${activeMobileView === "calendar" ? "bg-white text-black shadow-sm dark:bg-black dark:text-white" : "text-black/40 dark:text-white/40"}`}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveMobileView("chat")}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${activeMobileView === "chat" ? "bg-white text-black shadow-sm dark:bg-black dark:text-white" : "text-black/40 dark:text-white/40"}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>

                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>

              {/* Left Panel: Calendar (65% Desktop, Full Mobile if active) */}
              <div
                className={`relative z-10 flex h-full flex-col border-r border-black/5 bg-white/30 backdrop-blur-xl transition-all duration-300 lg:flex lg:w-[65%] dark:border-white/5 dark:bg-white/5 ${activeMobileView === "calendar" ? "flex w-full" : "hidden"}`}
              >
                {/* Desktop Header */}
                <header className="hidden items-center justify-between px-8 py-6 lg:flex">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">Kira</h1>
                    <div className="h-6 w-px bg-black/10 dark:bg-white/10" />
                    <span className="text-sm font-medium text-black/60 dark:text-white/60">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-black/10 dark:border-white/10">
                      <UserButton appearance={{ elements: { avatarBox: "w-full h-full" } }} />
                    </div>
                  </div>
                </header>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-hidden px-2 pb-2 lg:px-6 lg:pb-6">
                  <CalendarGrid
                    isInboxOpen={isInboxOpen}
                    onToggleInbox={() => setIsInboxOpen(!isInboxOpen)}
                    jumpToTodayTrigger={jumpToTodayTrigger}
                  />
                </div>
              </div>

              {/* Right Panel: AI Co-pilot (35% Desktop, Full Mobile if active) */}
              <div
                className={`relative z-10 h-full bg-white/40 backdrop-blur-2xl transition-all duration-300 lg:flex lg:w-[35%] dark:bg-black/40 ${activeMobileView === "chat" ? "flex w-full" : "hidden"}`}
              >
                {rightPanelView === "chat" ? (
                  <AgentChat
                    onOpenSettings={() => setRightPanelView("settings")}
                    focusTrigger={focusInputTrigger}
                  />
                ) : (
                  <SettingsPanel onClose={() => setRightPanelView("chat")} />
                )}
              </div>
            </div>
          </div>
        </CopilotKit>
      </ScheduleProvider>
    </ClerkProvider>
  );
};
