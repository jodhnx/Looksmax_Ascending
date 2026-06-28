"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/app/loading-screen";
import { toast } from "sonner";

interface NotificationPrefs {
  morningReminder: boolean;
  workoutReminder: boolean;
  skincareReminder: boolean;
  waterReminder: boolean;
  sleepReminder: boolean;
  weeklyPhoto: boolean;
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setPrefs(data);
        setLoading(false);
      });
  }, []);

  const updatePref = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!prefs) return;
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    toast.success("Preferences saved");
  };

  if (loading) return <LoadingScreen />;

  const reminders = [
    { key: "morningReminder" as const, label: "Morning reminder" },
    { key: "workoutReminder" as const, label: "Workout reminder" },
    { key: "skincareReminder" as const, label: "Skincare reminder" },
    { key: "waterReminder" as const, label: "Water reminder" },
    { key: "sleepReminder" as const, label: "Sleep reminder" },
    { key: "weeklyPhoto" as const, label: "Weekly photo reminder" },
  ];

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        <GlassCard className="mt-6">
          <h3 className="mb-4 font-semibold text-white">Notifications</h3>
          <div className="space-y-4">
            {reminders.map((r) => (
              <div key={r.key} className="flex items-center justify-between">
                <Label htmlFor={r.key} className="text-white/80">{r.label}</Label>
                <Switch
                  id={r.key}
                  checked={prefs?.[r.key] ?? false}
                  onCheckedChange={(v) => updatePref(r.key, v)}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        <Button
          variant="destructive"
          className="mt-8 w-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
      <BottomNav />
    </>
  );
}
