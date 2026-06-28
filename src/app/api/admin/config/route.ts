import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getRuntimeConfig, setRuntimeConfig } from "@/lib/runtime-config";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    config: getRuntimeConfig(),
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    environment: process.env.NODE_ENV,
  });
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const config = setRuntimeConfig(body);
  return NextResponse.json({ config });
}
