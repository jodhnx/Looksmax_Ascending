import type { AnalysisResult } from "./types";
import { getWeakestCategory } from "./scoring";
import { getFocusAreaDE } from "@/lib/i18n/de";
import type { ProgressCheck, Profile } from "@/lib/storage/types";
import type { PlanDay } from "./types";

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
  todayPlan?: PlanDay;
  profile?: Profile | null;
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

function whyPrefix(ctx: CoachContext, topic: string): string {
  const reason =
    ctx.todayPlan?.focusReason ??
    `Dein Frontal- und Profil-Scan legt ${weakest(ctx)} als Priorität nahe.`;
  return `**Warum ${topic}?** ${reason} `;
}

function todayTaskSummary(ctx: CoachContext): string {
  const plan = ctx.todayPlan;
  if (!plan?.tasks?.length) return "";
  const cats = [...new Set(plan.tasks.map((t) => t.category))].slice(0, 4).join(", ");
  return ` Heute (${plan.tasks.length} Aufgaben): Schwerpunkte in ${cats}. ${plan.xpAvailable} XP verfügbar.`;
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
  const planHint = todayTaskSummary(ctx);

  if (/kiefer|jawline|kinn|masseter/.test(lower)) {
    const jawScore = ctx.latestAnalysis?.scores.jawDefinition;
    const fhp = ctx.latestAnalysis?.metrics.forwardHeadPosture;
    return `${whyPrefix(ctx, "Kiefer- & Nackenarbeit")}Dein Kiefer-Bereich liegt bei ${jawScore != null ? `${Math.round(jawScore)}/100` : "—"} (Schätzwert). ${fhp != null && fhp > 0.12 ? "Dein Profil deutet auf Forward-Head-Haltung hin — Chin Tucks und Nackenkräftigung können das Gesamtbild und den Komfort verbessern." : "Körperfett, Hydration und Haltung beeinflussen die sichtbare Kieferlinie stärker als isolierte Übungen."} Evidenzbasiert: Chin Tucks, Nacken-Isometrien, weniger Abend-Salz. Optional (begrenzte Evidenz): Kaumuskel-Entspannung, kein dauerhaftes Knochen-Remodelling.${planHint}`;
  }

  if (/heute train|was soll ich heute|workout heute|training heute/.test(lower)) {
    const gymTasks = ctx.todayPlan?.tasks.filter((t) => t.category === "gym") ?? [];
    const gymList = gymTasks.map((t) => t.title).join(", ") || "dein geplantes Training";
    return `${whyPrefix(ctx, "dieses Training")}Tag ${day} — Phase ${ctx.todayPlan?.phase ?? "Fundament"}. Fokus: ${ctx.todayPlan?.todayFocus ?? focus}. Training heute: ${gymList}. ${tasksDone}/${tasksTotal} Aufgaben erledigt.${tasksDone < tasksTotal / 2 ? " Tipp: Starte mit der kürzesten Haltungsaufgabe — oft unter 8 Minuten." : " Stark — schließe mit Mobilität ab."}`;
  }

  if (/score.*(gesunken|runter|gefallen|sinkt)|warum.*niedriger/.test(lower)) {
    if (delta != null && delta < 0) {
      return `${whyPrefix(ctx, "der Rückgang")}Score ${ctx.previousAnalysis?.ascendScore} → ${score} (${Math.abs(Math.round(delta))} Pkt.). Häufige Ursachen: andere Beleuchtung, Winkel, Schlafmangel — nicht zwingend echter Rückschritt. Scan-Hinweis: ${weaknesses[0] ?? "Schlaf & Hydration prüfen"}. Serie: ${streak} Tage.`;
    }
    return score
      ? `ASCEND ${score} (${low}–${high}). Rückgänge entstehen oft durch Foto-Setup. Vergleiche unter gleichen Bedingungen.`
      : "Starte mit Frontal- und Profilfoto für deinen Baseline-Score.";
  }

  if (/schwäche|zuerst verbess|priorit|wichtigste|warum.*empfehl/.test(lower)) {
    const taskReason = ctx.todayPlan?.tasks[0]?.reason;
    return `${whyPrefix(ctx, "diese Priorität")}Priorität 1: **${weaknesses[0] ?? focus}**. Danach: ${weaknesses[1] ?? "Hydration & Schlaf"}. Konkret: ${topTip(ctx)}. ${taskReason ? `Beispiel aus deinem Plan: ${taskReason}` : ""} Stärke: ${strengths[0] ?? "deine Bereitschaft zur Veränderung"}.`;
  }

  if (/größte|grösste|beste verbesser|meiste bring|höchstes potenzial/.test(lower)) {
    const pot = ctx.latestAnalysis?.improvementPotential;
    return `${whyPrefix(ctx, "dieses Potenzial")}Geschätztes Potenzial: ${pot ?? "—"}/100. Größte Hebel: ${(ctx.latestAnalysis?.topImprovements ?? []).slice(0, 3).join(" · ") || topTip(ctx)}. ASCEND ${score} — Orientierung, kein Urteil.${planHint}`;
  }

  if (/haut|skin|akne|spf|pflege|dark circle|augenring/.test(lower)) {
    const skin = ctx.latestAnalysis?.scores.skin;
    return `${whyPrefix(ctx, "Hautpflege")}Haut-Score: ${skin != null ? Math.round(skin) : "—"}/100. Evidenzbasiert: Reinigung AM/PM, SPF täglich, 2,5L+ Wasser, Kissenbezug wechseln. ${weaknesses.find((w) => /haut/i.test(w)) ? `Scan: ${weaknesses.find((w) => /haut/i.test(w))}.` : ""} Schlaf verbessert die Augenpartie oft schneller als Seren allein.${planHint}`;
  }

  if (/frisur|haar|hair|haarschnitt|styling/.test(lower)) {
    const hair = ctx.latestAnalysis?.scores.hair;
    return `${whyPrefix(ctx, "Haarpflege")}Haar/Präsentation: ${hair != null ? Math.round(hair) : "—"}/100. Empfehlung: saubere Haarlinie, passender Schnitt, Kopfhautpflege 2 Min. täglich. Styling-Tip basierend auf deinem Profil — keine feste Regel.${planHint}`;
  }

  if (/haltung|posture|nacken|forward head|vorne halt/.test(lower)) {
    const posture = ctx.latestAnalysis?.scores.posture;
    const fhp = ctx.latestAnalysis?.metrics.forwardHeadPosture;
    return `${whyPrefix(ctx, "Haltungstraining")}Haltungs-Score: ${posture != null ? Math.round(posture) : "—"}/100. ${fhp != null && fhp > 0.1 ? "Dein hochgeladenes Profil legt Forward-Head-Haltung nahe — zusätzliche Haltungsarbeit kann dein Gesamtbild und deinen Komfort verbessern." : "Präventive Haltungsarbeit unterstützt Nacken und Präsentation."} Täglich: Chin Tucks, Wall Slides, Brustdehnung. Profil-Scan in 2 Wochen zeigt oft den ersten Trend.${planHint}`;
  }

  if (/wie lange|wann sehe|sichtbar|dauer|zeit bis/.test(lower)) {
    return `Realistisch: erste Trends nach 2–3 Wochen (Haut, Haltung), deutlicher nach 6–12 Wochen. Woche ${weeks + 1}, Tag ${day}/30, Serie ${streak}. Wöchentliche Scans unter gleichem Setup sind am aussagekräftigsten.`;
  }

  if (/ascend|score|bewertung|punkt/.test(lower)) {
    return score
      ? `ASCEND **${score}** (${low}–${high}). Stärken: ${strengths.slice(0, 2).join(", ") || "—"}. Fokus: ${focus}. ${delta != null ? `Trend: ${delta >= 0 ? "+" : ""}${Math.round(delta)} Pkt.` : ""} Nur zur Selbstverbesserung — kein objektives Urteil.${planHint}`
      : "Starte mit Frontal- und Profilfoto für deinen Baseline-Score.";
  }

  if (/plan|programm|routine|tag \d|woche|aufgabe/.test(lower)) {
    return `${whyPrefix(ctx, "dein Programm")}Tag ${day}, Phase ${ctx.todayPlan?.phase ?? "Fundament"}. ${ctx.todayPlan?.weeklyGoal ?? focus}. ${tasksDone}/${tasksTotal} Aufgaben heute — ${tasksDone >= tasksTotal ? "perfekt!" : "nächste Aufgabe jetzt starten."}${planHint}`;
  }

  if (/schlaf|müde|wasser|hydrat|ernähr|protein|gesichtsübung|massage/.test(lower)) {
    const optional = /gesichtsübung|massage|kaum/.test(lower);
    if (optional) {
      return `${whyPrefix(ctx, "optionale Gesichtstechniken")}Diese Techniken haben **begrenzte wissenschaftliche Evidenz** für strukturelle Gesichtsveränderungen. Sie können Entspannung und Gewohnheitsbewusstsein fördern — keine dauerhafte Knochenumformung. Evidenzbasierter: Schlaf, Hautpflege, Haltung, gesunde Körperzusammensetzung.${planHint}`;
    }
    return `${whyPrefix(ctx, "diese Grundlagen")}7–8h Schlaf, 2,5–3L Wasser, ausreichend Protein verbessern oft Haut und Gesichtsödeme schneller als isolierte Übungen. Serie: ${streak} Tage.${planHint}`;
  }

  return `${whyPrefix(ctx, "dein nächster Schritt")}ASCEND ${score ?? "—"} · Fokus: ${focus}. Stärke: ${strengths[0] ?? "deine Konstanz"}. Nächster Schritt: ${topTip(ctx)}. ${ctx.completedTasksTotal ?? 0} Aufgaben insgesamt erledigt, Serie ${streak} Tage. Frag mich zu Kiefer, Haut, Haltung, Training oder deinem Plan.${planHint}`;
}
