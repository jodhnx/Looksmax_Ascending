import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    profile,
    latestAnalysis,
    dailyTask,
    todayStat,
    activeChallenge,
    previousAnalysis,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.analysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.dailyTask.findFirst({
      where: { userId, date: today },
    }),
    prisma.statistic.findFirst({
      where: { userId, date: today },
    }),
    prisma.userChallenge.findFirst({
      where: { userId, completed: false },
      include: { challenge: true },
    }),
    prisma.analysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: 1,
    }),
  ]);

  const weeklyImprovement =
    latestAnalysis && previousAnalysis
      ? latestAnalysis.looksScore - previousAnalysis.looksScore
      : 0;

  return NextResponse.json({
    profile,
    latestAnalysis,
    dailyTask,
    todayStat,
    activeChallenge,
    weeklyImprovement,
    isPremium: session.user.isPremium,
  });
}
