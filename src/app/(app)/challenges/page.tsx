"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Check } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingScreen } from "@/components/app/loading-screen";
import { toast } from "sonner";

interface Challenge {
  id: string;
  type: string;
  title: string;
  description: string;
  duration: number;
  tasks: string[];
}

interface UserChallenge {
  id: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  challenge: Challenge;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((data) => {
        setChallenges(data.challenges ?? []);
        setUserChallenges(data.userChallenges ?? []);
        setLoading(false);
      });
  }, []);

  const join = async (challengeId: string) => {
    const res = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId }),
    });

    if (!res.ok) {
      toast.error("Could not join challenge");
      return;
    }

    const uc = await res.json();
    setUserChallenges((prev) => [...prev, uc]);
    toast.success("Challenge joined!");
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <p className="text-white/60">Push your limits with structured programs</p>

        <div className="mt-6 space-y-4">
          {challenges.map((c, i) => {
            const joined = userChallenges.find((uc) => uc.challengeId === c.id);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20">
                      <Trophy className="h-6 w-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{c.title}</h3>
                      <p className="mt-1 text-sm text-white/60">{c.description}</p>
                      <p className="mt-2 text-xs text-violet-400">{c.duration} days</p>

                      {joined ? (
                        <div className="mt-3">
                          <Progress value={joined.progress} className="mb-2" />
                          <p className="text-xs text-white/60">
                            {joined.completed ? (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <Check className="h-3 w-3" /> Completed
                              </span>
                            ) : (
                              `${joined.progress}% complete`
                            )}
                          </p>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="mt-3"
                          onClick={() => join(c.id)}
                        >
                          Join Challenge
                        </Button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <Link href="/dashboard" className="mt-6 block text-center text-sm text-violet-400">
          ← Back to Dashboard
        </Link>
      </div>
      <BottomNav />
    </>
  );
}
