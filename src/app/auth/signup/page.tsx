"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerSchema } from "@/lib/validations/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setFieldErrors({});

    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      toast.error(
        errors.form ?? errors.name ?? errors.email ?? errors.password ?? "Please fix the errors below"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        toast.error(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created. Please sign in.");
        router.push("/auth/signin");
        setLoading(false);
        return;
      }

      router.push("/onboarding");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    if (googleLoading || loading) return;
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/onboarding" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] px-6">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-indigo-950/30" />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Begin your ascent</h1>
          <p className="mt-2 text-white/60">Create your ASCEND AI account</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              aria-invalid={!!fieldErrors.name}
              disabled={loading}
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-400">{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              aria-invalid={!!fieldErrors.email}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-400">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Min 8 characters, letters & numbers"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              aria-invalid={!!fieldErrors.password}
              disabled={loading}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-400">{fieldErrors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading || googleLoading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </motion.form>

        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={handleGoogle}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            "Continue with Google"
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-violet-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
