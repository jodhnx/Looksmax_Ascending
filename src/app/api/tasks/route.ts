import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = startOfDay();
  const dailyTask = await prisma.dailyTask.findUnique({
    where: {
      userId_date: { userId: session.user.id, date: today },
    },
  });

  const plans = await prisma.ascensionPlan.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { dayNumber: "asc" },
  });

  const currentDay = plans.length > 0 ? Math.min(
    Math.floor(
      (Date.now() - (plans[0].createdAt?.getTime() ?? Date.now())) /
        (1000 * 60 * 60 * 24)
    ) + 1,
    plans.length
  ) : 1;

  const todayPlan = plans.find((p) => p.dayNumber === currentDay);

  return NextResponse.json({ dailyTask, todayPlan, currentDay, plans });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId, completed } = await req.json();
  const today = startOfDay();

  const dailyTask = await prisma.dailyTask.findUnique({
    where: {
      userId_date: { userId: session.user.id, date: today },
    },
  });

  if (!dailyTask) {
    return NextResponse.json({ error: "No tasks for today" }, { status: 404 });
  }

  const tasks = (dailyTask.tasks as Array<{ id: string; completed: boolean }>).map(
    (t) => (t.id === taskId ? { ...t, completed } : t)
  );

  const completedCount = tasks.filter((t) => t.completed).length;

  const updated = await prisma.dailyTask.update({
    where: { id: dailyTask.id },
    data: { tasks, completed: completedCount },
  });

  if (completedCount === tasks.length) {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (profile) {
      const lastActive = profile.lastActiveDate;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive =
        lastActive &&
        startOfDay(lastActive).getTime() === yesterday.getTime();
      await prisma.profile.update({
        where: { userId: session.user.id },
        data: {
          currentStreak: isConsecutive ? profile.currentStreak + 1 : 1,
          longestStreak: Math.max(
            profile.longestStreak,
            isConsecutive ? profile.currentStreak + 1 : 1
          ),
          lastActiveDate: today,
        },
      });
    }
  }

  return NextResponse.json(updated);
}
