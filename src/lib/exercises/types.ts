export type TaskCategory =
  | "hautpflege"
  | "gym"
  | "ernaehrung"
  | "schlaf"
  | "cardio"
  | "haltung"
  | "gesichtsmassage"
  | "mobilitaet"
  | "wasser"
  | "fortschritt"
  | "gesicht"
  | "lifestyle"
  | "haarpflege";

export type EvidenceLevel = "evidenzbasiert" | "optional";

export type GymLevel = "anfaenger" | "fortgeschritten" | "profi" | "alle";

export type PersonalizationTag =
  | "kiefer"
  | "haltung"
  | "haut"
  | "augen"
  | "haar"
  | "symmetrie"
  | "kinn"
  | "harmonie"
  | "koerperfett"
  | "schlaf"
  | "hydration"
  | "praesentation";

export interface HabitEntry {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: "leicht" | "mittel" | "schwer";
  durationMinutes: number;
  icon: string;
  xp: number;
  evidenceLevel: EvidenceLevel;
  tags: PersonalizationTag[];
  gymLevel: GymLevel;
  weekMin: number;
}

export interface CategoryMeta {
  id: TaskCategory;
  label: string;
  emoji: string;
  color: string;
}
