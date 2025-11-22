import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Clock, Tag } from "lucide-react";
import type { CalendarEvent, EventType } from "@/types/kira";

interface EventDetailsProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedEvent: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const EVENT_TYPES: { type: EventType; color: string; label: string }[] = [
  { type: "work", color: "bg-indigo-500", label: "Work" },
  { type: "personal", color: "bg-emerald-500", label: "Personal" },
  { type: "urgent", color: "bg-orange-500", label: "Urgent" },
  { type: "wellness", color: "bg-rose-500", label: "Wellness" },
  { type: "study", color: "bg-teal-500", label: "Study" },
  { type: "social", color: "bg-pink-500", label: "Social" },
  { type: "other", color: "bg-blue-500", label: "Other" },
];

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  // Use event data directly for initialization, reset when event changes via key prop
  const [title, setTitle] = useState(event?.title || "");
  const [type, setType] = useState<EventType>(event?.type || "work");

  // Auto-save on change (debounced for better performance)
  useEffect(() => {
    if (event && (title !== event.title || type !== event.type)) {
      const timer = setTimeout(() => {
        onUpdate({ ...event, title, type });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [title, type, event, onUpdate]);

  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:bg-black/80"
          >
            {/* Header Actions */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-2">
                {EVENT_TYPES.map(t => (
                  <button
                    key={t.type}
                    onClick={() => setType(t.type)}
                    className={`h-4 w-4 rounded-full transition-transform hover:scale-110 ${t.color} ${type === t.type ? "scale-110 ring-2 ring-black/20 dark:ring-white/20" : "opacity-50 hover:opacity-100"}`}
                    title={t.label}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onDelete(event.id);
                    onClose();
                  }}
                  className="rounded-full p-2 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mb-4 w-full bg-transparent text-2xl font-bold text-black outline-none placeholder:text-black/20 dark:text-white dark:placeholder:text-white/20"
              placeholder="Event Title"
            />

            {/* Time Display */}
            <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
              <Clock className="h-4 w-4" />
              <span>
                {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-black/40 dark:text-white/40">
              <Tag className="h-3 w-3" />
              <span className="capitalize">{type}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
