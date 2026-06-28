"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FEATURES = [
  "Unlimited AI photo analyses",
  "Full 30-day Ascension Plans",
  "Weekly progress comparisons",
  "Unlimited AI Coach chat",
  "Advanced statistics & charts",
  "Progress photo storage",
  "Custom workout plans",
  "Custom skincare routines",
];

const FREE_FEATURES = [
  "1 AI analysis",
  "7-day Ascension Plan",
  "Daily checklist",
  "Basic dashboard",
];

export default function PremiumPage() {
  const searchParams = useSearchParams();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Welcome to Premium!");
    }
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setIsPremium(d.isPremium));
  }, [searchParams]);

  const checkout = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error("Checkout unavailable. Configure Stripe keys.");
    }
  };

  return (
    <>
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ASCEND Premium</h1>
          <p className="mt-2 text-white/60">Unlock your full potential</p>
          <p className="mt-4 text-4xl font-bold gradient-text">$14.99<span className="text-lg text-white/60">/mo</span></p>
        </motion.div>

        {isPremium ? (
          <GlassCard className="mt-8 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-amber-400" />
            <h3 className="font-semibold text-white">You&apos;re Premium!</h3>
            <p className="mt-2 text-sm text-white/60">All features unlocked</p>
          </GlassCard>
        ) : (
          <>
            <GlassCard className="mt-8" delay={0.1}>
              <h3 className="mb-4 font-semibold text-amber-400">Premium includes</h3>
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="mt-4" delay={0.15}>
              <h3 className="mb-4 font-semibold text-white/60">Free tier</h3>
              <ul className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                    <Check className="h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <Button
              className="mt-8 w-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500"
              size="lg"
              onClick={checkout}
              disabled={loading}
            >
              {loading ? "Loading..." : "Upgrade to Premium"}
            </Button>
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}
