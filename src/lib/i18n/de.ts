export const de = {
  appName: "ASCEND AI",
  tagline: "Dein persönlicher Looksmax-Begleiter",

  nav: {
    home: "Start",
    tasks: "Aufgaben",
    progress: "Fortschritt",
    coach: "Coach",
    stats: "Statistik",
    plan: "Plan",
    exercises: "Übungen",
    settings: "Einstellungen",
  },

  landing: {
    badge: "100% lokal · Kein Konto",
    subtitle:
      "MediaPipe-Gesichtsanalyse, ASCEND Score und dein personalisierter 30-Tage-Plan — komplett auf deinem Gerät.",
    features: [
      "468-Punkt-Gesichtsmesh-Analyse",
      "ASCEND Score 0–100",
      "Personalisierter 30-Tage-Plan",
      "Wöchentliche Fortschrittskontrolle",
    ],
    startAnalysis: "Analyse starten",
    openDashboard: "Dashboard öffnen",
    disclaimer:
      "Der ASCEND Score ist eine Schätzung zur Selbstverbesserung — keine objektive Bewertung.",
  },

  upload: {
    title: "Fotos hochladen",
    subtitle:
      "Frontalansicht und Seitenprofil. MediaPipe prüft lokal: ein Gesicht, Beleuchtung, Schärfe und Winkel.",
    back: "Zurück",
    startScan: "ASCEND-Analyse starten",
    scanning: "ASCEND-Scan läuft…",
    validated: "Fotos validiert",
    awaiting: "Warte auf Qualitätsfotos",
    ready: "Bereit zum Scannen",
    bothRequired: "Beide Fotos müssen die Validierung bestehen",
    scanComplete: "ASCEND-Scan abgeschlossen!",
    scanFailed: "Analyse fehlgeschlagen",
  },

  photo: {
    frontFace: "Frontalansicht",
    sideProfile: "Seitenprofil",
    frontHint: "Direkt in die Kamera schauen, neutraler Ausdruck",
    sideHint: "90° drehen — Kieferlinie und Nacken sichtbar",
    validating: "Gesichtsmesh wird erkannt…",
    quality: "Qualität",
  },

  dashboard: {
    greeting: { morning: "Guten Morgen", afternoon: "Guten Tag", evening: "Guten Abend" },
    title: "ASCEND Dashboard",
    welcome: "Willkommen",
    weeklyScanDue: "Wöchentlicher Scan fällig",
    weeklyScanHint: "Frontal- & Profilfoto hochladen",
    ascendScore: "ASCEND Score",
    noScan: "Noch kein Scan",
    streak: "Tages-Serie",
    planDay: "30-Tage-Plan",
    improvementTrend: "Verbesserungstrend",
    weeklyGoal: "Wochenziel",
    nextScan: "Nächster Scan in",
    days: "Tagen",
    day: "Tag",
    todayTasks: "Heutige Aufgaben",
    morningFocus: "Heutiger Fokus",
    xpToday: "XP verfügbar",
    completionReward: "Belohnung bei 100%",
    viewAll: "Alle anzeigen",
    currentFocus: "Aktueller Fokus",
    planLink: "Plan ansehen",
    exercisesLink: "Übungsbibliothek",
    startAnalysis: "Analyse starten",
    complete: "erledigt",
  },

  analysis: {
    title: "Deine Auswertung",
    scoreLabel: "ASCEND Score",
    potential: "Verbesserungspotenzial",
    disclaimer:
      "Schätzbereich {low}–{high}. Nur zur Fortschrittsverfolgung — keine objektive Attraktivitätsmessung.",
    strengths: "Stärken",
    improvements: "Verbesserungschancen",
    topPotential: "Größtes Potenzial",
    categories: "Kategorieübersicht",
    goDashboard: "Zum Dashboard",
    viewPlan: "30-Tage-Programm",
    notFound: "Analyse nicht gefunden",
    history: "Score-Verlauf",
    improvementPct: "Verbesserung",
    categoryLabels: {
      facialHarmony: "Gesichtsharmonie",
      symmetry: "Symmetrie",
      jawDefinition: "Kieferdefinition",
      chin: "Kinn",
      skin: "Haut",
      posture: "Haltung",
      eyeArea: "Augenpartie",
      hair: "Haar",
      presentation: "Gesamteindruck",
    } as Record<string, string>,
  },

  tasks: {
    title: "Tägliche Aufgaben",
    subtitle: "Dein personalisierter ASCEND-Tag",
    progress: "Fortschritt",
    allComplete: "Alle Aufgaben erledigt — stark!",
    xpTotal: "XP heute",
    swipeHint: "Antippen zum Abhaken",
    difficulty: { leicht: "Einfach", mittel: "Mittel", schwer: "Schwer" },
    minutes: "Min.",
    optional: "Optional",
    evidenceBased: "Evidenzbasiert",
  },

  ui: {
    showMore: "Mehr anzeigen",
    showLess: "Weniger anzeigen",
    description: "Beschreibung",
    steps: "Schritt-für-Schritt",
    goals: "Ziel",
    target: "Zielbereich",
    benefits: "Geschätzte Wirkung",
    duration: "Dauer",
    difficulty: { leicht: "Einfach", mittel: "Mittel", schwer: "Schwer" },
    frequency: "Häufigkeit",
    hints: "Hinweise",
    progress: "Fortschritt",
    doneToday: "Heute erledigt",
    markComplete: "Als erledigt markieren",
    streakDays: "Tage Serie",
    whyRecommended: "Warum empfohlen?",
    optionalDisclaimer:
      "Optionale Technik mit begrenzter wissenschaftlicher Evidenz für strukturelle Gesichtsveränderungen.",
    tasks: "Aufgaben",
    estimatedDuration: "Geschätzte Dauer",
    tasksCompleted: "Erledigt",
  },

  plan: {
    title: "30-Tage-Programm",
    subtitle: "Einzigartig für deine Analyse generiert",
    week: "Woche",
    noPlan: "Schließe deine erste Analyse ab, um dein personalisiertes Programm freizuschalten.",
    startAnalysis: "Analyse starten",
    today: "Heute",
    phases: {
      fundament: "Fundament",
      konsistenz: "Konsistenz",
      optimierung: "Optimierung",
      peak: "Peak-Routine",
    },
    todayFocus: "Heutiger Fokus",
    dailyQuote: "Tageszitat",
    xpAvailable: "XP verfügbar",
    completionReward: "Abschluss-Belohnung",
    weeklyGoal: "Wochenziel",
    completion: "Erledigt",
    xpEarned: "XP verdient",
    streak: "Serie",
    faceSection: "Gesicht & Aussehen",
    evidenceBased: "Evidenzbasiert",
    optional: "Optional — begrenzte Evidenz",
    faceDisclaimer:
      "Optionale Techniken ersetzen keine medizinische Beratung und verändern die Knochenstruktur nicht dauerhaft.",
    whyRecommended: "Warum empfohlen?",
    noTasks: "Keine Aufgaben für diesen Tag",
    dayComplete: "Tag abgeschlossen!",
    sections: {
      morning: "Morgenroutine",
      skincare: "Hautpflege",
      exercises: "Übungen",
      gym: "Training",
      neckPosture: "Nacken & Haltung",
      stretching: "Dehnen",
      facialMassage: "Gesichtsmassage",
      nutrition: "Ernährung",
      habits: "Gewohnheiten",
      stress: "Stressmanagement",
      haircare: "Haar & Pflege",
      confidence: "Mindset",
      evening: "Abendroutine",
      lifestyle: "Lifestyle",
      recovery: "Erholung",
    },
    weekdays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
  },

  progress: {
    title: "Fortschritt",
    subtitle: "Wöchentliche Scan-Vergleiche & Timeline",
    scanReady: "Wöchentlicher Scan bereit",
    scanHint: "Neue Frontal- & Profilfotos hochladen",
    startScan: "Wochenscan starten",
    hideUpload: "Upload ausblenden",
    nextScan: "Nächster Scan in",
    compare: "Fortschritt vergleichen",
    comparing: "Scans werden verglichen…",
    timeline: "Timeline",
    empty: "Noch keine Kontrollen. Nach 7 Tagen erneut scannen.",
    week: "Woche",
    front: "Frontalansicht",
    side: "Seitenprofil",
    habits: "Gewohnheiten",
    bothPhotos: "Beide Fotos müssen validiert sein",
    needBaseline: "Zuerst Baseline-Scan abschließen",
    missingPhotos: "Vergleichsfotos fehlen",
    complete: "Wochenscan abgeschlossen!",
    failed: "Vergleich fehlgeschlagen",
  },

  coach: {
    title: "ASCEND Coach",
    subtitle: "Persönliche Beratung basierend auf deinem Scan",
    placeholder: "Frag deinen Coach…",
    empty:
      "Frag mich zu Kiefer, Haut, Haltung, Schlaf, Training oder deinem 30-Tage-Plan. Ich antworte basierend auf deiner aktuellen Analyse.",
    scorePrefix: "Dein ASCEND Score:",
    completeScan: "Schließe zuerst einen Scan ab.",
  },

  exercises: {
    title: "Übungsbibliothek",
    subtitle: "256 Übungen mit Anleitung & personalisierten Empfehlungen",
    all: "Alle",
    reminder: "Häufigkeit",
    steps: "Schritt-für-Schritt",
    target: "Zielbereich",
    benefits: "Vorteile",
    impact: "Geschätzte Wirkung",
    hints: "Hinweise",
    frequency: "Häufigkeit",
    duration: "Dauer",
    difficulty: "Schwierigkeit",
    category: "Kategorie",
    xp: "XP-Belohnung",
  },

  settings: {
    title: "Einstellungen",
    subtitle: "Alle Daten werden lokal auf deinem Gerät gespeichert",
    appearance: "Darstellung",
    dark: "Dunkel",
    light: "Hell",
    notifications: "Benachrichtigungen",
    data: "Daten",
    lastBackup: "Letztes Auto-Backup",
    export: "Backup exportieren",
    clear: "Alle lokalen Daten löschen",
    saved: "Einstellungen gespeichert",
    exported: "Daten exportiert",
    clearConfirm: "Alle lokalen Daten löschen? Das kann nicht rückgängig gemacht werden.",
    reminders: {
      morning: "Morgenerinnerung",
      workout: "Trainingserinnerung",
      skincare: "Hautpflege-Erinnerung",
      water: "Wasser-Erinnerung",
      sleep: "Schlaf-Erinnerung",
      weeklyPhoto: "Wöchentliche Foto-Erinnerung",
    },
  },

  stats: {
    title: "Statistik",
    subtitle: "Deine Verbesserung im Zeitverlauf",
    faceScore: "Gesichtsscore",
    skinScore: "Hautscore",
    jawScore: "Kieferscore",
    weight: "Gewicht",
    bodyfat: "Körperfett",
    avgSleep: "Ø Schlaf",
    avgWater: "Ø Wasser",
    workouts: "Workouts",
    trend: "Gesichtsscore-Verlauf",
    lastEntries: "Letzte {n} Einträge",
  },

  errors: {
    blurry: "Bild zu unscharf — ruhig halten und neu fokussieren",
    dark: "Bild zu dunkel — bessere Beleuchtung nutzen",
    bright: "Bild überbelichtet — Helligkeit reduzieren",
    small: "Gesicht zu klein im Bild — näher herangehen",
    noFace: "Kein Gesicht erkannt — Gesicht zentrieren",
    multiFace: "Mehrere Gesichter erkannt — nur eine Person",
    wrongAngleFront: "Gesicht muss frontal sein — direkt in die Kamera schauen",
    wrongAngleSide: "Weiter zur Seite drehen (ca. 90° Profil)",
    headTilt: "Kopf gerade halten — nicht kippen",
    eyesHidden: "Augen müssen sichtbar und offen sein",
    faceHidden: "Gesamtes Gesicht muss im Bild sichtbar sein",
    qualityLow: "Bildqualität zu niedrig — bei gutem Licht neu aufnehmen",
    validationFailed: "Validierung fehlgeschlagen",
    network: "Netzwerkfehler",
  },

  quotes: [
    "Jede Routine bringt dich näher an dein Ziel.",
    "Konsistenz schlägt Perfektion. Zeig dich heute.",
    "Dein zukünftiges Ich beobachtet dich genau jetzt.",
    "Kleine tägliche Verbesserungen führen zu großen Ergebnissen.",
    "Disziplin heißt: dem wählen, was du am meisten willst.",
    "Glow-up beginnt im Kopf, bevor er im Spiegel sichtbar wird.",
    "Du konkurrierst nur mit dem Ich von gestern.",
    "Investiere in dich — das zahlt sich am besten aus.",
  ],

  focusAreas: {
    jawDefinition: "Kieferdefinition & Nackenarbeit",
    posture: "Haltung & Forward-Head-Korrektur",
    skin: "Hautpflege & Hydration",
    symmetry: "Symmetrie & Gesichtsgewohnheiten",
    hair: "Haarpflege & Styling",
    eyeArea: "Augenpartie & Schlaf",
    chin: "Kinnprojektion",
    facialHarmony: "Gesichtsharmonie",
    presentation: "Fotoqualität & Präsentation",
  } as Record<string, string>,
};

export const WEEKDAYS_DE = de.plan.weekdays;

export function getGreetingDE(): string {
  const h = new Date().getHours();
  if (h < 12) return de.dashboard.greeting.morning;
  if (h < 17) return de.dashboard.greeting.afternoon;
  return de.dashboard.greeting.evening;
}

export function getDailyQuoteDE(day?: number): string {
  const idx = day ?? new Date().getDate();
  return de.quotes[idx % de.quotes.length];
}

export function getCategoryLabelDE(key: string): string {
  return de.analysis.categoryLabels[key] ?? key;
}

export function getFocusAreaDE(key: string): string {
  return de.focusAreas[key] ?? "Tägliche Konsistenz";
}
