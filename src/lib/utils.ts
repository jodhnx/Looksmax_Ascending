import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const MOTIVATIONAL_QUOTES = [
  "Every rep, every routine — you're ascending.",
  "Consistency beats perfection. Show up today.",
  "Your future self is watching you right now.",
  "Small daily improvements lead to stunning results.",
  "Discipline is choosing what you want most over what you want now.",
  "Glow up is a mindset before it's a mirror reflection.",
  "You're not competing with anyone but yesterday's you.",
  "Invest in yourself — it pays the best interest.",
];

export function getDailyQuote(): string {
  const day = new Date().getDate();
  return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
}

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
