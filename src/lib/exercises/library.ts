export type ExerciseCategory =
  | "haltung"
  | "nacken"
  | "schultern"
  | "brust"
  | "ruecken"
  | "beweglichkeit"
  | "gym"
  | "cardio"
  | "stretching"
  | "lifestyle"
  | "skincare"
  | "haircare";

export type ExerciseDifficulty = "leicht" | "mittel" | "schwer";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  durationMinutes: number;
  targetArea: string;
  instructions: string[];
  icon: string;
  reminder: string;
}

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: "chin-tuck",
    name: "Chin Tuck",
    description: "Korrigiert Forward-Head-Haltung und aktiviert tiefe Nackenflexoren.",
    category: "nacken",
    difficulty: "leicht",
    durationMinutes: 3,
    targetArea: "Nacken, Kiefer",
    icon: "user",
    reminder: "Morgens & abends",
    instructions: [
      "Aufrecht sitzen oder stehen, Blick geradeaus",
      "Kinn gerade nach hinten ziehen (Doppelkinn bilden)",
      "5 Sekunden halten, loslassen",
      "10–15 Wiederholungen",
    ],
  },
  {
    id: "wall-angel",
    name: "Wall Angels",
    description: "Mobilisiert Schultern und Oberrücken für bessere Haltung.",
    category: "haltung",
    difficulty: "leicht",
    durationMinutes: 5,
    targetArea: "Schultern, Oberrücken",
    icon: "move-vertical",
    reminder: "Täglich morgens",
    instructions: [
      "Rücken flach an die Wand",
      "Arme im 90°-Winkel, Handgelenke und Ellbogen an der Wand",
      "Arme langsam nach oben führen, Kontakt halten",
      "10 kontrollierte Wiederholungen",
    ],
  },
  {
    id: "thoracic-extension",
    name: "Brustwirbelsäulen-Extension",
    description: "Öffnet den oberen Rücken — wichtig bei Schreibtischhaltung.",
    category: "ruecken",
    difficulty: "mittel",
    durationMinutes: 4,
    targetArea: "Brustwirbelsäule",
    icon: "waves",
    reminder: "Nach langem Sitzen",
    instructions: [
      "Schaumstoffrolle quer unter den oberen Rücken",
      "Hände hinter dem Kopf verschränken",
      "Sanft über die Rolle extensionieren",
      "8–10 langsame Wiederholungen",
    ],
  },
  {
    id: "band-pull-apart",
    name: "Band Pull-Aparts",
    description: "Kräftigt den hinteren Schultergürtel für aufrechte Haltung.",
    category: "schultern",
    difficulty: "mittel",
    durationMinutes: 5,
    targetArea: "Hintere Schultern, Oberrücken",
    icon: "dumbbell",
    reminder: "Nach dem Training",
    instructions: [
      "Widerstandsband auf Brusthöhe halten",
      "Band auseinanderziehen, Schulterblätter zusammenziehen",
      "15–20 kontrollierte Wiederholungen",
      "3 Sätze",
    ],
  },
  {
    id: "chest-stretch",
    name: "Brustdehnung im Türrahmen",
    description: "Gegen rundete Schultern und enge Brustmuskulatur.",
    category: "brust",
    difficulty: "leicht",
    durationMinutes: 3,
    targetArea: "Brust, vordere Schulter",
    icon: "stretch-horizontal",
    reminder: "Mittags",
    instructions: [
      "Unterarm am Türrahmen, Ellbogen 90°",
      "Oberkörper langsam nach vorne lehnen",
      "45–60 Sekunden je Seite",
    ],
  },
  {
    id: "neck-extension",
    name: "Nackenstreckung",
    description: "Dehnt die Nackenextensoren und entlastet den Nacken.",
    category: "nacken",
    difficulty: "leicht",
    durationMinutes: 4,
    targetArea: "Nacken",
    icon: "arrow-up",
    reminder: "Nach Bildschirmarbeit",
    instructions: [
      "Aufrecht sitzen, Hände hinter dem Kopf verschränken",
      "Nacken sanft nach hinten strecken",
      "15–20 Sekunden halten, 3× wiederholen",
    ],
  },
  {
    id: "cat-cow",
    name: "Katze-Kuh",
    description: "Mobilisiert die gesamte Wirbelsäule.",
    category: "stretching",
    difficulty: "leicht",
    durationMinutes: 4,
    targetArea: "Wirbelsäule, Core",
    icon: "waves",
    reminder: "Morgen-Mobility",
    instructions: [
      "Vierfüßlerstand, neutrale Wirbelsäule",
      "Rücken wölben, Blick nach unten (Katze)",
      "Rücken durchhängen, Blick nach oben (Kuh)",
      "10–15 fließende Wiederholungen",
    ],
  },
  {
    id: "face-massage",
    name: "Lymphatische Gesichtsmassage",
    description: "Reduziert Gesichtsödeme und entspannt den Masseter.",
    category: "skincare",
    difficulty: "leicht",
    durationMinutes: 5,
    targetArea: "Gesicht, Kiefer",
    icon: "sparkles",
    reminder: "Abendroutine",
    instructions: [
      "Leichtes Öl oder Feuchtigkeitscreme auftragen",
      "Von der Mitte nach außen streichen",
      "Leichter Druck unter den Wangenknochen",
      "Kieferlinie nach unten ausstreichen",
    ],
  },
  {
    id: "upper-trap",
    name: "Oberer Trapezius-Dehnung",
    description: "Entlastet verspannte Nacken- und Schultermuskulatur.",
    category: "beweglichkeit",
    difficulty: "leicht",
    durationMinutes: 3,
    targetArea: "Nacken, Schulter",
    icon: "stretch-horizontal",
    reminder: "Mittags",
    instructions: [
      "Kopf zur Seite neigen",
      "Mit der anderen Hand sanft ziehen",
      "45 Sekunden je Seite",
    ],
  },
  {
    id: "zone2-walk",
    name: "Zone-2-Spaziergang",
    description: "Verbessert Regeneration, Haut und allgemeine Fitness.",
    category: "cardio",
    difficulty: "leicht",
    durationMinutes: 20,
    targetArea: "Ganzkörper",
    icon: "sun",
    reminder: "Täglich",
    instructions: [
      "20 Min. zügiges Gehen",
      "Du solltest noch sprechen können",
      "Idealerweise im Freien",
    ],
  },
  {
    id: "upper-body",
    name: "Oberkörper-Krafttraining",
    description: "Baut Schultern und Rücken auf — unterstützt Gesichtsproportionen.",
    category: "gym",
    difficulty: "schwer",
    durationMinutes: 35,
    targetArea: "Oberkörper",
    icon: "dumbbell",
    reminder: "3–4× pro Woche",
    instructions: [
      "Liegestütze, Rudern, Schulterdrücken",
      "3–4 Sätze à 8–12 Wiederholungen",
      "Progressive Steigerung der Last",
    ],
  },
  {
    id: "spf-routine",
    name: "SPF-Routine",
    description: "Schützt die Haut vor UV-Schäden — Basis jeder Hautpflege.",
    category: "skincare",
    difficulty: "leicht",
    durationMinutes: 2,
    targetArea: "Gesicht, Hals",
    icon: "sun",
    reminder: "Jeden Morgen",
    instructions: [
      "2 Fingerlängen SPF 30+ auftragen",
      "Gesicht, Hals und Ohren abdecken",
      "Bei 2+ Stunden draußen erneuern",
    ],
  },
  {
    id: "scalp-care",
    name: "Kopfhautpflege",
    description: "Fördert gesundes Haarwachstum und saubere Haarlinie.",
    category: "haircare",
    difficulty: "leicht",
    durationMinutes: 3,
    targetArea: "Kopfhaut, Haarlinie",
    icon: "sparkles",
    reminder: "Abends",
    instructions: [
      "Kopfhaut mit Fingerspitzen 2 Min. massieren",
      "Haarlinie sauber halten",
      "Regelmäßiger Schnitt planen",
    ],
  },
  {
    id: "morning-sun",
    name: "Morgensonnenlicht",
    description: "Reguliert den Rhythmus und verbessert Energie & Haut.",
    category: "lifestyle",
    difficulty: "leicht",
    durationMinutes: 15,
    targetArea: "Ganzkörper, Schlaf",
    icon: "sun",
    reminder: "Innerhalb 30 Min. nach dem Aufwachen",
    instructions: [
      "10–15 Min. draußen gehen",
      "Erste 10 Min. ohne Sonnenbrille",
      "Unterstützt Schlafqualität und Stimmung",
    ],
  },
  {
    id: "dead-hang",
    name: "Dead Hang",
    description: "Dekomprimiert die Wirbelsäule und öffnet die Schultern.",
    category: "schultern",
    difficulty: "mittel",
    durationMinutes: 3,
    targetArea: "Schultern, Griff, Rücken",
    icon: "hand",
    reminder: "An Trainingstagen",
    instructions: [
      "Klimmzugstange greifen",
      "Schultern entspannen, Körper hängen lassen",
      "20–40 Sekunden halten, 3 Sätze",
    ],
  },
];

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  haltung: "Haltung",
  nacken: "Nacken",
  schultern: "Schultern",
  brust: "Brust",
  ruecken: "Rücken",
  beweglichkeit: "Beweglichkeit",
  gym: "Gym",
  cardio: "Cardio",
  stretching: "Stretching",
  lifestyle: "Lifestyle",
  skincare: "Hautpflege",
  haircare: "Haarpflege",
};
