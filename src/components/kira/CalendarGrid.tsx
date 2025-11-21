import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface CalendarGridProps {
  events: Event[];
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({ events }) => {
  const [inboxOpen, setInboxOpen] = useState(false);
  
  // Calculate today's index (0 = Mon, 6 = Sun)
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white/40 shadow-2xl backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-white/5">
      {/* Controls Header */}
      <div className="flex items-center justify-between border-b border-black/5 bg-white/30 px-4 py-3 transition-colors duration-300 dark:border-white/10 dark:bg-white/5">
         <div className="flex items-center gap-2">
            <button className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5">
                <ChevronLeft className="h-4 w-4 text-black/60 dark:text-white/60" />
            </button>
            <span className="text-sm font-medium text-black/80 dark:text-white/80">This Week</span>
            <button className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5">
                <ChevronRight className="h-4 w-4 text-black/60 dark:text-white/60" />
            </button>
         </div>
         <div className="flex items-center gap-2">
            <button 
                onClick={() => setInboxOpen(!inboxOpen)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${inboxOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'}`}
            >
                <Inbox className="h-4 w-4" />
                <span>Inbox</span>
            </button>
         </div>
      </div>

      {/* Calendar Header (Days) */}
      <div className="grid grid-cols-8 border-b border-black/5 bg-white/30 transition-colors duration-300 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-center border-r border-black/5 p-4 text-black/50 transition-colors duration-300 dark:border-white/10 dark:text-white/50">
          <Clock className="h-5 w-5" />
        </div>
        {DAYS.map((day, index) => (
          <div 
            key={day} 
            className={`flex flex-col items-center justify-center p-4 text-center font-medium transition-colors duration-300 ${
                index === todayIndex 
                ? 'bg-purple-50/50 text-purple-600 dark:bg-purple-900/10 dark:text-purple-400' 
                : 'text-black/80 dark:text-white/80'
            }`}
          >
            {day}
            {index === todayIndex && (
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            )}
          </div>
        ))}
      </div>

      {/* Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-8">
          
          {/* Day Pool Row (Sticky or Top) */}
          <div className="col-span-8 grid grid-cols-8 border-b-2 border-dashed border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
             <div className="flex items-center justify-center border-r border-black/5 p-2 text-xs font-medium text-black/40 dark:border-white/5 dark:text-white/40">
                Day Pool
             </div>
             {DAYS.map((day, index) => (
                <div 
                    key={`pool-${day}`} 
                    className={`min-h-[60px] border-r border-black/5 p-2 transition-colors duration-300 dark:border-white/5 ${
                        index === todayIndex ? 'bg-purple-50/30 dark:bg-purple-900/5' : ''
                    }`}
                >
                    {/* Placeholder for Day Pool Items */}
                    <div className={`flex h-full items-center justify-center rounded-lg border border-dashed text-xs transition-colors ${
                        index === todayIndex 
                        ? 'border-purple-200 text-purple-400 dark:border-purple-800 dark:text-purple-300' 
                        : 'border-black/10 text-black/30 dark:border-white/10 dark:text-white/30'
                    }`}>
                        Drop here
                    </div>
                </div>
             ))}
          </div>

          {/* Time Column */}
          <div className="border-r border-black/5 bg-white/30 transition-colors duration-300 dark:border-white/10 dark:bg-white/5">
            {HOURS.map((hour) => (
              <div key={hour} className="relative h-20 border-b border-black/5 text-right transition-colors duration-300 dark:border-white/5">
                <span className="absolute -top-3 right-2 text-xs text-black/40 transition-colors duration-300 dark:text-white/40">
                  {hour}:00
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {DAYS.map((day, dayIndex) => (
            <div 
                key={day} 
                className={`relative border-r border-black/5 last:border-r-0 transition-colors duration-300 dark:border-white/5 ${
                    dayIndex === todayIndex ? 'bg-purple-50/30 dark:bg-purple-900/5' : ''
                }`}
            >
              {HOURS.map((hour) => (
                <div key={hour} className="h-20 border-b border-black/5 hover:bg-black/5 transition-colors duration-300 dark:border-white/5 dark:hover:bg-white/5" />
              ))}
              
              {/* Render Events for this day */}
              {events
                .filter((event) => {
                    const eventDay = event.start.getDay(); // 0 is Sun, 1 is Mon...
                    // Adjust for Mon start index 0
                    const adjustedDayIndex = (eventDay + 6) % 7;
                    return adjustedDayIndex === dayIndex;
                })
                .map((event) => {
                  const startHour = event.start.getHours();
                  const startMin = event.start.getMinutes();
                  const durationMin = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
                  
                  // Calculate position relative to 8 AM
                  const topOffset = (startHour - 8) * 80 + (startMin / 60) * 80;
                  const height = (durationMin / 60) * 80;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      className={`absolute left-1 right-1 rounded-lg border border-black/10 p-2 text-xs shadow-lg backdrop-blur-md transition-colors duration-300 dark:border-white/10 ${event.color || 'bg-blue-500/30'}`}
                      style={{ top: `${topOffset}px`, height: `${height}px` }}
                    >
                      <div className="font-semibold text-black dark:text-white">{event.title}</div>
                      <div className="text-black/60 dark:text-white/60">
                        {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Inbox Dropdown (Popover) */}
      <AnimatePresence>
        {inboxOpen && (
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-4 top-16 z-30 w-80 overflow-hidden rounded-2xl border border-black/5 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80"
            >
                <div className="flex items-center justify-between border-b border-black/5 p-4 dark:border-white/5">
                    <h3 className="font-semibold text-black dark:text-white">Inbox</h3>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">3 items</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto p-2">
                    <div className="space-y-1">
                        {[
                            { id: 1, title: "Review quarterly goals", tag: "Work" },
                            { id: 2, title: "Buy groceries for dinner", tag: "Personal" },
                            { id: 3, title: "Call Mom", tag: "Personal" }
                        ].map((task) => (
                            <div key={task.id} className="group flex cursor-grab items-center gap-3 rounded-xl p-3 transition-colors hover:bg-black/5 active:cursor-grabbing dark:hover:bg-white/5">
                                <div className="h-4 w-4 rounded-full border-2 border-black/20 transition-colors group-hover:border-purple-500 dark:border-white/20" />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-black dark:text-white">{task.title}</div>
                                    <div className="text-xs text-black/40 dark:text-white/40">{task.tag}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Quick Add Placeholder */}
                    <div className="mt-2 px-2 pb-2">
                        <input 
                            type="text" 
                            placeholder="+ Add a task..." 
                            className="w-full rounded-lg bg-transparent px-2 py-1.5 text-sm text-black placeholder-black/40 outline-none transition-colors hover:bg-black/5 focus:bg-black/5 dark:text-white dark:placeholder-white/40 dark:hover:bg-white/5 dark:focus:bg-white/5"
                        />
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
