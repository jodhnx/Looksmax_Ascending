import type { AnalysisResult } from "./types";
import { getWeakestCategory } from "./scoring";
import { getFocusAreaDE } from "@/lib/i18n/de";
import type { ProgressCheck } from "@/lib/storage/types";

export interface CoachContext {
  latestAnalysis?: AnalysisResult;
  previousAnalysis?: AnalysisResult;
  streak?: number;
  completedTasksTotal?: number;
  todayTasksCompleted?: number;
  todayTasksTotal?: number;
  goals?: string[];
  progressChecks?: ProgressCheck[];
  currentPlanDay?: number;
}

function scoreDelta(ctx: CoachContext): number | null {
  const cur = ctx.latestAnalysis?.ascendScore;
  const prev = ctx.previousAnalysis?.ascendScore;
  if (cur == null || prev == null) return null;
  return cur - prev;
}

function weakest(ctx: CoachContext): string {
  if (!ctx.latestAnalysis) return "tägliche Konsistenz";
  const key = getWeakestCategory(ctx.latestAnalysis.scores);
  return getFocusAreaDE(key);
}

function topTip(ctx: CoachContext): string {
  return ctx.latestAnalysis?.topImprovements?.[0] ?? weakest(ctx);
}

export function coachReply(message: string, ctx: CoachContext): string {
  const lower = message.toLowerCase();
  const score = ctx.latestAnalysis?.ascendScore;
  const low = ctx.latestAnalysis?.confidenceLow;
  const high = ctx.latestAnalysis?.confidenceHigh;
  const delta = scoreDelta(ctx);
  const focus = weakest(ctx);
  const strengths = ctx.latestAnalysis?.strengths ?? [];
  const weaknesses = ctx.latestAnalysis?.weaknesses ?? [];
  const streak = ctx.streak ?? 0;
  const tasksDone = ctx.todayTasksCompleted ?? 0;
  const tasksTotal = ctx.todayTasksTotal ?? 0;
  const weeks = ctx.progressChecks?.length ?? 0;
  const day = ctx.currentPlanDay ?? 1;

  // Kiefer / Jawline
  if (/kiefer|jawline|kinn|masseter/.test(lower)) {
    const jawScore = ctx.latestAnalysis?.scores.jawDefinition;
    return `Dein Kiefer-Bereich liegt aktuell bei ${jawScore != null ? `${Math.round(jawScore)}/100` : "—"} (Schätzwert). Bei ASCEND ${score ?? "—"} empfehle ich dir: Chin Tucks 3× täglich, Nacken-Isometrien, weniger Salz am Abend und ${topTip(ctx)}. Sichtbare Veränderungen brauchen meist 4–8 Wochen konsequente Arbeit — dein Wochenscan in ${weeks > 0 ? "der nächsten Woche" : "7 Tagen"} zeigt den Trend.`;
  }

  // Training heute
  if (/heute train|was soll ich heute|workout heute|training heute/.test(lower)) {
    return `Tag ${day} deines Programms — Fokus: ${focus}. Heute: 10 Min. Haltungstraining, dann dein geplantes Oberkörper-/Ganzkörpertraining (30 Min.). Du hast ${tasksDone}/${tasksTotal} Aufgaben erledigt. ${tasksDone < tasksTotal / 2 ? "Starte mit den Chin Tucks — das dauert nur 8 Minuten." : "Stark! Schließe mit Dehnen ab."}`;
  }

  // Score gesunken
  if (/score.*(gesunken|runter|gefallen|sinkt)|warum.*niedriger/.test(lower)) {
    if (delta != null && delta < 0) {
      return `Dein ASCEND Score ist um ${Math.abs(Math.round(delta))} Punkte gesunken (${ctx.previousAnalysis?.ascendScore} → ${score}). Das kann an Fotoqualität, Beleuchtung, Schlaf oder Konsistenz liegen — nicht zwingend an echtem Rückschritt. Prüfe: ${weaknesses[0] ?? "Schlaf & Hydration"}. Deine Serie: ${streak} Tage. Bleib dran — ein schlechter Scan-Tag bedeutet nicht, dass deine Arbeit umsonst war.`;
    }
    return score
      ? `Aktuell liegt dein ASCEND Score bei ${score} (${low}–${high}). Ein Rückgang entsteht oft durch schlechtere Fotos, wenig Schlaf oder weniger Training. Vergleiche immer unter gleichen Bedingungen (Licht, Winkel).`
      : "Mach zuerst einen Baseline-Scan, damit ich Trends erkennen kann.";
  }

  // Welche Schwäche zuerst
  if (/schwäche|zuerst verbess|priorit|wichtigste/.test(lower)) {
    return `Basierend auf deiner Analyse: Priorität 1 ist **${weaknesses[0] ?? focus}**. Danach ${weaknesses[1] ?? "Hydration & Schlaf"}. Konkret: ${topTip(ctx)}. Deine Stärke ${strengths[0] ?? "ist deine Bereitschaft zur Veränderung"} — nutze sie als Motivation.`;
  }

  // Größte Verbesserung
  if (/größte|grösste|beste verbesser|meiste bring|höchstes potenzial/.test(lower)) {
    const pot = ctx.latestAnalysis?.improvementPotential;
    return `Dein geschätztes Potenzial liegt bei ${pot ?? "—"}/100. Die größten Hebel für dich: ${(ctx.latestAnalysis?.topImprovements ?? []).slice(0, 3).join(" · ") || topTip(ctx)}. ASCEND Score ${score} — das ist eine Orientierung, kein Urteil.`;
  }

  // Haut
  if (/haut|skin|akne|spf|pflege|dark circle|augenring/.test(lower)) {
    const skin = ctx.latestAnalysis?.scores.skin;
    return `Haut-Score: ${skin != null ? Math.round(skin) : "—"}/100. Routine: Reinigung AM/PM, SPF jeden Morgen, Kissenbezug 2×/Woche wechseln, 2,5L+ Wasser. ${weaknesses.find((w) => /haut/i.test(w)) ? `Scan-Hinweis: ${weaknesses.find((w) => /haut/i.test(w))}.` : ""} Schlaf verbessert oft die Augenpartie schneller als jedes Serum.`;
  }

  // Frisur
  if (/frisur|haar|hair|haarschnitt|styling/.test(lower)) {
    const hair = ctx.latestAnalysis?.scores.hair;
    return `Haar/Präsentation: ${hair != null ? Math.round(hair) : "—"}/100. Empfehlung: saubere Haarlinie, passender Schnitt zur Gesichtsform, Kopfhautpflege 2 Min. täglich. Bei deinem Gesichtsprofil wirken seitlich mehr Volumen oben oft harmonischer — das ist Styling-Tip, keine Regel.`;
  }

  // Haltung
  if (/haltung|posture|nacken|forward head|vorne halt/.test(lower)) {
    const posture = ctx.latestAnalysis?.scores.posture;
    return `Haltungs-Score: ${posture != null ? Math.round(posture) : "—"}/100. Täglich: Chin Tucks, Wall Angels, Brustdehnung. Stündliche Erinnerung: Schultern zurück, Ohren über Schultern. In 2 Wochen täglicher Arbeit siehst du das oft im Profil-Scan.`;
  }

  // Wie lange bis sichtbar
  if (/wie lange|wann sehe|sichtbar|dauer|zeit bis/.test(lower)) {
    return `Realistisch: erste subtile Trends nach 2–3 Wochen (Haut, Haltung), deutlichere Veränderungen nach 6–12 Wochen. Du bist in Woche ${weeks + 1} deiner Reise, Tag ${day}/30, Serie ${streak}. Wöchentliche Scans zeigen den objektivsten Fortschritt — bleib bei gleicher Foto-Setup.`;
  }

  // Score allgemein
  if (/ascend|score|bewertung|punkt/.test(lower)) {
    return score
      ? `Dein ASCEND Score: **${score}** (Schätzbereich ${low}–${high}). Stärken: ${strengths.slice(0, 2).join(", ") || "—"}. Fokus: ${focus}. ${delta != null ? `Trend zum letzten Scan: ${delta >= 0 ? "+" : ""}${Math.round(delta)} Punkte.` : ""} Das ist Orientierung zur Selbstverbesserung — kein objektives Urteil.`
      : "Starte mit Frontal- und Profilfoto für deinen Baseline-Score.";
  }

  // Plan / Routine
  if (/plan|programm|routine|tag \d|woche/.test(lower)) {
    return `Du bist an Tag ${day} deines 30-Tage-Programms. Heutiger Fokus: ${focus}. Top-Empfehlungen: ${(ctx.goals ?? ctx.latestAnalysis?.topImprovements ?? []).slice(0, 2).join(" · ") || topTip(ctx)}. ${tasksDone}/${tasksTotal} Aufgaben heute erledigt — ${tasksDone >= tasksTotal ? "perfekt!" : "mach die nächste Aufgabe jetzt."}`;
  }

  // Schlaf / Wasser / Ernährung
  if (/schlaf|müde|wasser|hydrat|ernähr|protein/.test(lower)) {
    return `Grundlagen für deinen Scan (${score ?? "—"}): 7–8h Schlaf, 2,5–3L Wasser, ausreichend Protein. Das verbessert oft Haut und Gesichtsödeme schneller als isolierte Übungen. Serie: ${streak} Tage — schütze sie.`;
  }

  // Default — immer personalisiert
  return `ASCEND ${score ?? "—"} · Fokus: ${focus}. Stärke: ${strengths[0] ?? "deine Konstanz"}. Nächster Schritt: ${topTip(ctx)}. Du hast ${ctx.completedTasksTotal ?? 0} Aufgaben insgesamt erledigt, Serie ${streak} Tage. Frag mich konkret zu Kiefer, Haut, Haltung, Training oder deinem Score-Trend.`;
}
