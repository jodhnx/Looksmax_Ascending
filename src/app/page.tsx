import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera, Brain, TrendingUp, Shield } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    if (!session.user.onboardingComplete) redirect("/onboarding");
    redirect("/dashboard");
  }

  const features = [
    {
      icon: Camera,
      title: "AI Photo Analysis",
      desc: "Upload 3-8 photos. Vision AI scores 25+ facial and body metrics.",
    },
    {
      icon: Brain,
      title: "30-Day Ascension Plan",
      desc: "Personalized daily routines for skincare, fitness, posture, and habits.",
    },
    {
      icon: TrendingUp,
      title: "Weekly Progress",
      desc: "Compare before/after photos with AI-powered improvement tracking.",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      desc: "Your photos and data are encrypted and never shared.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-indigo-950/30" />

      <div className="relative mx-auto max-w-lg px-6 pb-12 pt-16">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/30">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            ASCEND <span className="gradient-text">AI</span>
          </h1>
          <p className="mt-3 text-lg text-white/60">
            Your premium AI-powered ascension companion. Analyze, plan, and
            transform.
          </p>
        </div>

        <div className="mb-10 space-y-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20">
                <f.icon className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-white/60">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/signup">Start Your Ascension</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>

        <p className="mt-8 text-center text-xs text-white/40">
          Free analysis included · Premium from $14.99/mo
        </p>
      </div>
    </div>
  );
}
