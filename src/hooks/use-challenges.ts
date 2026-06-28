"use client";

import { useCallback } from "react";
import { useStorage } from "./use-storage";
import type { UserChallenge } from "@/lib/storage/types";

export function useChallenges() {
  const { data, update } = useStorage();

  const joinChallenge = useCallback(
    (challenge: UserChallenge) =>
      update((prev) => ({
        ...prev,
        userChallenges: [...prev.userChallenges, challenge],
      })),
    [update]
  );

  const updateChallenge = useCallback(
    (id: string, patch: Partial<UserChallenge>) =>
      update((prev) => ({
        ...prev,
        userChallenges: prev.userChallenges.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      })),
    [update]
  );

  return {
    challenges: data.userChallenges,
    activeChallenge: data.userChallenges.find((c) => !c.completed) ?? null,
    joinChallenge,
    updateChallenge,
  };
}
