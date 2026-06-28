"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle, XCircle } from "lucide-react";
import { GlassCard } from "@/components/app/glass-card";

interface AdminInfo {
  config: {
    freeAnalysisLimit: number;
    freePlanDays: number;
    premiumEnabled: boolean;
    premiumPrice: string;
  };
  openaiConfigured: boolean;
  environment: string;
}

export default function AdminDashboardPage() {
  const [info, setInfo] = useState<AdminInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin/config").then((r) => r.json()).then(setInfo);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      <p className="mt-2 text-white/60">ASCEND AI system overview</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GlassCard className="!p-6">
          <div className="flex items-center gap-3">
            {info?.openaiConfigured ? (
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            ) : (
              <XCircle className="h-8 w-8 text-red-400" />
            )}
            <div>
              <p className="font-semibold text-white">OpenAI API</p>
              <p className="text-sm text-white/60">
                {info?.openaiConfigured ? "Configured" : "Missing OPENAI_API_KEY"}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-6">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-violet-400" />
            <div>
              <p className="font-semibold text-white">Environment</p>
              <p className="text-sm text-white/60">{info?.environment ?? "—"}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-6 md:col-span-2">
          <h3 className="mb-4 font-semibold text-white">App Architecture</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• User data stored in browser LocalStorage (no database)</li>
            <li>• AI analysis via OpenAI Vision API (server-side)</li>
            <li>• No user registration or authentication required</li>
            <li>• Admin access protected by environment credentials</li>
          </ul>
        </GlassCard>

        {info && (
          <GlassCard className="!p-6 md:col-span-2">
            <h3 className="mb-4 font-semibold text-white">Current Config</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60">Free analysis limit</p>
                <p className="font-semibold text-white">{info.config.freeAnalysisLimit}</p>
              </div>
              <div>
                <p className="text-white/60">Free plan days</p>
                <p className="font-semibold text-white">{info.config.freePlanDays}</p>
              </div>
              <div>
                <p className="text-white/60">Premium enabled</p>
                <p className="font-semibold text-white">{info.config.premiumEnabled ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-white/60">Premium price</p>
                <p className="font-semibold text-white">{info.config.premiumPrice}</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
