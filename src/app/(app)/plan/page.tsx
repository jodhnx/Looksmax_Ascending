"use client";

import Link from "next/link";
import { Sun, Moon, Dumbbell, Apple, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import type { PlanDay } from "@/lib/openai";
import { useAppStorage } from "@/hooks/use-app-storage";
import { getCurrentPlanDay } from "@/lib/storage/helpers";

export default function PlanPage() {
  const { data } = useAppStorage();
  const currentDay = getCurrentPlanDay(data);
  const plan = data.ascensionPlans[currentDay - 1] as PlanDay | undefined;

  if (!plan || !data.ascensionPlans.length) {
    return (
      <>
        <div className="px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-white">Ascension Plan</h1>
          <p className="mt-4 text-white/60">Complete your first analysis to get a personalized plan.</p>
          <Link href="/upload" className="mt-6 inline-block text-violet-400">Upload photos →</Link>
        </div>
        <BottomNav />
      </>
    );
  }

  const sections = [
    { icon: Sun, title: "Morning Routine", items: plan.morningRoutine },
    { icon: Sparkles, title: "Skincare", items: plan.skincare },
    { icon: Dumbbell, title: "Exercises", items: plan.exercises },
    { icon: Dumbbell, title: "Gym", items: plan.gym },
    { icon: Apple, title: "Nutrition", items: [
      `Protein: ${plan.nutrition.protein}g`,
      `Water: ${plan.nutrition.water}L`,
      `Calories: ${plan.nutrition.calories}`,
    ]},
    { icon: Sparkles, title: "Habits", items: plan.habits },
    { icon: Moon, title: "Evening Routine", items: plan.eveningRoutine },
  ];

  return (
    <>
      <div className="px-6 py-8">
        <p className="text-sm text-violet-400">Day {currentDay}</p>
        <h1 className="text-2xl font-bold text-white">{plan.title}</h1>

        <div className="mt-6 space-y-4">
          {sections.map((section, i) => (
            section.items?.length > 0 && (
              <GlassCard key={section.title} delay={i * 0.05}>
                <div className="mb-3 flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-violet-400" />
                  <h3 className="font-semibold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
