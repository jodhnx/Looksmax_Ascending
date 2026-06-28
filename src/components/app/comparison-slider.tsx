"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
  beforeUrl: string;
  afterUrl: string;
  className?: string;
}

export function ComparisonSlider({
  beforeUrl,
  afterUrl,
  className,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-3xl",
        className
      )}
    >
      <Image
        src={afterUrl}
        alt="After"
        fill
        className="object-cover"
        unoptimized
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative h-full w-[200%] max-w-none">
          <Image
            src={beforeUrl}
            alt="Before"
            fill
            className="object-cover"
            unoptimized
            style={{ width: `${100 / (position / 100)}%` }}
          />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Compare before and after"
      />
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/50 backdrop-blur-sm">
          <span className="text-xs text-white">⟷</span>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
        Before
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
        After
      </div>
    </div>
  );
}
