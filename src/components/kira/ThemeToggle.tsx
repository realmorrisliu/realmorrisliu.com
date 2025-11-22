import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/50 text-black backdrop-blur-md transition-colors hover:bg-white/80 dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/80"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </motion.button>
  );
};
