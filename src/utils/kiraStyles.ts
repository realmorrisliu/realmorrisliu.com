export const getEventColor = (type: string) => {
  switch (type) {
    case "work":
      return "bg-indigo-500/30 text-indigo-900 dark:bg-indigo-400/20 dark:text-indigo-100 border-indigo-500/20";
    case "personal":
      return "bg-emerald-500/30 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-100 border-emerald-500/20";
    case "urgent":
      return "bg-orange-500/30 text-orange-900 dark:bg-orange-400/20 dark:text-orange-100 border-orange-500/20";
    case "wellness":
      return "bg-rose-500/30 text-rose-900 dark:bg-rose-400/20 dark:text-rose-100 border-rose-500/20";
    case "study":
      return "bg-teal-500/30 text-teal-900 dark:bg-teal-400/20 dark:text-teal-100 border-teal-500/20";
    case "social":
      return "bg-pink-500/30 text-pink-900 dark:bg-pink-400/20 dark:text-pink-100 border-pink-500/20";
    default:
      return "bg-blue-500/30 text-blue-900 dark:bg-blue-400/20 dark:text-blue-100 border-blue-500/20";
  }
};

export const getTaskColor = (tag: string) => {
  switch (tag) {
    case "work":
      return "bg-indigo-500";
    case "personal":
      return "bg-emerald-500";
    case "urgent":
      return "bg-orange-500";
    case "wellness":
      return "bg-rose-500";
    case "study":
      return "bg-teal-500";
    case "social":
      return "bg-pink-500";
    default:
      return "bg-blue-500";
  }
};
