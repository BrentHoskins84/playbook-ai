import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanUpPath = (path: string) => {
  // Remove leading slash and replace hyphens with spaces
  return path
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
};
