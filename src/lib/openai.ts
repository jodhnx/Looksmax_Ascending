import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface AnalysisScores {
  faceSymmetry: number;
  jawline: number;
  cheekbones: number;
  chin: number;
  forwardHeadPosture: number;
  neck: number;
  eyeArea: number;
  canthalTilt: number;
  eyebrows: number;
  hairline: number;
  hairDensity: number;
  forehead: number;
  lips: number;
  nose: number;
  facialThirds: number;
  goldenRatio: number;
  skinQuality: number;
  acne: number;
  darkCircles: number;
  facialFat: number;
  bodyfatEstimate: number;
  shoulderWidth: number;
  waistRatio: number;
  posture: number;
  muscularity: number;
  overallAttractiveness: number;
  confidenceEstimate: number;
}

export interface AnalysisResult {
  looksScore: number;
  confidenceScore: number;
  improvementPotential: number;
  scores: AnalysisScores;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

const ANALYSIS_SCHEMA = `{
  "looksScore": number 1-10,
  "confidenceScore": number 1-10,
  "improvementPotential": number 1-10,
  "scores": {
    "faceSymmetry": number 1-10,
    "jawline": number 1-10,
    "cheekbones": number 1-10,
    "chin": number 1-10,
    "forwardHeadPosture": number 1-10,
    "neck": number 1-10,
    "eyeArea": number 1-10,
    "canthalTilt": number 1-10,
    "eyebrows": number 1-10,
    "hairline": number 1-10,
    "hairDensity": number 1-10,
    "forehead": number 1-10,
    "lips": number 1-10,
    "nose": number 1-10,
    "facialThirds": number 1-10,
    "goldenRatio": number 1-10,
    "skinQuality": number 1-10,
    "acne": number 1-10,
    "darkCircles": number 1-10,
    "facialFat": number 1-10,
    "bodyfatEstimate": number 1-10,
    "shoulderWidth": number 1-10,
    "waistRatio": number 1-10,
    "posture": number 1-10,
    "muscularity": number 1-10,
    "overallAttractiveness": number 1-10,
    "confidenceEstimate": number 1-10
  },
  "strengths": ["string array of 3-5 strengths"],
  "weaknesses": ["string array of 3-5 areas to improve"],
  "summary": "2-3 sentence personalized summary"
}`;

export async function analyzePhotos(
  imageUrls: string[],
  profileContext?: Record<string, unknown>
): Promise<AnalysisResult> {
  const profileText = profileContext
    ? `\nUser profile context: ${JSON.stringify(profileContext)}`
    : "";

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are ASCEND AI, an expert facial aesthetics and posture analyst for a premium self-improvement app. Analyze the provided photos objectively and constructively. Score each metric 1-10 where 10 is excellent. Be honest but encouraging. Return ONLY valid JSON matching this schema: ${ANALYSIS_SCHEMA}`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze these photos for a comprehensive Looksmax report. Evaluate face symmetry, jawline, cheekbones, chin, forward head posture, neck, eye area, canthal tilt, eyebrows, hairline, hair density, forehead, lips, nose, facial thirds, golden ratio, skin quality, acne, dark circles, facial fat, bodyfat estimate, shoulder width, waist ratio, posture, muscularity, overall attractiveness, and confidence estimate.${profileText}`,
          },
          ...imageUrls.slice(0, 8).map((url) => ({
            type: "image_url" as const,
            image_url: { url, detail: "high" as const },
          })),
        ],
      },
    ],
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No analysis response from AI");

  return JSON.parse(content) as AnalysisResult;
}

export async function compareProgress(
  oldImageUrls: string[],
  newImageUrls: string[],
  previousScores: AnalysisScores
): Promise<{
  improvementPercent: number;
  skinImprovement: number;
  jawImprovement: number;
  bodyfatChange: number;
  confidenceTrend: number;
  notes: string;
}> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Compare before/after photos for weekly progress. Return JSON: { "improvementPercent": number, "skinImprovement": number -10 to 10, "jawImprovement": number -10 to 10, "bodyfatChange": number negative means loss, "confidenceTrend": number -10 to 10, "notes": "brief progress summary" }. Previous scores: ${JSON.stringify(previousScores)}`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "BEFORE photos:" },
          ...oldImageUrls.map((url) => ({
            type: "image_url" as const,
            image_url: { url, detail: "low" as const },
          })),
          { type: "text", text: "AFTER photos (1 week later):" },
          ...newImageUrls.map((url) => ({
            type: "image_url" as const,
            image_url: { url, detail: "low" as const },
          })),
        ],
      },
    ],
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No comparison response");

  return JSON.parse(content);
}

export interface PlanDay {
  dayNumber: number;
  title: string;
  morningRoutine: string[];
  skincare: string[];
  exercises: string[];
  gym: string[];
  nutrition: { protein: number; water: number; calories: number };
  habits: string[];
  eveningRoutine: string[];
}

export async function generateAscensionPlan(
  analysis: AnalysisResult,
  profile: Record<string, unknown>,
  days: number = 30
): Promise<PlanDay[]> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Generate a personalized ${days}-day ascension plan. Return JSON: { "days": [{ "dayNumber": number, "title": string, "morningRoutine": string[], "skincare": string[], "exercises": string[], "gym": string[], "nutrition": { "protein": number grams, "water": number liters, "calories": number }, "habits": string[], "eveningRoutine": string[] }] }. Tailor to weaknesses. Progressive difficulty.`,
      },
      {
        role: "user",
        content: `Analysis: ${JSON.stringify(analysis)}. Profile: ${JSON.stringify(profile)}. Generate ${days} days.`,
      },
    ],
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No plan response");

  const parsed = JSON.parse(content) as { days: PlanDay[] };
  return parsed.days;
}

export async function coachChat(
  messages: { role: "user" | "assistant"; content: string }[],
  userContext: Record<string, unknown>
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are ASCEND AI Coach — a supportive, knowledgeable personal improvement advisor. You know the user's profile, progress, and goals. Give concise, actionable, personalized advice. Context: ${JSON.stringify(userContext)}`,
      },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    max_tokens: 1000,
  });

  return (
    response.choices[0]?.message?.content ??
    "I'm here to help you ascend. What would you like to work on?"
  );
}
