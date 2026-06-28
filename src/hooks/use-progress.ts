"use client";

import { useCallback } from "react";
import { useStorage } from "./use-storage";
import type { ProgressCheck, StoredAnalysis } from "@/lib/storage/types";

export function useProgress() {
  const { data, update } = useStorage();

  const addAnalysis = useCallback(
    (analysis: StoredAnalysis) =>
      update((prev) => ({
        ...prev,
        analyses: [...prev.analyses, analysis],
        analysisCount: prev.analysisCount + 1,
      })),
    [update]
  );

  const addWeeklyReport = useCallback(
    (report: ProgressCheck) =>
      update((prev) => ({
        ...prev,
        progressChecks: [report, ...prev.progressChecks],
        weeklyReports: [report, ...prev.weeklyReports],
      })),
    [update]
  );

  return {
    analyses: data.analyses,
    progressChecks: data.progressChecks,
    weeklyReports: data.weeklyReports,
    latestAnalysis: data.analyses[data.analyses.length - 1] ?? null,
    analysisCount: data.analysisCount,
    addAnalysis,
    addWeeklyReport,
  };
}
