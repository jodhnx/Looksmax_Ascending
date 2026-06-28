import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateAndCompressImage } from "@/lib/image";
import { PhotoType } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as PhotoType;

    if (!file || !type) {
      return NextResponse.json({ error: "File and type required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await validateAndCompressImage(buffer);

    if (!result.valid) {
      return NextResponse.json(
        {
          error: result.errors[0],
          validationErrors: result.errors,
        },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        userId: session.user.id,
        type,
        url: result.compressedBase64,
        qualityScore: result.qualityScore,
        width: result.width,
        height: result.height,
      },
    });

    return NextResponse.json({
      id: photo.id,
      url: photo.url,
      qualityScore: photo.qualityScore,
      validationErrors: [],
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const photos = await prisma.photo.findMany({
    where: { userId: session.user.id, analysisId: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(photos);
}
