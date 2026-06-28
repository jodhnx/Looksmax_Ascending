import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHALLENGE_DEFINITIONS } from "@/lib/challenges";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let challenges = await prisma.challenge.findMany();
  if (challenges.length === 0) {
    for (const def of CHALLENGE_DEFINITIONS) {
      await prisma.challenge.create({ data: def });
    }
    challenges = await prisma.challenge.findMany();
  }

  const userChallenges = await prisma.userChallenge.findMany({
    where: { userId: session.user.id },
    include: { challenge: true },
  });

  return NextResponse.json({ challenges, userChallenges });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { challengeId } = await req.json();

  const existing = await prisma.userChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId: session.user.id,
        challengeId,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Already joined" }, { status: 400 });
  }

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + challenge.duration);

  const userChallenge = await prisma.userChallenge.create({
    data: {
      userId: session.user.id,
      challengeId,
      endDate,
      dailyLog: {},
    },
    include: { challenge: true },
  });

  return NextResponse.json(userChallenge);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userChallengeId, progress, completed } = await req.json();

  const updated = await prisma.userChallenge.update({
    where: { id: userChallengeId, userId: session.user.id },
    data: { progress, completed },
    include: { challenge: true },
  });

  return NextResponse.json(updated);
}
