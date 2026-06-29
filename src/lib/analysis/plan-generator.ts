import type { AnalysisResult, CategoryScores, PlanDay, PlanTask } from "./types";
import { getWeakestCategory } from "./scoring";
import { WEEKDAYS_DE, getFocusAreaDE, getDailyQuoteDE } from "@/lib/i18n/de";
import type { Profile } from "@/lib/storage/types";
import { HABIT_DATABASE, getHabitById } from "@/lib/exercises/database";
import type { GymLevel, HabitEntry, PersonalizationTag, TaskCategory } from "@/lib/exercises/types";
import { WEEK_PHASES } from "@/lib/exercises/categories";

export interface PlanGenerationContext {
  analysis: AnalysisResult;
  profile?: Profile | null;
  completedHabitIds?: string[];
}

const FACE_DISCLAIMER =
  "Optionale Techniken mit begrenzter wissenschaftlicher Evidenz für strukturelle Gesichtsveränderungen. Sie können Entspannung, Gewohnheitsbewusstsein und Wohlbefinden unterstützen — keine dauerhafte Knochenumformung.";

const CATEGORY_TO_TAG: Partial<Record<keyof CategoryScores, PersonalizationTag>> = {
  jawDefinition: "kiefer",
  posture: "haltung",
  skin: "haut",
  eyeArea: "augen",
  hair: "haar",
  symmetry: "symmetrie",
  chin: "kinn",
  facialHarmony: "harmonie",
  presentation: "praesentation",
};

const DAILY_SLOTS: { category: TaskCategory; count: number; required?: boolean }[] = [
  { category: "wasser", count: 1, required: true },
  { category: "hautpflege", count: 2, required: true },
  { category: "haltung", count: 2 },
  { category: "mobilitaet", count: 1 },
  { category: "gym", count: 1 },
  { category: "cardio", count: 1 },
  { category: "ernaehrung", count: 1, required: true },
  { category: "schlaf", count: 1, required: true },
  { category: "lifestyle", count: 1 },
];

function createSeed(analysis: AnalysisResult, profile?: Profile | null): number {
  const vals = [
    analysis.ascendScore,
    ...Object.values(analysis.scores),
    profile?.age ?? 28,
    profile?.gymExperience?.length ?? 0,
    profile?.goal?.length ?? 0,
    analysis.metrics.forwardHeadPosture,
    analysis.metrics.jawAngle,
  ];
  return vals.reduce((h, v) => Math.imul(31, h) + Math.round(Number(v) * 100), 0x9e3779b9);
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function resolveGymLevel(profile?: Profile | null): GymLevel {
  const exp = profile?.gymExperience?.toLowerCase() ?? "";
  if (/profi|fortgeschritten|erfahren|2\+|3\+/.test(exp)) return "fortgeschritten";
  if (/anfaenger|neu|beginn|0/.test(exp)) return "anfaenger";
  return "alle";
}

function rankedTags(scores: CategoryScores): PersonalizationTag[] {
  const sorted = (Object.entries(scores) as [keyof CategoryScores, number][])
    .sort(([, a], [, b]) => a - b)
    .map(([k]) => CATEGORY_TO_TAG[k])
    .filter((t): t is PersonalizationTag => !!t);
  return [...new Set(sorted)];
}

function buildReason(
  habit: HabitEntry,
  focusKey: keyof CategoryScores,
  scores: CategoryScores,
  weaknesses: string[]
): string {
  const focusLabel = getFocusAreaDE(focusKey);
  const score = Math.round(scores[focusKey] ?? 0);
  const weakness = weaknesses.find((w) =>
    habit.tags.some((t) => w.toLowerCase().includes(t.slice(0, 4)))
  );

  if (habit.evidenceLevel === "optional") {
    return `Optional: Dein Scan deutet auf Verbesserungspotenzial bei ${focusLabel} hin (${score}/100). Diese Übung ist freiwillig — begrenzte Evidenz für strukturelle Veränderung, kann aber Entspannung und Gewohnheitsbewusstsein fördern.`;
  }

  if (weakness) {
    return `Empfohlen, weil deine Analyse ${weakness} als Verbesserungsbereich zeigt (Schätzwert ${score}/100). Diese Gewohnheit unterstützt ${focusLabel} mit evidenzbasierten Methoden.`;
  }

  return `Personalisiert für ${focusLabel} (Schätzwert ${score}/100) basierend auf deinem Frontal- und Profil-Scan.`;
}

function habitToTask(
  habit: HabitEntry,
  day: number,
  focusKey: keyof CategoryScores,
  analysis: AnalysisResult
): PlanTask {
  return {
    id: `d${day}-${habit.id}`,
    habitId: habit.id,
    title: habit.title,
    description: habit.description,
    category: habit.category,
    durationMinutes: habit.durationMinutes,
    difficulty: habit.difficulty,
    xp: habit.xp,
    icon: habit.icon,
    evidenceLevel: habit.evidenceLevel,
    reason: buildReason(habit, focusKey, analysis.scores, analysis.weaknesses),
  };
}

function pickHabit(
  pool: HabitEntry[],
  used: Set<string>,
  rand: () => number,
  tagWeights: PersonalizationTag[]
): HabitEntry | null {
  const available = pool.filter((h) => !used.has(h.id));
  if (!available.length) return null;

  const scored = available.map((h) => {
    let weight = 1;
    for (let i = 0; i < tagWeights.length; i++) {
      if (h.tags.includes(tagWeights[i])) weight += (tagWeights.length - i) * 2;
    }
    weight += rand() * 0.5;
    return { h, weight };
  });
  scored.sort((a, b) => b.weight - a.weight);
  const top = scored.slice(0, Math.min(5, scored.length));
  const pick = top[Math.floor(rand() * top.length)];
  return pick?.h ?? null;
}

function selectForDay(
  week: number,
  day: number,
  tags: PersonalizationTag[],
  gymLevel: GymLevel,
  usedGlobal: Set<string>,
  rand: () => number,
  focusKey: keyof CategoryScores,
  analysis: AnalysisResult
): PlanTask[] {
  const tasks: PlanTask[] = [];
  const dayUsed = new Set<string>();

  const poolFor = (cat: TaskCategory, extraTags?: PersonalizationTag[]) => {
    const weekTags = extraTags ?? tags;
    return HABIT_DATABASE.filter(
      (h) =>
        h.category === cat &&
        h.weekMin <= week &&
        (h.gymLevel === "alle" || h.gymLevel === gymLevel || gymLevel === "fortgeschritten")
    ).sort((a, b) => {
      const scoreA = weekTags.reduce((s, t) => s + (a.tags.includes(t) ? 1 : 0), 0);
      const scoreB = weekTags.reduce((s, t) => s + (b.tags.includes(t) ? 1 : 0), 0);
      return scoreB - scoreA;
    });
  };

  for (const slot of DAILY_SLOTS) {
    const pool = poolFor(slot.category);
    for (let i = 0; i < slot.count; i++) {
      const habit = pickHabit(pool, new Set([...usedGlobal, ...dayUsed]), rand, tags);
      if (!habit) continue;
      dayUsed.add(habit.id);
      usedGlobal.add(habit.id);
      tasks.push(habitToTask(habit, day, focusKey, analysis));
    }
  }

  // Priority-tagged extras based on weaknesses
  const priorityPool = HABIT_DATABASE.filter(
    (h) => h.weekMin <= week && h.tags.includes(tags[0]) && !usedGlobal.has(h.id)
  );
  const extraCount = Math.min(2, 10 - tasks.length);
  for (let i = 0; i < extraCount; i++) {
    const habit = pickHabit(priorityPool, usedGlobal, rand, tags);
    if (!habit || dayUsed.has(habit.id)) continue;
    dayUsed.add(habit.id);
    usedGlobal.add(habit.id);
    tasks.push(habitToTask(habit, day, focusKey, analysis));
  }

  // Progress reflection every 3rd day
  if (day % 3 === 0 && tasks.length < 10) {
    const progressHabits = poolFor("fortschritt");
    const habit = pickHabit(progressHabits, usedGlobal, rand, tags);
    if (habit) {
      usedGlobal.add(habit.id);
      tasks.push(habitToTask(habit, day, focusKey, analysis));
    }
  }

  // Hair on specific days if weak
  if (analysis.scores.hair < 65 && day % 4 === 0 && tasks.length < 10) {
    const hairHabits = poolFor("haarpflege", ["haar"]);
    const habit = pickHabit(hairHabits, usedGlobal, rand, ["haar"]);
    if (habit) {
      usedGlobal.add(habit.id);
      tasks.push(habitToTask(habit, day, focusKey, analysis));
    }
  }

  return tasks.slice(0, 10);
}

function buildFaceSection(
  week: number,
  tags: PersonalizationTag[],
  used: Set<string>,
  rand: () => number,
  focusKey: keyof CategoryScores,
  analysis: AnalysisResult
): PlanDay["faceSection"] {
  const evidenceBased = HABIT_DATABASE.filter(
    (h) =>
      (h.category === "gesichtsmassage" || h.category === "haltung") &&
      h.evidenceLevel === "evidenzbasiert" &&
      h.weekMin <= week &&
      !used.has(h.id)
  );
  const optional = HABIT_DATABASE.filter(
    (h) =>
      h.category === "gesicht" &&
      h.evidenceLevel === "optional" &&
      h.weekMin <= week &&
      !used.has(h.id)
  );

  const evTasks: PlanTask[] = [];
  for (let i = 0; i < 2; i++) {
    const h = pickHabit(evidenceBased, used, rand, tags);
    if (!h) break;
    used.add(h.id);
    evTasks.push(habitToTask(h, 0, focusKey, analysis));
  }

  const optTasks: PlanTask[] = [];
  if (tags.includes("kiefer") || tags.includes("kinn") || analysis.scores.jawDefinition < 68) {
    for (let i = 0; i < 2; i++) {
      const h = pickHabit(optional, used, rand, ["kiefer", "kinn"]);
      if (!h) break;
      used.add(h.id);
      optTasks.push(habitToTask(h, 0, focusKey, analysis));
    }
  }

  if (!evTasks.length && !optTasks.length) return undefined;

  return {
    evidenceBased: evTasks,
    optional: optTasks,
    disclaimer: FACE_DISCLAIMER,
  };
}

function deriveLegacySections(tasks: PlanTask[]) {
  const byCat = (cats: TaskCategory[]) =>
    tasks.filter((t) => cats.includes(t.category)).map((t) => t.title);

  return {
    morningRoutine: byCat(["wasser", "lifestyle"]).slice(0, 3),
    skincare: byCat(["hautpflege"]),
    exercises: byCat(["haltung", "mobilitaet", "gesicht"]),
    gym: byCat(["gym"]),
    neckPosture: byCat(["haltung"]),
    stretching: byCat(["mobilitaet"]),
    facialMassage: byCat(["gesichtsmassage"]),
    habits: byCat(["wasser", "lifestyle", "fortschritt"]),
    eveningRoutine: byCat(["schlaf", "hautpflege"]).slice(0, 3),
    stressManagement: byCat(["lifestyle", "schlaf"]),
    haircare: byCat(["haarpflege"]),
    lifestyle: byCat(["lifestyle", "cardio"]),
    recovery: byCat(["schlaf"]),
    confidence: ["2 Min. Power-Haltung vor dem Spiegel"],
  };
}

function nutritionForDay(
  week: number,
  day: number,
  profile?: Profile | null,
  scores?: CategoryScores
) {
  const age = profile?.age ?? 28;
  const baseProtein = 1.6 * (profile?.weightKg ?? 75);
  const intensity = 1 + (week - 1) * 0.08;
  const skinBoost = (scores?.skin ?? 70) < 60 ? 10 : 0;
  return {
    protein: Math.round(baseProtein * intensity + skinBoost + (day % 7) * 2),
    water: Math.round((2.5 + week * 0.15 + (day % 3) * 0.1) * 10) / 10,
    calories: Math.round(2100 + week * 40 + age * 2 + (day % 5) * 15),
  };
}

function todayFocusText(focusKey: keyof CategoryScores, week: number, day: number): string {
  const area = getFocusAreaDE(focusKey);
  const phase = WEEK_PHASES[week - 1] ?? WEEK_PHASES[0];
  const focuses = [
    `${area} — ${phase}`,
    `Konsistenz bei ${area}`,
    `Feinschliff: ${area}`,
    `Peak-Woche: ${area}`,
  ];
  return focuses[(day + week) % focuses.length];
}

function estimatedImprovement(analysis: AnalysisResult, week: number): string {
  const pot = analysis.improvementPotential ?? analysis.estimatedImprovementPotential;
  const weekly = Math.round((pot / 30) * 7 * (1 + week * 0.05));
  return `+${weekly}% geschätztes Wochenpotenzial bei konsequenter Umsetzung`;
}

function completionReward(xp: number, week: number): string {
  const bonuses = [
    `${xp} XP + Streak-Bonus`,
    `${xp + 25} XP + Fortschritts-Badge`,
    `${xp + 50} XP + Wochen-Challenge freigeschaltet`,
    `${xp + 100} XP + Elite-Status für Woche ${week}`,
  ];
  return bonuses[week - 1] ?? bonuses[0];
}

function weeklyGoalText(week: number, focus: string, taskCount: number): string {
  const goals = [
    `Woche ${week}: ${taskCount} tägliche Aufgaben — Fokus ${focus}`,
    `Mindestens 80% Abschlussrate diese Woche`,
    `Alle Haltungs- und Hautpflege-Tasks mindestens 5× erledigen`,
    `Peak-Woche: 90%+ Abschluss + Wochenscan vorbereiten`,
  ];
  return goals[week - 1] ?? goals[0];
}

export function generateAscensionPlan(
  analysis: AnalysisResult,
  days = 30,
  ctx?: PlanGenerationContext
): PlanDay[] {
  const profile = ctx?.profile;
  const seed = createSeed(analysis, profile);
  const focusKey = getWeakestCategory(analysis.scores);
  const tags = rankedTags(analysis.scores);
  const gymLevel = resolveGymLevel(profile);
  const usedGlobal = new Set<string>(ctx?.completedHabitIds ?? []);
  const plan: PlanDay[] = [];

  for (let d = 1; d <= days; d++) {
    const week = Math.ceil(d / 7);
    const weekday = WEEKDAYS_DE[(d - 1) % 7];
    const phase = WEEK_PHASES[week - 1] ?? WEEK_PHASES[0];
    const daySeed = seed + d * 997;
    const dayRand = mulberry32(daySeed);

    const tasks = selectForDay(
      week,
      d,
      tags,
      gymLevel,
      usedGlobal,
      dayRand,
      focusKey,
      analysis
    );

    const faceSection = buildFaceSection(week, tags, usedGlobal, dayRand, focusKey, analysis);
    const faceTasks = [...(faceSection?.evidenceBased ?? []), ...(faceSection?.optional ?? [])];
    const allTasks = [...tasks, ...faceTasks.map((t) => ({ ...t, id: `d${d}-${t.habitId}-face` }))];

    const xpAvailable = allTasks.reduce((s, t) => s + t.xp, 0);
    const legacy = deriveLegacySections(allTasks);
    const focus = getFocusAreaDE(focusKey);
    const focusReason = `Dein Frontal- und Profil-Scan zeigt ${focus} als primären Hebel (Schätzwert ${Math.round(analysis.scores[focusKey])}/100). ${analysis.weaknesses[0] ? `Besonders: ${analysis.weaknesses[0]}.` : ""}`;

    plan.push({
      dayNumber: d,
      weekNumber: week,
      weekday,
      title: `${weekday} — ${phase}`,
      phase,
      focus,
      focusReason,
      dailyQuote: getDailyQuoteDE(d),
      todayFocus: todayFocusText(focusKey, week, d),
      estimatedImprovement: estimatedImprovement(analysis, week),
      xpAvailable,
      completionReward: completionReward(xpAvailable, week),
      weeklyGoal: weeklyGoalText(week, focus, allTasks.length),
      tasks: allTasks,
      faceSection,
      nutrition: nutritionForDay(week, d, profile, analysis.scores),
      morningRoutine: legacy.morningRoutine,
      skincare: legacy.skincare,
      exercises: legacy.exercises,
      gym: legacy.gym,
      habits: legacy.habits,
      eveningRoutine: legacy.eveningRoutine,
      neckPosture: legacy.neckPosture,
      stretching: legacy.stretching,
      facialMassage: legacy.facialMassage,
      stressManagement: legacy.stressManagement,
      haircare: legacy.haircare,
      confidence: legacy.confidence,
      lifestyle: legacy.lifestyle,
      recovery: legacy.recovery,
    });
  }

  return plan;
}

export function planTasksToDailyItems(tasks: PlanTask[]) {
  return tasks.map((t) => ({
    id: t.id,
    label: t.title,
    description: t.description,
    category: t.category,
    durationMinutes: t.durationMinutes,
    difficulty: t.difficulty,
    xp: t.xp,
    icon: t.icon,
    evidenceLevel: t.evidenceLevel,
    reason: t.reason,
    completed: false,
  }));
}

export function generateDailyTasks(
  analysis: AnalysisResult,
  ctx?: PlanGenerationContext,
  dayNumber = 1
) {
  const plan = generateAscensionPlan(analysis, dayNumber, ctx);
  const day = plan[dayNumber - 1];
  return planTasksToDailyItems(day?.tasks ?? []);
}

export function getTodayPlanTasks(data: {
  ascensionPlans: PlanDay[];
  planStartDate: string | null;
}): PlanTask[] {
  if (!data.ascensionPlans.length) return [];
  const start = data.planStartDate ? new Date(data.planStartDate) : new Date();
  const days = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
  const dayIndex = Math.min(Math.max(days, 0), data.ascensionPlans.length - 1);
  return data.ascensionPlans[dayIndex]?.tasks ?? [];
}

export { getHabitById };
