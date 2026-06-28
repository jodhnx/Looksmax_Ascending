"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface RuntimeConfig {
  freeAnalysisLimit: number;
  freePlanDays: number;
  premiumEnabled: boolean;
  premiumPrice: string;
}

export default function AdminPremiumPage() {
  const [config, setConfig] = useState<RuntimeConfig>({
    freeAnalysisLimit: 1,
    freePlanDays: 7,
    premiumEnabled: true,
    premiumPrice: "$14.99/mo",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((d) => d.config && setConfig(d.config));
  }, []);

  const save = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setLoading(false);
    if (res.ok) toast.success("Premium config updated");
    else toast.error("Failed to save");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Premium Management</h1>
      <p className="mt-2 text-white/60">Configure free tier limits and premium settings</p>

      <GlassCard className="mt-8 !p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Premium enabled</Label>
              <p className="text-sm text-white/60">Allow users to activate premium features</p>
            </div>
            <Switch
              checked={config.premiumEnabled}
              onCheckedChange={(v) => setConfig((c) => ({ ...c, premiumEnabled: v }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeLimit">Free analysis limit</Label>
            <Input
              id="freeLimit"
              type="number"
              min={0}
              value={config.freeAnalysisLimit}
              onChange={(e) =>
                setConfig((c) => ({ ...c, freeAnalysisLimit: Number(e.target.value) }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeDays">Free plan days</Label>
            <Input
              id="freeDays"
              type="number"
              min={1}
              value={config.freePlanDays}
              onChange={(e) =>
                setConfig((c) => ({ ...c, freePlanDays: Number(e.target.value) }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Display price</Label>
            <Input
              id="price"
              value={config.premiumPrice}
              onChange={(e) =>
                setConfig((c) => ({ ...c, premiumPrice: e.target.value }))
              }
            />
          </div>

          <Button onClick={save} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Configuration"}
          </Button>

          <p className="text-xs text-white/40">
            Config is stored in server memory. For production persistence, set the{" "}
            <code className="text-violet-300">APP_CONFIG</code> environment variable as JSON.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
