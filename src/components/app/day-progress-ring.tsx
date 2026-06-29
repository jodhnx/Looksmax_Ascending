"use client";

import { useId } from "react";
import { motion } from "framer-motion";

interface DayProgressRingProps {
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function DayProgressRing({
  percent,
  size = 52,
  stroke = 4,
  label,
  sublabel,
}: DayProgressRingProps) {
  const gradId = useId();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative flex shrink-0 flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-white">{Math.round(percent)}%</span>
        {label && (
          <span className="mt-0.5 max-w-[44px] truncate text-[8px] text-white/45">{label}</span>
        )}
      </div>
      {sublabel && (
        <span className="mt-1 text-[9px] text-white/40">{sublabel}</span>
      )}
    </div>
  );
}
