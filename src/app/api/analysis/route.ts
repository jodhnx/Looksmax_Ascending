import { NextResponse } from "next/server";
import {
  analyzePhotos,
  generateAscensionPlan,
  type AnalysisResult,
} from "@/lib/openai";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { DEFAULT_DAILY_TASKS } from "@/lib/challenges";

export async function POST(req: Request) {
  try {
    const { imageUrls, profile, isPremium, analysisCount } = await req.json();

    if (!imageUrls?.length || imageUrls.length < 3) {
      return NextResponse.json(
        { error: "At least 3 photos required" },
        { status: 400 }
      );
    }

    const config = getRuntimeConfig();
    if (!isPremium && analysisCount >= config.freeAnalysisLimit) {
      return NextResponse.json(
        { error: "Free tier limited to 1 analysis. Upgrade to Premium." },
        { status: 403 }
      );
    }

    const result: AnalysisResult = await analyzePhotos(imageUrls, profile);

    const planDays = isPremium ? 30 : config.freePlanDays;
    const plan = await generateAscensionPlan(
      result,
      profile ?? {},
      planDays
    );

    const tasks = DEFAULT_DAILY_TASKS.map((t) => ({
      ...t,
      completed: false,
    }));

    return NextResponse.json({ result, plan, tasks });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Check OpenAI API key." },
      { status: 500 }
    );
  }
}
