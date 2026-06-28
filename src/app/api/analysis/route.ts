import { NextResponse } from "next/server";
import {
  analyzePhotos,
  generateAscensionPlan,
  type AnalysisResult,
} from "@/lib/openai";
import { DEFAULT_DAILY_TASKS } from "@/lib/challenges";

const FREE_ANALYSIS_LIMIT = 1;
const FREE_PLAN_DAYS = 7;

export async function POST(req: Request) {
  try {
    const { imageUrls, profile, isPremium, analysisCount } = await req.json();

    if (!imageUrls?.length || imageUrls.length < 3) {
      return NextResponse.json(
        { error: "At least 3 photos required" },
        { status: 400 }
      );
    }

    if (!isPremium && analysisCount >= FREE_ANALYSIS_LIMIT) {
      return NextResponse.json(
        { error: "Free tier limited to 1 analysis. Upgrade to Premium." },
        { status: 403 }
      );
    }

    const result: AnalysisResult = await analyzePhotos(imageUrls, profile);

    const planDays = isPremium ? 30 : FREE_PLAN_DAYS;
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
