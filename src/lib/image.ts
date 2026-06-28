import sharp from "sharp";

export interface ImageValidationResult {
  valid: boolean;
  errors: string[];
  qualityScore: number;
  width: number;
  height: number;
  compressedBase64: string;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const MAX_SIZE_MB = 10;

export async function validateAndCompressImage(
  buffer: Buffer
): Promise<ImageValidationResult> {
  const errors: string[] = [];

  if (buffer.length > MAX_SIZE_MB * 1024 * 1024) {
    errors.push(`Image exceeds ${MAX_SIZE_MB}MB limit`);
  }

  let metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    return {
      valid: false,
      errors: ["Invalid image file"],
      qualityScore: 0,
      width: 0,
      height: 0,
      compressedBase64: "",
    };
  }

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width < MIN_WIDTH || height < MIN_HEIGHT) {
    errors.push(`Image too small (min ${MIN_WIDTH}x${MIN_HEIGHT}px)`);
  }

  const stats = await sharp(buffer).stats();
  const avgBrightness =
    stats.channels.reduce((sum, ch) => sum + ch.mean, 0) / stats.channels.length;

  if (avgBrightness < 30) errors.push("Image too dark — use better lighting");
  if (avgBrightness > 240) errors.push("Image overexposed — reduce brightness");

  let qualityScore = 100;
  if (width < 800) qualityScore -= 20;
  if (avgBrightness < 50 || avgBrightness > 220) qualityScore -= 15;
  qualityScore = Math.max(0, Math.min(100, qualityScore));

  const compressed = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();

  const compressedBase64 = `data:image/jpeg;base64,${compressed.toString("base64")}`;

  return {
    valid: errors.length === 0,
    errors,
    qualityScore,
    width,
    height,
    compressedBase64,
  };
}
