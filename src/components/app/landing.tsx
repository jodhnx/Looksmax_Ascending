"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050508]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-between px-6 py-12 safe-area-pb">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-medium tracking-[0.3em] text-white/40 uppercase"
        >
          100% Local · No Account
        </motion.p>

        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
              <Sparkles className="h-10 w-10 text-violet-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              ASCEND
              <span className="gradient-text"> AI</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xs text-base leading-relaxed text-white/55">
              MediaPipe face mesh analysis, ASCEND Score, and your personalized 30-day plan — entirely on your device.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-sm space-y-4"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl text-left">
              <Feature text="468-point face mesh analysis" />
              <Feature text="ASCEND Score 0–100" />
              <Feature text="30-day personalized plan" />
              <Feature text="Weekly progress tracking" />
            </div>

            <Button asChild size="lg" className="h-14 w-full rounded-2xl text-base shadow-lg shadow-violet-500/25">
              <Link href="/upload">
                Start Analysis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Link href="/dashboard" className="block text-center text-sm text-white/40 hover:text-white/60">
              Open dashboard
            </Link>
          </motion.div>
        </div>

        <p className="text-center text-[11px] text-white/30">
          ASCEND Score is an estimate for self-improvement — not an objective rating.
        </p>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5 text-sm text-white/70">
      <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
      {text}
    </div>
  );
}
