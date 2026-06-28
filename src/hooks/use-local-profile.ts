"use client";

import { useCallback } from "react";
import { useStorage } from "./use-storage";
import type { Profile } from "@/lib/storage/types";

export function useLocalProfile() {
  const { data, update } = useStorage();

  const updateProfile = useCallback(
    (profile: Partial<Profile>) =>
      update((prev) => ({
        ...prev,
        profile: {
          currentStreak: prev.profile?.currentStreak ?? 0,
          longestStreak: prev.profile?.longestStreak ?? 0,
          lastActiveDate: prev.profile?.lastActiveDate ?? null,
          ...prev.profile,
          ...profile,
        },
      })),
    [update]
  );

  const setOnboardingComplete = useCallback(
    (complete: boolean) =>
      update((prev) => ({ ...prev, onboardingComplete: complete })),
    [update]
  );

  return {
    profile: data.profile,
    onboardingComplete: data.onboardingComplete,
    currentStreak: data.profile?.currentStreak ?? 0,
    longestStreak: data.profile?.longestStreak ?? 0,
    updateProfile,
    setOnboardingComplete,
  };
}
