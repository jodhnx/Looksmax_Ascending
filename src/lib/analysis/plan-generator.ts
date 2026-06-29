import type { AnalysisResult, PlanDay } from "./types";
import { getWeakestCategory } from "./scoring";
import { WEEKDAYS_DE, getFocusAreaDE } from "@/lib/i18n/de";
import type { CategoryScores } from "./types";

const SKINCARE: Record<string, string[]> = {
  low: [
    "Sanfte Reinigung morgens & abends",
    "Niacinamid-Serum",
    "Leichte, ölfreie Feuchtigkeitscreme",
    "SPF 30+ jeden Morgen",
  ],
  mid: [
    "Doppelte Reinigung abends",
    "Vitamin-C-Serum morgens",
    "Leichte Feuchtigkeitspflege",
    "SPF 50 täglich",
  ],
  high: [
    "Hydratisierende Reinigung",
    "Antioxidantien-Serum",
    "Reichhaltige Feuchtigkeitspflege",
    "SPF 30+ täglich",
  ],
};

function skinTier(score: number) {
  if (score < 55) return "low";
  if (score < 72) return "mid";
  return "high";
}

function pick<T>(arr: T[], day: number, offset = 0): T {
  return arr[(day + offset) % arr.length];
}

function buildDayContent(
  s: CategoryScores,
  day: number,
  week: number,
  focus: keyof CategoryScores
) {
  const intensity = Math.min(1 + Math.floor(week / 2), 4);
  const skincare = SKINCARE[skinTier(s.skin)];

  const jawPool = [
    `${3 + intensity} Min. Chin Tucks`,
    "Nacken-Isometrien 3×30 Sek.",
    "Kieferdehnung links/rechts 45 Sek.",
    `${intensity * 5} Min. Nackenmobilität`,
    "Masseter-Entspannung 2 Min.",
  ];

  const posturePool = [
    "Wall Angels × 12",
    "Thoracic Extension am Schaumstoffroller 3 Min.",
    "Brustdehnung im Türrahmen 60 Sek.",
    "Oberrücken-Aktivierung mit Band 3×15",
    "Stündliche Haltungschecks (Schultern zurück)",
  ];

  const skinPool = [
    "Gesicht nicht anfassen",
    "2,5L+ Wasser bis Mittag",
    "Kissenbezug wechseln (2×/Woche)",
    "Kalte Abschluss-Spülung 30 Sek.",
    "Antioxidantien-reiche Mahlzeit",
  ];

  const gymPool = [
    `${20 + intensity * 5} Min. Oberkörpertraining`,
    `${25 + intensity * 5} Min. Ganzkörper-Circuit`,
    `${30 + intensity * 3} Min. Krafttraining mit Progression`,
    "15 Min. Zone-2 Cardio",
    "20 Min. Functional Training",
  ];

  const stretchPool = [
    "Oberer Trapezius 45 Sek. je Seite",
    "Cat-Cow × 12",
    "Hüftbeuger-Dehnung 60 Sek.",
    "Schulterkreisen 2 Min.",
    "Ganzkörper-Flow 8 Min.",
  ];

  const lifestylePool = [
    "10 Min. Spaziergang ohne Handy",
    "5 Min. Box-Breathing",
    "Morgensonnenlicht innerhalb 30 Min.",
    "Bildschirmfrei 30 Min. vor dem Schlaf",
    "Proteinreiches Frühstück",
  ];

  const recoveryPool = [
    `Schlafziel: ${7 + (week > 2 ? 1 : 0)} Stunden`,
    "Abendliche Hautpflege-Routine",
    "Magnesium vor dem Schlaf (optional)",
    "Leichte Abenddehnung 5 Min.",
    "Tagebuch: 1 Fortschritt notieren",
  ];

  const focusPools: Record<keyof CategoryScores, string[]> = {
    jawDefinition: jawPool,
    posture: posturePool,
    skin: skinPool,
    symmetry: [...jawPool.slice(0, 2), ...posturePool.slice(0, 2)],
    chin: jawPool,
    facialHarmony: [...posturePool, ...gymPool.slice(0, 2)],
    eyeArea: [...recoveryPool, ...skinPool.slice(0, 2)],
    hair: ["Kopfhautmassage 2 Min.", "Haarlinie pflegen", "Styling-Check"],
    presentation: lifestylePool,
  };

  const focusExercises = focusPools[focus] ?? posturePool;

  return {
    morningRoutine: [
      `500ml Wasser direkt nach dem Aufstehen`,
      pick(skincare, day, 0),
      pick(focusExercises, day, 1),
      day % 3 === 0 ? "2 Min. Gesichtsmassage" : "Kaltwasser-Gesichtsspülung 30 Sek.",
    ],
    skincare: skincare.map((item, i) => (day + i) % 2 === 0 ? item : item),
    exercises: [
      pick(focusExercises, day, 2),
      pick(stretchPool, day, 0),
      s.symmetry < 60 ? "Gleichmäßig kauen 10 Min." : "Kiefer entspannen — nicht pressen",
    ],
    gym: [pick(gymPool, day, week), pick(jawPool, day, 3)],
    neckPosture:
      s.posture < 70
        ? [pick(posturePool, day, 0), pick(posturePool, day, 1), pick(jawPool, day, 0)]
        : [pick(posturePool, day, 2)],
    stretching: [pick(stretchPool, day, 0), pick(stretchPool, day, 1)],
    facialMassage:
      s.skin < 70
        ? ["Lymphdrainage-Strokes 3 Min.", "Masseter-Release 1 Min./Seite"]
        : ["Leichte Gesichtsmassage 2 Min."],
    habits: [
      `${(2.5 + intensity * 0.2).toFixed(1)}L Wasser`,
      pick(skinPool, day, 2),
      pick(lifestylePool, day, 0),
    ],
    nutrition: {
      protein: 115 + intensity * 12 + (day % 7) * 2,
      water: 2.5 + intensity * 0.2,
      calories: 2100 + intensity * 60 + week * 20,
    },
    eveningRoutine: [
      pick(skincare.slice().reverse(), day, 0),
      pick(recoveryPool, day, 0),
      pick(recoveryPool, day, 1),
    ],
    stressManagement: [pick(lifestylePool, day, 1), pick(lifestylePool, day, 2)],
    haircare:
      s.hair < 65
        ? [pick(["Kopfhautpflege", "Saubere Haarlinie", "Trim-Planung"], day, 0)]
        : ["Grooming-Routine beibehalten"],
    grooming: ["Nägel prüfen", day % 5 === 0 ? "Augenbrauen formen" : "Haut-Check"],
    confidence: ["2 Min. Power-Haltung vor dem Spiegel", "1 Erfolg des Tages notieren"],
    lifestyle: [pick(lifestylePool, day, 3), pick(lifestylePool, day, 4)],
    recovery: [pick(recoveryPool, day, 2), pick(recoveryPool, day, 3)],
  };
}

const PHASE_DE = ["Fundament", "Aufbau", "ASCEND"];

export function generateAscensionPlan(analysis: AnalysisResult, days = 30): PlanDay[] {
  const s = analysis.scores;
  const focus = getWeakestCategory(s);
  const plan: PlanDay[] = [];

  for (let d = 1; d <= days; d++) {
    const week = Math.ceil(d / 7);
    const weekday = WEEKDAYS_DE[(d - 1) % 7];
    const phase = PHASE_DE[Math.min(week - 1, 2)];
    const content = buildDayContent(s, d, week, focus);

    plan.push({
      dayNumber: d,
      weekNumber: week,
      weekday,
      title: `${weekday} — ${phase}`,
      focus: getFocusAreaDE(focus),
      ...content,
    });
  }

  return plan;
}

export function generateDailyTasks(analysis: AnalysisResult) {
  const s = analysis.scores;
  const focus = getWeakestCategory(s);
  const tasks: {
    id: string;
    label: string;
    category: string;
    durationMinutes: number;
    difficulty: "leicht" | "mittel" | "schwer";
    completed: boolean;
  }[] = [
    {
      id: "water",
      label: "2,5 Liter Wasser trinken",
      category: "Hydration",
      durationMinutes: 0,
      difficulty: "leicht",
      completed: false,
    },
    {
      id: "spf",
      label: "SPF morgens auftragen",
      category: "Hautpflege",
      durationMinutes: 2,
      difficulty: "leicht",
      completed: false,
    },
    {
      id: "skincare-pm",
      label: "Abendliche Hautpflege",
      category: "Hautpflege",
      durationMinutes: 5,
      difficulty: "leicht",
      completed: false,
    },
    {
      id: "sleep",
      label: "7–8 Stunden schlafen",
      category: "Erholung",
      durationMinutes: 0,
      difficulty: "mittel",
      completed: false,
    },
  ];

  if (s.posture < 70) {
    tasks.push({
      id: "posture",
      label: "10 Minuten Haltungstraining",
      category: "Haltung",
      durationMinutes: 10,
      difficulty: "mittel",
      completed: false,
    });
  }
  if (s.jawDefinition < 70 || focus === "jawDefinition") {
    tasks.push({
      id: "jaw",
      label: "Nacken- & Kieferübungen (8 Min.)",
      category: "Haltung",
      durationMinutes: 8,
      difficulty: "mittel",
      completed: false,
    });
  }
  if (s.skin < 70) {
    tasks.push({
      id: "skin-habit",
      label: "Gesicht heute nicht anfassen",
      category: "Hautpflege",
      durationMinutes: 0,
      difficulty: "leicht",
      completed: false,
    });
  }
  tasks.push({
    id: "walk",
    label: "15 Minuten Spaziergang",
    category: "Lifestyle",
    durationMinutes: 15,
    difficulty: "leicht",
    completed: false,
  });
  tasks.push({
    id: "workout",
    label: "Tägliches Training absolvieren",
    category: "Gym",
    durationMinutes: 30,
    difficulty: "schwer",
    completed: false,
  });
  tasks.push({
    id: "protein",
    label: "Proteinziel erreichen",
    category: "Ernährung",
    durationMinutes: 0,
    difficulty: "mittel",
    completed: false,
  });

  return tasks.slice(0, 8);
}
