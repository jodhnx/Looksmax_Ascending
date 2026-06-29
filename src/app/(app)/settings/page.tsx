"use client";

import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-settings";
import { useStorage } from "@/hooks/use-storage";
import { de } from "@/lib/i18n/de";

export default function SettingsPage() {
  const { data } = useStorage();
  const {
    notificationPrefs: prefs,
    theme,
    lastBackupAt,
    updateNotificationPrefs,
    setTheme,
    clearAllData,
  } = useSettings();

  const updatePref = (key: keyof typeof prefs, value: boolean) => {
    updateNotificationPrefs({ [key]: value });
    toast.success(de.settings.saved);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ascend-ai-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(de.settings.exported);
  };

  const clearData = async () => {
    if (!confirm(de.settings.clearConfirm)) return;
    await clearAllData();
    window.location.reload();
  };

  const reminders = [
    { key: "morningReminder" as const, label: de.settings.reminders.morning },
    { key: "workoutReminder" as const, label: de.settings.reminders.workout },
    { key: "skincareReminder" as const, label: de.settings.reminders.skincare },
    { key: "waterReminder" as const, label: de.settings.reminders.water },
    { key: "sleepReminder" as const, label: de.settings.reminders.sleep },
    { key: "weeklyPhoto" as const, label: de.settings.reminders.weeklyPhoto },
  ];

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">{de.settings.title}</h1>
        <p className="mt-1 text-sm text-white/60">{de.settings.subtitle}</p>

        <GlassCard className="mt-6">
          <h3 className="mb-4 font-semibold text-white">{de.settings.appearance}</h3>
          <div className="flex gap-2">
            <Button
              variant={theme === "dark" ? "default" : "secondary"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              {de.settings.dark}
            </Button>
            <Button
              variant={theme === "light" ? "default" : "secondary"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              {de.settings.light}
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="mt-4">
          <h3 className="mb-4 font-semibold text-white">{de.settings.notifications}</h3>
          <div className="space-y-4">
            {reminders.map((r) => (
              <div key={r.key} className="flex items-center justify-between">
                <Label htmlFor={r.key} className="text-white/80">
                  {r.label}
                </Label>
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
          <h3 className="mb-4 font-semibold text-white">{de.settings.data}</h3>
          {lastBackupAt && (
            <p className="mb-3 text-xs text-white/50">
              {de.settings.lastBackup}: {new Date(lastBackupAt).toLocaleString("de-DE")}
            </p>
          )}
          <div className="space-y-3">
            <Button variant="secondary" className="w-full" onClick={exportData}>
              {de.settings.export}
            </Button>
            <Button variant="destructive" className="w-full" onClick={clearData}>
              {de.settings.clear}
            </Button>
          </div>
        </GlassCard>
      </div>
      <BottomNav />
    </>
  );
}
