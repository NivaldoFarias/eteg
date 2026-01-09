import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

/**
 * Merges Tailwind CSS classes with clsx conditional logic and resolves conflicts
 *
 * @param inputs - Array of class values that can be strings, objects, arrays, or conditional expressions
 * @returns Merged and conflict-resolved CSS class string
 */
export function cn(...inputs: Array<ClassValue>): string {
	return twMerge(clsx(inputs));
}
