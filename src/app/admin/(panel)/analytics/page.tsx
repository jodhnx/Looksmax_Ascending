"use client";

import { GlassCard } from "@/components/app/glass-card";
import { BarChart3, Cpu, Image as ImageIcon, MessageSquare } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      <p className="mt-2 text-white/60">API and feature usage overview</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GlassCard className="!p-6">
          <BarChart3 className="mb-3 h-8 w-8 text-violet-400" />
          <h3 className="font-semibold text-white">Client-Side Analytics</h3>
          <p className="mt-2 text-sm text-white/60">
            User analytics are stored locally on each device. No server-side user tracking is performed for privacy.
          </p>
        </GlassCard>

        <GlassCard className="!p-6">
          <Cpu className="mb-3 h-8 w-8 text-emerald-400" />
          <h3 className="font-semibold text-white">Server API Endpoints</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/60">
            <li>• POST /api/analysis — Vision AI analysis</li>
            <li>• POST /api/chat — AI Coach</li>
            <li>• POST /api/progress — Weekly comparison</li>
            <li>• POST /api/image/validate — Photo validation</li>
          </ul>
        </GlassCard>

        <GlassCard className="!p-6">
          <ImageIcon className="mb-3 h-8 w-8 text-amber-400" />
          <h3 className="font-semibold text-white">Photo Processing</h3>
          <p className="mt-2 text-sm text-white/60">
            Photos are validated server-side with Sharp, then stored as base64 in the user&apos;s LocalStorage. Images are not persisted on the server.
          </p>
        </GlassCard>

        <GlassCard className="!p-6">
          <MessageSquare className="mb-3 h-8 w-8 text-indigo-400" />
          <h3 className="font-semibold text-white">AI Coach</h3>
          <p className="mt-2 text-sm text-white/60">
            Chat history is stored locally. Only premium users can access the AI Coach feature.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
