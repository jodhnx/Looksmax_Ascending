"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { de } from "@/lib/i18n/de";

const STEPS = [
  de.scan.stepMesh,
  de.scan.stepMetrics,
  de.scan.stepScore,
  de.scan.stepPlan,
];

interface ScanOverlayProps {
  active: boolean;
  photoUrl?: string;
}

export function ScanOverlay({ active, photoUrl }: ScanOverlayProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    const id = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 900);
    return () => clearInterval(id);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#050508]/95 backdrop-blur-xl"
        >
          <div className="relative mx-6 w-full max-w-xs">
            {photoUrl && (
              <div className="relative mx-auto mb-8 aspect-[3/4] w-48 overflow-hidden rounded-3xl border border-violet-500/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
                <motion.div
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_20px_rgba(139,92,246,0.8)]"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-violet-500/5" />
              </div>
            )}

            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30"
              >
                <div className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              </motion.div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                {de.scan.title}
              </h2>
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-white/55"
              >
                {STEPS[step]}
              </motion.p>
            </div>

            <div className="mt-6 flex justify-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= step ? "w-6 bg-violet-500" : "w-1.5 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
