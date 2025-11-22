import React from "react";
import { motion } from "framer-motion";
import { Inbox, GripVertical, Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  tag?: string;
}

const MOCK_TASKS: Task[] = [
  { id: "1", title: "Review PR #123", tag: "Dev" },
  { id: "2", title: "Write blog post about Kira", tag: "Writing" },
  { id: "3", title: "Call Mom", tag: "Personal" },
  { id: "4", title: "Update documentation", tag: "Dev" },
];

export const TaskInbox: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-black/5 bg-white/40 p-4 shadow-2xl backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-white/5">
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-black/80 transition-colors duration-300 dark:text-white/80">
          <Inbox className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Inbox</h2>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black transition-colors duration-300 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto">
        {MOCK_TASKS.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
            className="group flex cursor-grab items-center gap-3 rounded-xl border border-black/5 bg-white/40 p-3 transition-colors duration-300 active:cursor-grabbing dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <GripVertical className="h-4 w-4 text-black/20 opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/20" />
            <div className="flex-1">
              <div className="text-sm font-medium text-black/90 transition-colors duration-300 dark:text-white/90">
                {task.title}
              </div>
              {task.tag && (
                <div className="mt-1 inline-block rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-medium text-black/60 transition-colors duration-300 dark:bg-white/10 dark:text-white/60">
                  {task.tag}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
