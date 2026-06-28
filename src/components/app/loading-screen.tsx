"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Ascending..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-indigo-950/40" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/30"
        >
          <Sparkles className="h-10 w-10 text-white" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">ASCEND AI</h2>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-2 text-white/60"
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
