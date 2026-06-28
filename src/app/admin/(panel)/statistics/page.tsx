"use client";

import { GlassCard } from "@/components/app/glass-card";
import { Database, Smartphone, Shield } from "lucide-react";

export default function AdminStatisticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">User Statistics</h1>
      <p className="mt-2 text-white/60">How user data is stored and managed</p>

      <div className="mt-8 space-y-4">
        <GlassCard className="!p-6">
          <div className="flex gap-4">
            <Smartphone className="h-10 w-10 shrink-0 text-violet-400" />
            <div>
              <h3 className="font-semibold text-white">Local-First Architecture</h3>
              <p className="mt-2 text-sm text-white/60">
                All user progress is stored in browser LocalStorage under the key{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-violet-300">ascend-ai-data</code>.
                This includes photos, analyses, daily tasks, challenges, settings, and chat history.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-6">
          <div className="flex gap-4">
            <Database className="h-10 w-10 shrink-0 text-amber-400" />
            <div>
              <h3 className="font-semibold text-white">No Server Database</h3>
              <p className="mt-2 text-sm text-white/60">
                The app does not use Prisma, PostgreSQL, or any server-side user database.
                Admin cannot view individual user data — users can export their own backup from Settings.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-6">
          <div className="flex gap-4">
            <Shield className="h-10 w-10 shrink-0 text-emerald-400" />
            <div>
              <h3 className="font-semibold text-white">Data Stored Per Device</h3>
              <ul className="mt-2 space-y-1 text-sm text-white/60">
                <li>• Profile & onboarding data</li>
                <li>• Uploaded photos (base64)</li>
                <li>• AI analysis reports</li>
                <li>• 30-day ascension plans</li>
                <li>• Daily checklist & streaks</li>
                <li>• Progress comparisons</li>
                <li>• Challenge progress</li>
                <li>• Statistics & notification preferences</li>
                <li>• AI Coach chat history</li>
                <li>• Premium status (local)</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
