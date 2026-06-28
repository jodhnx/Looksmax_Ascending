import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { BCRYPT_ROUNDS } from "@/lib/auth";
import {
  registerSchema,
  formatZodErrors,
  normalizeEmail,
} from "@/lib/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createUserDefaults } from "@/lib/user-setup";

const REGISTER_RATE_LIMIT = 5;
const REGISTER_RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`register:${ip}`, REGISTER_RATE_LIMIT, REGISTER_RATE_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Validation failed",
          fieldErrors: formatZodErrors(parsed.error),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name,
          email,
          password: hashed,
          onboardingComplete: false,
        },
      });

      await createUserDefaults(tx, created.id);

      return created;
    });

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "Validation failed",
          fieldErrors: formatZodErrors(error),
        },
        { status: 400 }
      );
    }

    console.error("[auth/register] Registration failed:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
