"use client";

import { motion } from "framer-motion";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CHALLENGE_DEFINITIONS } from "@/lib/challenges";
import { useAppStorage } from "@/hooks/use-app-storage";
import { generateId } from "@/lib/storage";
import { toast } from "sonner";

export default function ChallengesPage() {
  const { data, update } = useAppStorage();

  const joinChallenge = (def: (typeof CHALLENGE_DEFINITIONS)[number]) => {
    const existing = data.userChallenges.find((c) => c.challengeType === def.type);
    if (existing) {
      toast.error("Already joined");
      return;
    }
    const end = new Date();
    end.setDate(end.getDate() + def.duration);
    update((prev) => ({
      ...prev,
      userChallenges: [
        ...prev.userChallenges,
        {
          id: generateId(),
          challengeType: def.type,
          title: def.title,
          startDate: new Date().toISOString(),
          endDate: end.toISOString(),
          progress: 0,
          completed: false,
        },
      ],
    }));
    toast.success(`Joined ${def.title}!`);
  };

  const updateProgress = (id: string, progress: number) => {
    update((prev) => ({
      ...prev,
      userChallenges: prev.userChallenges.map((c) =>
        c.id === id
          ? { ...c, progress, completed: progress >= 100 }
          : c
      ),
    }));
  };

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <p className="text-white/60">Push your limits with structured challenges</p>

        <div className="mt-6 space-y-4">
          {CHALLENGE_DEFINITIONS.map((def, i) => {
            const joined = data.userChallenges.find((c) => c.challengeType === def.type);
            return (
              <motion.div
                key={def.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{def.title}</h3>
                      <p className="mt-1 text-sm text-white/60">{def.description}</p>
                      <p className="mt-2 text-xs text-violet-400">{def.duration} days</p>
                    </div>
                    {!joined && (
                      <Button size="sm" onClick={() => joinChallenge(def)}>
                        Join
                      </Button>
                    )}
                  </div>
                  {joined && (
                    <div className="mt-4">
                      <Progress value={joined.progress} className="mb-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">
                          {joined.completed ? "Completed!" : `${joined.progress}% complete`}
                        </span>
                        {!joined.completed && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateProgress(joined.id, Math.min(joined.progress + 10, 100))}
                          >
                            +10%
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
