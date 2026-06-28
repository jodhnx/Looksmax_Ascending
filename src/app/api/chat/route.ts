import { NextResponse } from "next/server";
import { coachChat } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { messages, userContext, isPremium } = await req.json();

    if (!isPremium) {
      return NextResponse.json(
        { error: "AI Coach requires Premium" },
        { status: 403 }
      );
    }

    if (!messages?.length) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const reply = await coachChat(messages, userContext ?? {});
    return NextResponse.json({ content: reply });
  } catch (error) {
    console.error("Coach error:", error);
    return NextResponse.json({ error: "Coach unavailable" }, { status: 500 });
  }
}
