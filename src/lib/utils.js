
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and applies tailwind merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
