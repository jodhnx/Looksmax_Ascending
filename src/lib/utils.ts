import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

import { getGreetingDE, getDailyQuoteDE } from "@/lib/i18n/de";

export function getGreeting(): string {
  return getGreetingDE();
}

export function getDailyQuote(): string {
  return getDailyQuoteDE();
}

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
