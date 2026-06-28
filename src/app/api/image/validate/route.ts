import { NextResponse } from "next/server";
import { validateAndCompressImage } from "@/lib/image";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await validateAndCompressImage(buffer);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.errors[0], validationErrors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: result.compressedBase64,
      qualityScore: result.qualityScore,
      width: result.width,
      height: result.height,
      validationErrors: [],
    });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
