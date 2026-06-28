import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { coachChat } from "@/lib/openai";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.isPremium) {
    return NextResponse.json(
      { error: "AI Coach requires Premium" },
      { status: 403 }
    );
  }

  try {
    const { content } = await req.json();
    const userId = session.user.id;

    await prisma.message.create({
      data: { userId, role: "user", content },
    });

    const [profile, latestAnalysis, stats, plans] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.analysis.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.statistic.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 7,
      }),
      prisma.ascensionPlan.findMany({
        where: { userId, isActive: true },
        take: 1,
      }),
    ]);

    const history = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const reply = await coachChat(
      history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { profile, latestAnalysis, stats, currentPlan: plans[0] }
    );

    const assistantMsg = await prisma.message.create({
      data: { userId, role: "assistant", content: reply },
    });

    return NextResponse.json(assistantMsg);
  } catch (error) {
    console.error("Coach error:", error);
    return NextResponse.json({ error: "Coach unavailable" }, { status: 500 });
  }
}
