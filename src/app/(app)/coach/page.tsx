"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorage } from "@/hooks/use-storage";
import { generateId } from "@/lib/storage";
import { coachReply } from "@/lib/analysis/coach";

export default function CoachPage() {
  const { data, update } = useStorage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = data.messages;
  const latest = data.analyses[data.analyses.length - 1];

  const send = () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");

    const userMsg = {
      id: generateId(),
      role: "user" as const,
      content,
      createdAt: new Date().toISOString(),
    };

    const reply = coachReply(content, {
      latestAnalysis: latest,
      streak: data.profile?.currentStreak ?? 0,
      completedTasksTotal: Object.values(data.dailyTasks).reduce((sum, d) => sum + d.completed, 0),
      goals: latest?.topImprovements,
    });

    update((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        userMsg,
        {
          id: generateId(),
          role: "assistant" as const,
          content: reply,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <>
      <div className="flex h-[calc(100vh-5rem)] flex-col px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">ASCEND Coach</h1>
            <p className="text-xs text-white/50">Local guidance from your scan data</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {messages.length === 0 && (
            <GlassCard className="text-center">
              <p className="text-sm leading-relaxed text-white/55">
                Ask about jaw, skin, posture, sleep, workouts, or your 30-day plan.
                {latest ? ` ASCEND Score: ${latest.ascendScore ?? latest.looksScore}.` : " Complete a scan first."}
              </p>
            </GlassCard>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white"
                    : "border border-white/10 bg-white/5 text-white/90"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Ask your coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="rounded-2xl border-white/10 bg-white/5"
          />
          <Button size="icon" onClick={send} className="shrink-0 rounded-2xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
