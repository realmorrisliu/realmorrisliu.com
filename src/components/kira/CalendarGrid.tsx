
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Inbox, CheckCircle2, Plus, X } from "lucide-react";
import { useSchedule } from "@/context/ScheduleContext";
import type { Task } from "@/types/kira";
import { getTaskColor } from "@utils/kiraStyles";
import { CalendarEventCard } from "./CalendarEventCard";
import { EventDetails } from "./EventDetails";

interface CalendarGridProps {
  isInboxOpen?: boolean;
  onToggleInbox?: () => void;
  jumpToTodayTrigger?: number;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ jumpToTodayTrigger = 0 }) => {
  const { state, toggleTaskStatus, updateEvent, deleteEvent, addTask } = useSchedule();
  const { events, tasks, preferences } = state;

  // View State
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showMobileInbox, setShowMobileInbox] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [_isSettingsOpen, _setIsSettingsOpen] = useState(false);

  const addTaskInputRef = useRef<HTMLInputElement>(null);
  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // Update Current Time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle Jump to Today
  useEffect(() => {
    if (jumpToTodayTrigger > 0) {
      // Defer state update to avoid synchronous setState-in-effect warning
      setTimeout(() => setViewDate(new Date()), 0);
    }
  }, [jumpToTodayTrigger]);

  // Date Helpers
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const getRelativeDayName = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    if (isSameDay(date, tomorrow)) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Navigation (defined before useEffect that uses them)
  const navigateDay = (offset: number) => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  const setDayTo = (target: "yesterday" | "today" | "tomorrow") => {
    const today = new Date();
    if (target === "today") setViewDate(today);
    if (target === "yesterday") {
      const d = new Date(today);
      d.setDate(today.getDate() - 1);
      setViewDate(d);
    }
    if (target === "tomorrow") {
      const d = new Date(today);
      d.setDate(today.getDate() + 1);
      setViewDate(d);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        // On mobile, toggle inbox. On desktop, focus input.
        if (window.innerWidth < 768) {
          setShowMobileInbox(prev => !prev);
        } else {
          addTaskInputRef.current?.focus();
        }
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case "[":
          navigateDay(-1);
          break;
        case "]":
          navigateDay(1);
          break;
        case "t":
          setDayTo("today");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // navigateDay and setDayTo are stable functions, no need to include in deps
  }, []);

  // Filter Data for View
  const dayEvents = events.filter(e => isSameDay(e.start, viewDate));
  const dayTasks = state.dayPool
    .filter(item => isSameDay(item.date, viewDate))
    .map(item => tasks.find(t => t.id === item.taskId))
    .filter(Boolean) as typeof tasks;

  const inboxTasks = tasks.filter(t => {
    const isScheduled = state.dayPool.some(item => item.taskId === t.id);
    return !isScheduled && t.status === "todo";
  });

  // Time Slots (Dynamic based on preferences)
  const startHour = preferences?.workingHours?.start ?? 6;
  const endHour = preferences?.workingHours?.end ?? 22;
  const timeSlots = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  // Current Time Position
  const getCurrentTimePosition = () => {
    const now = currentTime;
    if (!isSameDay(now, viewDate)) return null;

    const hour = now.getHours();
    const min = now.getMinutes();

    // Range Check
    if (hour < startHour || hour > endHour) return null;

    return (hour - startHour) * 60 + min;
  };

  const currentTimePos = getCurrentTimePosition();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white/40 shadow-2xl backdrop-blur-xl transition-colors duration-300 md:flex-row dark:border-white/10 dark:bg-white/5">
      {/* Main Stream Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 1. Header: Horizon Navigation */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-black/5 bg-white/30 px-4 py-4 backdrop-blur-md md:px-6 dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex rounded-full bg-black/5 p-1 dark:bg-white/10">
              <button
                onClick={() => setDayTo("yesterday")}
                className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all md:px-4 ${getRelativeDayName(viewDate) === "Yesterday" ? "bg-white text-black shadow-sm dark:bg-white/20 dark:text-white" : "text-black/40 hover:text-black/60 dark:text-white/40 dark:hover:text-white/60"}`}
              >
                <span className="hidden md:inline">Yesterday</span>
                <span className="md:hidden">Yest</span>
                {getRelativeDayName(viewDate) === "Yesterday" && (
                  <span className="hidden opacity-50 sm:inline">[</span>
                )}
              </button>
              <button
                onClick={() => setDayTo("today")}
                className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all md:px-4 ${getRelativeDayName(viewDate) === "Today" ? "bg-white text-black shadow-sm dark:bg-white/20 dark:text-white" : "text-black/40 hover:text-black/60 dark:text-white/40 dark:hover:text-white/60"}`}
              >
                Today
                <span className="hidden opacity-50 sm:inline">T</span>
              </button>
              <button
                onClick={() => setDayTo("tomorrow")}
                className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all md:px-4 ${getRelativeDayName(viewDate) === "Tomorrow" ? "bg-white text-black shadow-sm dark:bg-white/20 dark:text-white" : "text-black/40 hover:text-black/60 dark:text-white/40 dark:hover:text-white/60"}`}
              >
                <span className="hidden md:inline">Tomorrow</span>
                <span className="md:hidden">Tom</span>
                {getRelativeDayName(viewDate) === "Tomorrow" && (
                  <span className="hidden opacity-50 sm:inline">]</span>
                )}
              </button>
            </div>
            <div className="hidden h-4 w-px bg-black/10 md:block dark:bg-white/10" />
            <div className="hidden text-sm font-semibold text-black/80 md:block dark:text-white/80">
              {viewDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Mobile Inbox Toggle */}
          <button
            onClick={() => setShowMobileInbox(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/60 md:hidden dark:bg-white/10 dark:text-white/60"
          >
            <Inbox className="h-4 w-4" />
            {inboxTasks.length > 0 && (
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
            )}
          </button>

          {/* Summary / Insight (Desktop) */}
          <div className="hidden text-xs text-black/40 md:block dark:text-white/40">
            {getRelativeDayName(viewDate) === "Today" && "Focus on what matters now."}
            {getRelativeDayName(viewDate) === "Yesterday" && "Reviewing past achievements."}
            {getRelativeDayName(viewDate) === "Tomorrow" && "Planning ahead."}
          </div>
        </div>

        {/* 2. Scrollable Stream */}
        <div className="scrollbar-hide flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl p-4 md:p-6">
            {/* A. Day Pool (Focus Tasks) */}
            <div className="mb-8">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                <CheckCircle2 className="h-3 w-3" />
                Focus Tasks
              </h3>
              <div className="space-y-2">
                {dayTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/10 bg-black/[0.02] p-6 text-center text-xs text-black/30 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/30">
                    <CheckCircle2 className="mb-2 h-6 w-6 opacity-20" />
                    <p>No tasks for today.</p>
                    <p className="mt-1">Drag from Inbox to focus.</p>
                  </div>
                ) : (
                  dayTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`group flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-white p-3 shadow-sm transition-all hover:border-black/10 hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10 ${task.status === "done" ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ring-2 ring-transparent transition-all group-hover:ring-black/5 dark:group-hover:ring-white/10 ${getTaskColor(task.tag)}`}
                      />
                      <span
                        className={`flex-1 text-sm font-medium ${task.status === "done" ? "text-black/40 line-through dark:text-white/40" : "text-black/80 dark:text-white/80"}`}
                      >
                        {task.title}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* B. Timeline (Events) */}
            <div className="relative">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                <Clock className="h-3 w-3" />
                Schedule
              </h3>

              <div className="relative rounded-2xl border border-black/5 bg-white/20 p-4 dark:border-white/5 dark:bg-white/5">
                {/* Time Grid */}
                <div className="absolute top-4 bottom-4 left-16 w-px bg-black/5 dark:bg-white/5" />

                <div className="relative min-h-[800px]">
                  {" "}
                  {/* 17 hours * 60px approx */}
                  {timeSlots.map((hour, _i) => (
                    <div key={hour} className="flex items-start" style={{ height: "60px" }}>
                      <div className="w-12 text-right text-xs font-medium text-black/30 dark:text-white/30">
                        {hour}:00
                      </div>
                      <div className="mt-2 ml-4 flex-1 border-t border-dashed border-black/5 dark:border-white/5" />
                    </div>
                  ))}
                  {/* Current Time Indicator */}
                  {currentTimePos !== null && (
                    <div
                      className="pointer-events-none absolute right-0 left-16 z-10 flex items-center"
                      style={{ top: `${currentTimePos}px` }}
                    >
                      <div className="h-2 w-2 -translate-x-1 rounded-full bg-red-500 shadow-sm" />
                      <div className="h-px flex-1 bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.4)]" />
                    </div>
                  )}
                  {/* Events Layer */}
                  {dayEvents.map(event => {
                    const startHour = event.start.getHours();
                    const startMin = event.start.getMinutes();
                    const durationMin = (event.end.getTime() - event.start.getTime()) / 60000;

                    const top = (startHour - (preferences?.workingHours?.start ?? 6)) * 60 + startMin;
                    const height = durationMin;

                    return (
                      <CalendarEventCard
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEventId(event.id)}
                        topOffset={top}
                        height={height}
                        left="4rem"
                        width="calc(100% - 5rem)"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Inbox Dock (Desktop: Persistent, Mobile: Hidden/Overlay) */}

      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-col border-l border-black/5 bg-white/30 backdrop-blur-xl transition-all md:flex dark:border-white/5 dark:bg-white/5">
        <InboxContent
          tasks={inboxTasks}
          toggleTaskStatus={toggleTaskStatus}
          addTask={addTask}
          inputRef={addTaskInputRef}
        />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {showMobileInbox && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileInbox(false)}
              className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden dark:bg-black/50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl md:hidden dark:bg-[#1a1a1a]"
            >
              <div className="flex h-full flex-col">
                <div className="flex h-[72px] items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
                  <span className="font-semibold text-black dark:text-white">Inbox</span>
                  <button onClick={() => setShowMobileInbox(false)}>
                    <X className="h-5 w-5 text-black/50 dark:text-white/50" />
                  </button>
                </div>
                <InboxContent
                  tasks={inboxTasks}
                  toggleTaskStatus={toggleTaskStatus}
                  addTask={addTask}
                  inputRef={null} // No auto-focus on mobile open
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Agent Chat & Settings */}

      {/* Event Details Modal */}
      <EventDetails
        event={selectedEvent}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
};

// Helper Component for Inbox Content to reuse between Desktop and Mobile
const InboxContent: React.FC<{
  tasks: Task[];
  toggleTaskStatus: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "status" | "createdAt">) => void;
  inputRef: React.RefObject<HTMLInputElement | null> | null;
}> = ({ tasks, toggleTaskStatus, addTask, inputRef }) => (
  <>
    <div className="hidden h-[72px] items-center justify-between border-b border-black/5 px-6 py-4 md:flex dark:border-white/5">
      <div className="flex items-center gap-2">
        <Inbox className="h-4 w-4 text-black/60 dark:text-white/60" />
        <span className="text-sm font-semibold text-black/80 dark:text-white/80">Inbox</span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/50 dark:bg-white/10 dark:text-white/50">
          {tasks.length}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-black/5 text-[10px] font-medium text-black/40 dark:bg-white/10 dark:text-white/40">
          ⌘
        </span>
        <span className="flex h-5 w-5 items-center justify-center rounded bg-black/5 text-[10px] font-medium text-black/40 dark:bg-white/10 dark:text-white/40">
          I
        </span>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-3">
      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            role="button"
            tabIndex={0}
            className="group flex cursor-pointer items-center gap-2 rounded-lg border border-transparent bg-white/40 p-2 text-xs transition-all hover:border-black/5 hover:bg-white/60 hover:shadow-sm dark:bg-white/5 dark:hover:bg-white/10"
            onClick={() => toggleTaskStatus(task.id)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleTaskStatus(task.id);
              }
            }}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${getTaskColor(task.tag)}`} />
            <span className="flex-1 truncate text-black/70 dark:text-white/70">{task.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add task..."
            className="w-full rounded-lg bg-black/5 py-2 pr-3 pl-8 text-xs outline-none placeholder:text-black/30 focus:bg-black/10 focus:ring-1 focus:ring-black/10 dark:bg-white/5 dark:placeholder:text-white/30 dark:focus:bg-white/10 dark:focus:ring-white/10"
            onKeyDown={e => {
              if (e.key === "Enter") {
                addTask({ title: e.currentTarget.value, tag: "work" });
                e.currentTarget.value = "";
              }
            }}
          />
          <Plus className="absolute top-2 left-2.5 h-3.5 w-3.5 text-black/30 dark:text-white/30" />
        </div>
      </div>
    </div>
  </>
);
