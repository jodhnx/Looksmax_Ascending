"use client";

import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppStorage } from "@/hooks/use-app-storage";
import { DEFAULT_APP_DATA, getAppData, setAppData } from "@/lib/storage";

export default function SettingsPage() {
  const { data, update } = useAppStorage();
  const prefs = data.notificationPrefs;

  const updatePref = (key: keyof typeof prefs, value: boolean) => {
    update((prev) => ({
      ...prev,
      notificationPrefs: { ...prev.notificationPrefs, [key]: value },
    }));
    toast.success("Preferences saved");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getAppData(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ascend-ai-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  const clearData = () => {
    if (!confirm("Clear all local data? This cannot be undone.")) return;
    localStorage.removeItem("ascend-ai-data");
    setAppData({ ...DEFAULT_APP_DATA });
    window.location.reload();
  };

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
        <p className="mt-1 text-sm text-white/60">All data is stored locally on your device</p>

        <GlassCard className="mt-6">
          <h3 className="mb-4 font-semibold text-white">Notifications</h3>
          <div className="space-y-4">
            {reminders.map((r) => (
              <div key={r.key} className="flex items-center justify-between">
                <Label htmlFor={r.key} className="text-white/80">{r.label}</Label>
                <Switch
                  id={r.key}
                  checked={prefs[r.key]}
                  onCheckedChange={(v) => updatePref(r.key, v)}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="mt-4">
          <h3 className="mb-4 font-semibold text-white">Data</h3>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full" onClick={exportData}>
              Export backup
            </Button>
            <Button variant="destructive" className="w-full" onClick={clearData}>
              Clear all local data
            </Button>
          </div>
        </GlassCard>
      </div>
      <BottomNav />
    </>
  );
}
