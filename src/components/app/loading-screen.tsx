"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Analyse läuft…" }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-indigo-950/25" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/25"
        >
          <Sparkles className="h-9 w-9 text-white" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight text-white">ASCEND AI</h2>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mt-2 text-sm text-white/55"
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
