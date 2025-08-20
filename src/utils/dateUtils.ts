/**
 * Unified date formatting utilities
 * Consolidates date formatting logic used across components
 */

/**
 * Format date as "Month DD, YYYY" (e.g., "August 15, 2025")
 * Used for blog posts, status updates, and general date display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date as "Month YYYY" (e.g., "August 2025")
 * Used for archive listings and monthly entries
 */
export const formatMonthYear = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

/**
 * Format date for specific locale
 * Allows for future internationalization support
 */
export const formatDateLocale = (
  date: Date | string,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale, options);
};
