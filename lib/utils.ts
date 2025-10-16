import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { emojiMap } from '../constants';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCharacterEmoji(name: string) {
  return emojiMap[name] || "🤖";
}