import type { AnalysisResult, PlanDay } from "./types";

const SKINCARE_BY_SKIN: Record<string, string[]> = {
  low: [
    "Gentle cleanser AM/PM",
    "Niacinamide serum",
    "Oil-free moisturizer",
    "SPF 30+ every morning",
  ],
  mid: [
    "Double cleanse PM",
    "Vitamin C serum AM",
    "Light moisturizer",
    "SPF 50 daily",
  ],
  high: [
    "Hydrating cleanser",
    "Antioxidant serum",
    "Rich moisturizer",
    "SPF 30+ daily",
  ],
};

function skinTier(score: number): string {
  if (score < 55) return "low";
  if (score < 72) return "mid";
  return "high";
}

export function generateAscensionPlan(
  analysis: AnalysisResult,
  days = 30
): PlanDay[] {
  const s = analysis.scores;
  const skincare = SKINCARE_BY_SKIN[skinTier(s.skin)];

  const plan: PlanDay[] = [];

  for (let d = 1; d <= days; d++) {
    const phase = d <= 10 ? "Foundation" : d <= 20 ? "Build" : "Ascend";
    const intensity = Math.min(1 + Math.floor(d / 10), 3);

    const morningRoutine = [
      "Wake — drink 500ml water",
      "Cold rinse face 30 seconds",
      ...(d % 2 === 0 ? ["5 min facial massage"] : ["Jaw stretches 2 min"]),
    ];

    const neckPosture =
      s.posture < 65
        ? [
            `${2 + intensity} min chin tucks`,
            "Wall angels × 10",
            "Neck extension holds 30s",
          ]
        : ["Chin tuck reminder every hour", "Posture check 2x daily"];

    const stretching = [
      "Upper trap stretch 45s each side",
      "Chest doorway stretch 60s",
      "Cat-cow × 10",
    ];

    const gym =
      s.jawDefinition < 60 || s.facialHarmony < 65
        ? [
            `${20 + intensity * 5} min resistance training`,
            "Compound lifts or bodyweight circuit",
            "Neck isometric holds 3×30s",
          ]
        : [
            `${25 + intensity * 5} min strength session`,
            "Progressive overload focus",
          ];

    const exercises = [
      "Posture reset — shoulders back",
      ...(s.symmetry < 60 ? ["Chew gum evenly 10 min"] : []),
      "Facial relaxation — unclench jaw",
    ];

    const facialMassage = [
      "Lymphatic drainage strokes 3 min",
      "Masseter release 1 min each side",
    ];

    const habits = [
      `Drink ${2.5 + intensity * 0.25}L water`,
      "No face touching",
      s.skin < 60 ? "Change pillowcase 2x/week" : "Clean pillowcase weekly",
    ];

    const nutrition = {
      protein: 120 + intensity * 10,
      water: 2.5 + intensity * 0.25,
      calories: 2200 + intensity * 50,
    };

    const eveningRoutine = [
      "Skincare PM routine",
      "Screen off 30 min before bed",
      `Sleep target: ${7 + (d > 15 ? 1 : 0)} hours`,
    ];

    const stressManagement = [
      "5 min box breathing",
      "10 min walk without phone",
    ];

    const haircare =
      s.hair < 65
        ? ["Scalp massage 2 min", "Clean hairline", "Trim schedule reminder"]
        : ["Maintain grooming routine", "Condition ends"];

    const grooming = ["Trim nails", "Eyebrow tidy if needed"];
    const confidence = [
      "Power posture 2 min in mirror",
      "Log one win from today",
    ];

    plan.push({
      dayNumber: d,
      title: `Day ${d} — ${phase}`,
      morningRoutine,
      skincare: [...skincare],
      exercises,
      gym,
      nutrition,
      habits,
      eveningRoutine,
      neckPosture,
      stretching,
      facialMassage,
      stressManagement,
      haircare,
      grooming,
      confidence,
    });
  }

  return plan;
}

export function generateDailyTasks(
  analysis: AnalysisResult
): { id: string; label: string; category: string; completed: boolean }[] {
  const s = analysis.scores;
  const tasks: { id: string; label: string; category: string }[] = [
    { id: "water", label: "Drink 2.5L+ water", category: "hydration" },
    { id: "spf", label: "Apply SPF (morning)", category: "skincare" },
    { id: "skincare-pm", label: "Complete PM skincare", category: "skincare" },
    { id: "sleep", label: "Sleep 7-8 hours", category: "recovery" },
  ];

  if (s.posture < 70) {
    tasks.push({ id: "chin-tuck", label: "Chin tucks 3×10", category: "posture" });
    tasks.push({ id: "posture", label: "Posture check every 2 hours", category: "posture" });
  }
  if (s.jawDefinition < 70) {
    tasks.push({ id: "jaw", label: "Jaw/neck exercises 5 min", category: "fitness" });
  }
  if (s.skin < 70) {
    tasks.push({ id: "skin", label: "No touching face today", category: "skincare" });
  }
  tasks.push({ id: "workout", label: "Complete daily workout", category: "fitness" });
  tasks.push({ id: "stretch", label: "10 min stretching", category: "recovery" });

  return tasks.slice(0, 8).map((t) => ({ ...t, completed: false }));
}
