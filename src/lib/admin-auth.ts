import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ascend-admin-session";
const ADMIN_MESSAGE = "ascend-admin-authenticated";

function getSecret(): string {
  return (
    process.env.ADMIN_SECRET ??
    process.env.AUTH_SECRET ??
    "ascend-admin-dev-secret"
  );
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminToken(): Promise<string> {
  return hmacHex(getSecret(), ADMIN_MESSAGE);
}

export async function verifyAdminToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const expected = await hmacHex(getSecret(), ADMIN_MESSAGE);
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "admin123";
  return username === expectedUser && password === expectedPass;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
