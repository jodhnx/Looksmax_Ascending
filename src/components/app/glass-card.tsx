"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** @deprecated Use CSS glass-card class for performance */
  delay?: number;
  compact?: boolean;
}

export function GlassCard({ children, className, compact }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        compact ? "p-4" : "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
