import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 导出 tag 格式化相关函数
export {
  formatTag,
  formatTags,
  normalizeTag,
  isValidTag,
  getTagCategory,
  getRelatedTags,
  type TagCategory,
  type FormattedTag,
} from "./tagUtils";
