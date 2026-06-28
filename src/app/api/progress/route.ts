import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compareProgress } from "@/lib/openai";
import type { AnalysisScores } from "@/lib/openai";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isPremium = session.user.isPremium;
  if (!isPremium) {
    return NextResponse.json(
      { error: "Weekly comparisons require Premium" },
      { status: 403 }
    );
  }

  const checks = await prisma.progressCheck.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { photos: true },
  });

  return NextResponse.json(checks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.isPremium) {
    return NextResponse.json(
      { error: "Weekly comparisons require Premium" },
      { status: 403 }
    );
  }

  try {
    const { photoIds } = await req.json();
    const userId = session.user.id;

    const previousAnalysis = await prisma.analysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { photos: true },
    });

    if (!previousAnalysis) {
      return NextResponse.json({ error: "No previous analysis" }, { status: 400 });
    }

    const newPhotos = await prisma.photo.findMany({
      where: { id: { in: photoIds }, userId },
    });

    const comparison = await compareProgress(
      previousAnalysis.photos.map((p) => p.url),
      newPhotos.map((p) => p.url),
      previousAnalysis.scores as unknown as AnalysisScores
    );

    const weekNumber =
      (await prisma.progressCheck.count({ where: { userId } })) + 1;

    const progressCheck = await prisma.progressCheck.create({
      data: {
        userId,
        weekNumber,
        improvementPercent: comparison.improvementPercent,
        skinImprovement: comparison.skinImprovement,
        jawImprovement: comparison.jawImprovement,
        bodyfatChange: comparison.bodyfatChange,
        confidenceTrend: comparison.confidenceTrend,
        notes: comparison.notes,
        faceComparison: {
          before: previousAnalysis.photos[0]?.url,
          after: newPhotos[0]?.url,
        },
      },
    });

    await prisma.photo.updateMany({
      where: { id: { in: photoIds } },
      data: { progressCheckId: progressCheck.id },
    });

    return NextResponse.json(progressCheck);
  } catch (error) {
    console.error("Progress check error:", error);
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 });
  }
}
