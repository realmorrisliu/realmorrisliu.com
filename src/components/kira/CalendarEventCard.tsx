import React from "react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "@/types/kira";
import { getEventColor } from "@utils/kiraStyles";

interface CalendarEventCardProps {
  event: CalendarEvent;
  onClick: () => void;
  topOffset: number; // Calculated by parent
  height: number; // Calculated by parent
  left?: string; // Calculated by layout algorithm
  width?: string; // Calculated by layout algorithm
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  onClick,
  topOffset,
  height,
  left = "0%",
  width = "100%",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, width: "100%" }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        height,
        left,
        width,
      }}
      whileHover={{ scale: 1.02, zIndex: 20, cursor: "pointer" }}
      onClick={onClick}
      className={`group absolute flex flex-col rounded-xl border border-white/10 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-colors duration-300 ${getEventColor(event.type)}`}
      style={{ top: `${topOffset}px` }}
    >
      {/* Content */}
      <div className="flex-1 p-2 text-xs">
        <div className="font-semibold">{event.title}</div>
        <div className="opacity-70">
          {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}-
          {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </motion.div>
  );
};
