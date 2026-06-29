import type { HabitEntry, PersonalizationTag, TaskCategory } from "./types";

export type TimeOfDay = "morgen" | "nachmittag" | "abend" | "nacht";

export interface HabitRichDetails {
  steps: string[];
  benefits: string[];
  hints: string[];
  frequency: string;
  targetGoals: string[];
  estimatedImpact: string;
  timeOfDay: TimeOfDay;
}

const TAG_LABELS: Record<PersonalizationTag, string> = {
  kiefer: "Kieferdefinition",
  haltung: "Haltung",
  haut: "Hautbild",
  augen: "Augenpartie",
  haar: "Haarpflege",
  symmetrie: "Gesichtssymmetrie",
  kinn: "Kinnprojektion",
  harmonie: "Gesichtsharmonie",
  koerperfett: "Körperzusammensetzung",
  schlaf: "Schlafqualität",
  hydration: "Hydration",
  praesentation: "Gesamteindruck",
};

const CATEGORY_HINTS: Record<TaskCategory, string[]> = {
  haltung: [
    "Nicht ins Hohlkreuz gehen.",
    "Ruhig und gleichmäßig atmen.",
    "Schultern entspannt halten.",
    "Bewegungen langsam und kontrolliert ausführen.",
  ],
  mobilitaet: [
    "Nur bis zu einem angenehmen Dehngefühl gehen.",
    "Keine ruckartigen Bewegungen.",
    "Beide Seiten gleichmäßig bearbeiten.",
  ],
  gym: [
    "Auf saubere Technik vor mehr Gewicht achten.",
    "Ausreichend Pause zwischen den Sätzen einplanen.",
    "Bei Schmerzen sofort stoppen.",
  ],
  cardio: [
    "Du solltest noch in ganzen Sätzen sprechen können.",
    "Ausreichend Wasser mitnehmen.",
    "Bequeme Schuhe tragen.",
  ],
  hautpflege: [
    "Produkte sanft auftragen — nicht reiben.",
    "Neue Produkte einzeln testen.",
    "SPF auch an bewölkten Tagen verwenden.",
  ],
  ernaehrung: [
    "Mahlzeiten zeitlich gleichmäßig verteilen.",
    "Ausreichend Gemüse und Vollkorn bevorzugen.",
  ],
  schlaf: [
    "Bildschirme 30 Minuten vor dem Schlaf meiden.",
    "Schlafzimmer kühl und dunkel halten.",
    "Feste Schlafenszeiten einhalten.",
  ],
  wasser: [
    "Wasser gleichmäßig über den Tag verteilen.",
    "Eine Wasserflasche griffbereit halten.",
  ],
  lifestyle: [
    "Kleine Gewohnheiten sind nachhaltiger als Extreme.",
    "Dranbleiben ist wichtiger als Perfektion.",
  ],
  gesichtsmassage: [
    "Nur leichten Druck verwenden.",
    "Hände und Gesicht vorher reinigen.",
  ],
  gesicht: [
    "Optional — keine dauerhafte Knochenumformung zu erwarten.",
    "Bei Unsicherheit ärztlichen Rat einholen.",
  ],
  haarpflege: [
    "Sanft massieren — nicht kratzen.",
    "Regelmäßigkeit ist wichtiger als Intensität.",
  ],
  fortschritt: [
    "Ehrlich dokumentieren — nur so erkennst du Trends.",
    "Fotos unter gleichen Bedingungen aufnehmen.",
  ],
};

const CATEGORY_STEPS: Record<TaskCategory, (h: HabitEntry) => string[]> = {
  haltung: (h) => [
    "Aufrecht hinsetzen oder hinstellen, Blick geradeaus.",
    `${h.title} langsam und kontrolliert starten.`,
    "Jede Wiederholung bewusst ausführen — Qualität vor Geschwindigkeit.",
    "Kurz halten, dann kontrolliert zurück in die Ausgangsposition.",
    "2–3 Sätze absolvieren und Nacken entspannt lassen.",
  ],
  mobilitaet: () => [
    "Ruhig einatmen und Körper aufwärmen.",
    "Bewegung langsam in den vollen, schmerzfreien Bereich führen.",
    "Position 30–45 Sekunden halten oder 10–12 Wiederholungen.",
    "Gegenseite genauso ausführen.",
    "Mit tiefem Ausatmen abschließen.",
  ],
  gym: () => [
    "5 Minuten leichtes Aufwärmen absolvieren.",
    "Übung mit leichtem Gewicht / Körpergewicht korrekt einstudieren.",
    "3–4 Sätze mit kontrollierten Wiederholungen ausführen.",
    "60–90 Sekunden Pause zwischen den Sätzen.",
    "Mit Dehnen der beanspruchten Muskeln abschließen.",
  ],
  cardio: (h) => [
    "Bequeme Kleidung und Schuhe anziehen.",
    "5 Minuten locker einsteigen.",
    `${h.durationMinutes} Minuten in moderater Intensität fortsetzen.`,
    "Atmung ruhig halten — noch sprechen können.",
    "5 Minuten langsam auslaufen und hydratisieren.",
  ],
  hautpflege: () => [
    "Hände waschen und Gesicht mit lauwarmem Wasser anfeuchten.",
    "Reinigungsprodukt sanft einmassieren.",
    "Gründlich abspülen und Gesicht vorsichtig abtupfen.",
    "Serum oder Pflegeprodukt auftragen.",
    "Bei Morgenroutine: SPF als letzten Schritt auftragen.",
  ],
  ernaehrung: () => [
    "Tagesziel notieren und Mahlzeiten planen.",
    "Proteinquelle in jede Hauptmahlzeit einbauen.",
    "Ausreichend Gemüse und komplexe Kohlenhydrate wählen.",
    "Wasser zum Essen trinken.",
    "Fortschritt am Abend kurz reflektieren.",
  ],
  schlaf: (h) => [
    "30 Minuten vor dem Schlafengehen Bildschirme ausschalten.",
    "Raum abdunkeln und Temperatur auf 18–20 °C senken.",
    "Leichte Abendroutine oder Dehnen ausführen.",
    "Feste Schlafenszeit einhalten.",
    `${h.durationMinutes > 0 ? h.durationMinutes + " Minuten" : "7–8 Stunden"} erholsamen Schlaf anstreben.`,
  ],
  wasser: () => [
    "Morgens direkt nach dem Aufstehen ein großes Glas Wasser trinken.",
    "Wasserflasche griffbereit halten.",
    "Alle 1–2 Stunden ein Glas trinken.",
    "Urin sollte hellgelb sein — dunkel bedeutet: mehr trinken.",
    "Tagesziel bis zum Abend erreichen.",
  ],
  lifestyle: () => [
    "Erinnerung oder Timer stellen.",
    "Ablauf bewusst starten — ohne Ablenkung.",
    "Gewohnheit konsequent ausführen.",
    "Kurz notieren, dass du es erledigt hast.",
    "Serie am nächsten Tag fortsetzen.",
  ],
  gesichtsmassage: () => [
    "Hände und Gesicht reinigen.",
    "Wenig Pflegeöl oder Creme auftragen.",
    "Von der Mitte nach außen streichen.",
    "Leichten Druck entlang der Kieferlinie ausüben.",
    "Mit kühlem Wasser oder Feuchtigkeitspflege abschließen.",
  ],
  gesicht: () => [
    "Bequem hinsetzen und Kiefer entspannen.",
    "Übung langsam und ohne Zwang ausführen.",
    "Auf Spannung achten — nicht pressen.",
    "Ruhig durch die Nase atmen.",
    "Bei Beschwerden sofort abbrechen.",
  ],
  haarpflege: () => [
    "Haare und Kopfhaut reinigen falls nötig.",
    "Pflegeprodukt sparsam auftragen.",
    "Mit Fingerspitzen 2–3 Minuten massieren.",
    "Haarlinie sauber halten.",
    "Styling oder Lufttrocknen abschließen.",
  ],
  fortschritt: () => [
    "Ruhigen Moment für die Reflexion nehmen.",
    "Fortschritt ehrlich bewerten — ohne Selbstkritik.",
    "Fotos oder Notizen aktualisieren.",
    "Eine Sache notieren, die heute gut lief.",
    "Nächstes Ziel für morgen festlegen.",
  ],
};

const SPECIFIC_STEPS: Record<string, string[]> = {
  "chin-tucks": [
    "Aufrecht sitzen oder stehen, Blick geradeaus.",
    "Kinn gerade nach hinten ziehen — als würdest du ein Doppelkinn machen.",
    "5 Sekunden halten, Nacken lang bleiben.",
    "Langsam entspannen und 10–15 Wiederholungen ausführen.",
    "Morgens und abends wiederholen.",
  ],
  "wall-slides": [
    "Mit dem Rücken flach an die Wand lehnen.",
    "Arme im 90°-Winkel, Handgelenke und Ellbogen an der Wand.",
    "Arme langsam nach oben führen, Kontakt zur Wand halten.",
    "Kontrolliert wieder nach unten führen.",
    "10–12 saubere Wiederholungen absolvieren.",
  ],
};

function baseId(id: string): string {
  return id.replace(/-w\d+$/, "");
}

function assignTimeOfDay(h: HabitEntry, slot: number): TimeOfDay {
  if (h.category === "schlaf") return "nacht";
  if (h.category === "wasser" && slot % 2 === 0) return "morgen";
  if (h.category === "lifestyle" && /sonnen|morgen/i.test(h.title)) return "morgen";
  if (h.category === "hautpflege") return slot % 2 === 0 ? "morgen" : "abend";
  if (["gym", "cardio", "haltung", "mobilitaet"].includes(h.category)) return "nachmittag";
  if (["gesichtsmassage", "gesicht", "haarpflege"].includes(h.category)) return "abend";
  if (h.category === "ernaehrung") return "nachmittag";
  if (h.category === "fortschritt") return "abend";
  return "morgen";
}

function frequencyFor(h: HabitEntry): string {
  const map: Partial<Record<TaskCategory, string>> = {
    haltung: "2× täglich",
    mobilitaet: "1× täglich",
    gym: "3–4× pro Woche",
    cardio: "Täglich",
    hautpflege: "Morgens und abends",
    schlaf: "Jede Nacht",
    wasser: "Über den Tag verteilt",
    ernaehrung: "Täglich",
    lifestyle: "Täglich",
    gesichtsmassage: "1× abends",
    gesicht: "Optional — 1× täglich",
    haarpflege: "1× täglich",
    fortschritt: "1× täglich",
  };
  return map[h.category] ?? "Täglich";
}

function benefitsFor(h: HabitEntry): string[] {
  const primary = h.tags.slice(0, 3).map((t) => `Unterstützt ${TAG_LABELS[t]}`);
  const categoryBenefits: Partial<Record<TaskCategory, string[]>> = {
    haltung: ["Verbessert Haltung", "Unterstützt eine aufrechtere Kopfposition", "Kann Nackenverspannungen reduzieren"],
    hautpflege: ["Verbessert Hautbild", "Schützt vor UV-Schäden", "Unterstützt Hautbarriere"],
    gym: ["Stärkt Muskulatur", "Verbessert Körperzusammensetzung", "Steigert Energie und Selbstvertrauen"],
    schlaf: ["Fördert Regeneration", "Verbessert Haut und Augenpartie", "Unterstützt Hormonbalance"],
  };
  const extra = categoryBenefits[h.category] ?? [];
  return [...new Set([...extra, ...primary])].slice(0, 4);
}

function impactFor(h: HabitEntry): string {
  const tag = h.tags[0];
  const label = tag ? TAG_LABELS[tag] : "allgemeines Wohlbefinden";
  if (h.evidenceLevel === "optional") {
    return `Geringe bis moderate Wirkung auf ${label} — primär Entspannung und Gewohnheitsbewusstsein.`;
  }
  return `Mittlere Wirkung auf ${label} bei konsequenter Umsetzung über 2–4 Wochen.`;
}

export function enrichHabit(habit: HabitEntry, slot = 0): HabitRichDetails {
  const bid = baseId(habit.id);
  const steps = SPECIFIC_STEPS[bid] ?? CATEGORY_STEPS[habit.category](habit);
  const hints = CATEGORY_HINTS[habit.category] ?? CATEGORY_HINTS.lifestyle;

  return {
    steps,
    benefits: benefitsFor(habit),
    hints: hints.slice(0, 3),
    frequency: frequencyFor(habit),
    targetGoals: habit.tags.map((t) => TAG_LABELS[t]),
    estimatedImpact: impactFor(habit),
    timeOfDay: assignTimeOfDay(habit, slot),
  };
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "Ganztägig";
  if (minutes === 1) return "1 Minute";
  return `${minutes} Minuten`;
}
