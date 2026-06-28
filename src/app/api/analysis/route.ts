import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzePhotos, generateAscensionPlan } from "@/lib/openai";
import { DEFAULT_DAILY_TASKS } from "@/lib/challenges";
import { startOfDay } from "@/lib/utils";
import { PREMIUM_FEATURES } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const isPremium = session.user.isPremium ?? false;

  const analysisCount = await prisma.analysis.count({ where: { userId } });
  if (!isPremium && analysisCount >= PREMIUM_FEATURES.free.analyses) {
    return NextResponse.json(
      { error: "Free tier limited to 1 analysis. Upgrade to Premium." },
      { status: 403 }
    );
  }

  try {
    const { photoIds } = await req.json();
    if (!photoIds?.length || photoIds.length < 3) {
      return NextResponse.json(
        { error: "At least 3 photos required" },
        { status: 400 }
      );
    }

    const photos = await prisma.photo.findMany({
      where: { id: { in: photoIds }, userId },
    });

    if (photos.length < 3) {
      return NextResponse.json({ error: "Invalid photo IDs" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });

    const result = await analyzePhotos(
      photos.map((p) => p.url),
      profile ?? undefined
    );

    const analysis = await prisma.analysis.create({
      data: {
        userId,
        looksScore: result.looksScore,
        confidenceScore: result.confidenceScore,
        improvementPotential: result.improvementPotential,
        scores: result.scores as object,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        summary: result.summary,
        rawResponse: result as object,
      },
    });

    await prisma.photo.updateMany({
      where: { id: { in: photoIds } },
      data: { analysisId: analysis.id },
    });

    const planDays = isPremium
      ? PREMIUM_FEATURES.premium.planDays
      : PREMIUM_FEATURES.free.planDays;

    const plan = await generateAscensionPlan(
      result,
      (profile ?? {}) as Record<string, unknown>,
      planDays
    );

    for (const day of plan) {
      await prisma.ascensionPlan.upsert({
        where: {
          userId_dayNumber: { userId, dayNumber: day.dayNumber },
        },
        create: {
          userId,
          analysisId: analysis.id,
          dayNumber: day.dayNumber,
          title: day.title,
          tasks: day as object,
          isActive: true,
        },
        update: {
          analysisId: analysis.id,
          title: day.title,
          tasks: day as object,
          isActive: true,
        },
      });
    }

    const today = startOfDay();
    const tasks = DEFAULT_DAILY_TASKS.map((t) => ({
      ...t,
      completed: false,
    }));

    await prisma.dailyTask.upsert({
      where: {
        userId_date: { userId, date: today },
      },
      create: {
        userId,
        date: today,
        tasks,
        total: tasks.length,
        completed: 0,
      },
      update: {},
    });

    await prisma.statistic.upsert({
      where: {
        userId_date: { userId, date: today },
      },
      create: {
        userId,
        date: today,
        faceScore: result.looksScore,
        skinScore: result.scores.skinQuality,
        jawScore: result.scores.jawline,
        bodyfat: result.scores.bodyfatEstimate,
      },
      update: {
        faceScore: result.looksScore,
        skinScore: result.scores.skinQuality,
        jawScore: result.scores.jawline,
      },
    });

    return NextResponse.json({ analysisId: analysis.id, result });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Check OpenAI API key." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json(analyses);
}
