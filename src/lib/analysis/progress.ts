"use client";

import { runFullAnalysis } from "./engine";

export async function compareProgress(
  oldFrontUrl: string,
  oldProfileUrl: string,
  newFrontUrl: string,
  newProfileUrl: string,
  completedTasks: number
): Promise<{
  improvementPercent: number;
  skinImprovement: number;
  jawImprovement: number;
  postureImprovement: number;
  harmonyImprovement: number;
  notes: string;
  completedTasksImpact: string;
}> {
  const [before, after] = await Promise.all([
    runFullAnalysis(oldFrontUrl, oldProfileUrl),
    runFullAnalysis(newFrontUrl, newProfileUrl),
  ]);

  const scoreDelta = after.ascendScore - before.ascendScore;
  const skinDelta = after.scores.skin - before.scores.skin;
  const jawDelta = after.scores.jawDefinition - before.scores.jawDefinition;
  const postureDelta = after.scores.posture - before.scores.posture;
  const harmonyDelta = after.scores.facialHarmony - before.scores.facialHarmony;

  const habitBonus = Math.min(completedTasks * 0.3, 8);
  const improvementPercent = Math.max(
    0,
    Math.min(100, Math.round(scoreDelta * 2 + habitBonus + 5))
  );

  const notes =
    scoreDelta >= 0
      ? `ASCEND SCORE moved from ${before.ascendScore} to ${after.ascendScore}. Visible progress in tracked metrics.`
      : `ASCEND SCORE shifted from ${before.ascendScore} to ${after.ascendScore}. Stay consistent — results compound over 30 days.`;

  const completedTasksImpact =
    completedTasks > 20
      ? "Strong habit consistency likely supported your progress."
      : completedTasks > 10
        ? "Moderate task completion — increasing consistency will accelerate results."
        : "Low task completion — focus on daily checklist for better results.";

  return {
    improvementPercent,
    skinImprovement: Math.round(skinDelta),
    jawImprovement: Math.round(jawDelta),
    postureImprovement: Math.round(postureDelta),
    harmonyImprovement: Math.round(harmonyDelta),
    notes,
    completedTasksImpact,
  };
}
