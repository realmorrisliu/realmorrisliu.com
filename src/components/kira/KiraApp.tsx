import React, { useState, useEffect } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { CommandBar } from './CommandBar';
import { TaskInbox } from './TaskInbox';
import { ThemeToggle } from './ThemeToggle';
import { UserButton, ClerkProvider } from '@clerk/clerk-react';

// Mock Data
const EVENTS = [
  {
    id: '1',
    title: 'Deep Work',
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    color: 'bg-purple-500/30 border-purple-500/50',
  },
  {
    id: '2',
    title: 'Team Sync',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    color: 'bg-blue-500/30 border-blue-500/50',
  },
];

const PUBLISHABLE_KEY = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

export const KiraApp: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!PUBLISHABLE_KEY) {
      return <div>Missing Clerk Publishable Key</div>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div className={`${theme} h-full w-full`}>
        <div className="relative flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-black dark:text-white">
          {/* Background Ambient Effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[120px] transition-colors duration-300 dark:bg-purple-900/20" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[120px] transition-colors duration-300 dark:bg-blue-900/20" />
          </div>

          {/* Left Panel: Calendar (65%) */}
          <div className="relative z-10 flex h-full w-[65%] flex-col border-r border-black/5 bg-white/30 backdrop-blur-xl transition-colors duration-300 dark:border-white/5 dark:bg-white/5">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Kira</h1>
                <div className="h-6 w-px bg-black/10 dark:bg-white/10" />
                <span className="text-sm font-medium text-black/60 dark:text-white/60">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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
            <div className="flex-1 overflow-hidden px-6 pb-6">
               <CalendarGrid events={EVENTS} />
            </div>
          </div>

          {/* Right Panel: AI Co-pilot (35%) */}
          <div className="relative z-10 h-full w-[35%] bg-white/40 backdrop-blur-2xl transition-colors duration-300 dark:bg-black/40">
            <CommandBar expanded={true} />
          </div>

          {/* Hidden Inbox Drawer (Overlay) */}
          {/* <TaskInbox /> - To be implemented as a drawer */}
        </div>
      </div>
    </ClerkProvider>
  );
};
