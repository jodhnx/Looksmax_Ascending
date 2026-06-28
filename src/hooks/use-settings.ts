"use client";

import { useCallback } from "react";
import { useStorage } from "./use-storage";
import type { AppData, NotificationPrefs, Theme } from "@/lib/storage/types";
import { DEFAULT_NOTIFICATION_PREFS } from "@/lib/storage/types";

export function useSettings() {
  const { data, update, clear } = useStorage();

  const setTheme = useCallback(
    (theme: Theme) => update((prev) => ({ ...prev, theme })),
    [update]
  );

  const setPremium = useCallback(
    (isPremium: boolean) => update((prev) => ({ ...prev, isPremium })),
    [update]
  );

  const updateNotificationPrefs = useCallback(
    (prefs: Partial<NotificationPrefs>) =>
      update((prev) => ({
        ...prev,
        notificationPrefs: { ...prev.notificationPrefs, ...prefs },
      })),
    [update]
  );

  const updateDailyTasks = useCallback(
    (date: string, record: AppData["dailyTasks"][string]) =>
      update((prev) => ({
        ...prev,
        dailyTasks: { ...prev.dailyTasks, [date]: record },
      })),
    [update]
  );

  const setMessages = useCallback(
    (messages: AppData["messages"]) =>
      update((prev) => ({ ...prev, messages })),
    [update]
  );

  return {
    theme: data.theme,
    isPremium: data.isPremium,
    notificationPrefs: data.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS,
    dailyTasks: data.dailyTasks,
    messages: data.messages,
    lastBackupAt: data.lastBackupAt,
    setTheme,
    setPremium,
    updateNotificationPrefs,
    updateDailyTasks,
    setMessages,
    clearAllData: clear,
  };
}
