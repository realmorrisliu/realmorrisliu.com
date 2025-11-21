import React, { useState } from 'react';
import { Command, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandBarProps {
  expanded?: boolean;
}

export const CommandBar: React.FC<CommandBarProps> = ({ expanded = false }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  if (expanded) {
    return (
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        {/* Chat History */}
        <div className="relative z-10 flex-1 space-y-6 overflow-y-auto px-6 pb-6 pt-6 scrollbar-hide">
          {/* AI Message - No bubble, immersive */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
             <div className="max-w-[90%] space-y-3">
                 <div className="text-[15px] leading-relaxed text-black/70 dark:text-white/70">
                    <p>Good morning, Morris. <span className="text-purple-600/70 dark:text-purple-400/70">Ready to flow?</span></p>
                    <p className="mt-2 text-black/50 dark:text-white/50">You have 3 hours of deep work ahead. The "Day Pool" has 2 items waiting.</p>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    <button className="group flex items-center gap-1.5 rounded-lg bg-purple-500/5 px-3 py-1.5 text-xs font-medium text-purple-700/70 transition-all hover:bg-purple-500/10 dark:bg-purple-400/5 dark:text-purple-300/70 dark:hover:bg-purple-400/10">
                        <span>Review Tasks</span>
                        <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                    <button className="group flex items-center gap-1.5 rounded-lg bg-black/5 px-3 py-1.5 text-xs font-medium text-black/60 transition-all hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10">
                        <span>Start Focus Mode</span>
                        <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                 </div>
             </div>
          </motion.div>

          {/* User Message (Mock) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-end"
          >
             <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-blue-500/30 px-5 py-3 text-[15px] leading-relaxed text-black/90 backdrop-blur-md dark:bg-blue-400/20 dark:text-white/90">
                <p>Show me my schedule for tomorrow.</p>
             </div>
          </motion.div>

           {/* AI Message (Response) - No bubble, immersive */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-start"
          >
             <div className="max-w-[90%] text-[15px] leading-relaxed text-black/70 dark:text-white/70">
                <p>Tomorrow is clear until 2 PM. You have a <span className="font-medium text-black/90 dark:text-white/90">Product Review</span> at 2:30 PM.</p>
             </div>
          </motion.div>
        </div>

        {/* Input Area */}
        <div className="relative z-10 p-6">
          <div className="relative flex items-center overflow-hidden rounded-2xl border border-black/5 bg-white/40 p-1 backdrop-blur-xl transition-all duration-300 focus-within:border-purple-500/20 focus-within:bg-white/60 dark:border-white/5 dark:bg-black/20 dark:focus-within:border-purple-400/20 dark:focus-within:bg-black/30">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kira..."
              className="flex-1 bg-transparent px-4 py-3 text-[15px] text-black/80 placeholder-black/30 outline-none transition-colors duration-300 dark:text-white/80 dark:placeholder-white/30"
            />

            <AnimatePresence>
              {input ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mr-1 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/30 text-black/80 backdrop-blur-md transition-transform hover:scale-105 active:scale-95 dark:bg-blue-400/20 dark:text-white/80"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                 <div className="mr-3 flex items-center justify-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/5 text-black/20 dark:bg-white/5 dark:text-white/20">
                        <Command className="h-3 w-3" />
                    </div>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-1/2 w-full max-w-2xl -translate-x-1/2 px-4">
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused
            ? '0 20px 40px -10px rgba(0,0,0,0.1)'
            : '0 10px 20px -5px rgba(0,0,0,0.05)',
        }}
        className="relative flex items-center overflow-hidden rounded-2xl border border-black/10 bg-white/80 p-2 backdrop-blur-2xl transition-colors duration-300 dark:border-white/20 dark:bg-black/60 dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black/70 transition-colors duration-300 dark:bg-white/10 dark:text-white/70">
          <Command className="h-5 w-5" />
        </div>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Kira to schedule something..."
          className="flex-1 bg-transparent px-4 py-3 text-lg text-black placeholder-black/40 outline-none transition-colors duration-300 dark:text-white dark:placeholder-white/40"
        />

        <AnimatePresence>
          {input && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <span>Do it</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {!input && (
             <div className="mr-2 flex items-center gap-1 rounded-lg border border-black/10 bg-black/5 px-2 py-1 text-xs text-black/40 transition-colors duration-300 dark:border-white/10 dark:bg-white/5 dark:text-white/40">
                <Sparkles className="h-3 w-3" />
                <span>AI</span>
             </div>
        )}
      </motion.div>
    </div>
  );
};
