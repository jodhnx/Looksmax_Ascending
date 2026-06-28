import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  age: z.number().min(13).max(100),
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(30).max(300),
  gender: z.string(),
  goal: z.string(),
  bodyfatEstimate: z.number().min(3).max(50),
  gymExperience: z.string(),
  sleepHours: z.number().min(3).max(14),
  waterIntakeL: z.number().min(0).max(10),
  skincare: z.string(),
  hairType: z.string(),
  beardGrowth: z.string(),
  jawVisibility: z.string(),
  teethCondition: z.string(),
  eyeArea: z.string(),
  acne: z.string(),
  faceSymmetry: z.string(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await req.json());

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...data },
      update: data,
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingComplete: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}
