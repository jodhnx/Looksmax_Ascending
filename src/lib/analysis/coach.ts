import type { AnalysisResult } from "./types";

export function coachReply(
  message: string,
  context: {
    latestAnalysis?: AnalysisResult;
    streak?: number;
    completedTasksTotal?: number;
    goals?: string[];
  }
): string {
  const lower = message.toLowerCase();
  const score = context.latestAnalysis?.ascendScore;
  const weaknesses = context.latestAnalysis?.weaknesses ?? [];
  const top = context.latestAnalysis?.topImprovements ?? [];

  if (/jaw|jawline|chin/.test(lower)) {
    return `Based on your scan${score ? ` (ASCEND ${score})` : ""}, focus on jaw definition: ${top[0] ?? "chin tucks 3× daily, reduce sodium, train neck muscles 5 min"}. Consistency over 4+ weeks shows in progress photos.`;
  }
  if (/skin|acne|spf|skincare/.test(lower)) {
    return `For skin: cleanse AM/PM, SPF every morning, change pillowcases weekly. Your scan flagged "${weaknesses.find((w) => w.toLowerCase().includes("skin")) ?? "skin clarity"}" — hydration and sleep are equally important.`;
  }
  if (/posture|neck|forward head/.test(lower)) {
    return `Posture protocol: chin tucks, wall angels, upper-back rows. Set hourly reminders. Your profile scan measures neck angle — 2 weeks of daily work typically shifts this metric.`;
  }
  if (/sleep|tired|dark circle/.test(lower)) {
    return `Target 7-8 hours, screens off 30 min before bed, cool dark room. Dark circles often improve with sleep consistency before any product changes.`;
  }
  if (/water|hydrat/.test(lower)) {
    return `Aim for 2.5-3L daily. Front-load water in the morning. Dehydration affects skin texture scores in your next scan.`;
  }
  if (/gym|workout|exercise/.test(lower)) {
    return `Train 4-5x/week: compounds + neck/posture work. Check the Exercise Library for posture and neck mobility routines. Your streak is ${context.streak ?? 0} days — protect it.`;
  }
  if (/score|ascend|rating/.test(lower)) {
    return score
      ? `Your ASCEND SCORE is ${score} (estimate ${context.latestAnalysis?.confidenceLow}–${context.latestAnalysis?.confidenceHigh}). It's a self-improvement tracker, not an objective rating. Focus on weekly progress photos.`
      : "Complete your first scan to get your ASCEND SCORE baseline.";
  }
  if (/plan|routine|day/.test(lower)) {
    return `Follow today's plan in the Plan tab. Your top improvements: ${top.slice(0, 2).join("; ") || "hydration, posture, skincare"}. Small daily wins compound.`;
  }

  return `I'm your ASCEND coach${score ? ` — your score is ${score}` : ""}. Ask about jaw, skin, posture, sleep, workouts, or your 30-day plan. Top focus: ${top[0] ?? weaknesses[0] ?? "daily consistency"}.`;
}
