import { z } from "zod";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export const registerSchema = z.object({
  name: z
    .string()
    .transform(sanitizeName)
    .pipe(
      z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters")
    ),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform(normalizeEmail),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform(normalizeEmail),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
