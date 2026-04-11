import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Class name utility — merges Tailwind classes with clsx + tailwind-merge.
 * Resolves class conflicts (e.g., p-4 vs p-2) so the last class wins.
 *
 * @param inputs - Any number of class values (strings, arrays, objects)
 * @returns Merged, deduplicated class string
 *
 * @example
 * cn("flex items-center", isActive && "bg-foreground text-background")
 * cn("border-2 border-foreground", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
