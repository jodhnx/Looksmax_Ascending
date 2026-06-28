import { NextResponse } from "next/server";
import { compareProgress } from "@/lib/openai";
import type { AnalysisScores } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { oldImageUrls, newImageUrls, previousScores, isPremium } =
      await req.json();

    if (!isPremium) {
      return NextResponse.json(
        { error: "Weekly comparisons require Premium" },
        { status: 403 }
      );
    }

    if (!oldImageUrls?.length || !newImageUrls?.length) {
      return NextResponse.json({ error: "Photos required" }, { status: 400 });
    }

    const comparison = await compareProgress(
      oldImageUrls,
      newImageUrls,
      previousScores as AnalysisScores
    );

    return NextResponse.json(comparison);
  } catch (error) {
    console.error("Progress check error:", error);
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 });
  }
}
