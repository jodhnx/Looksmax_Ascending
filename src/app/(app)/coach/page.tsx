"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Crown, Bot } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingScreen } from "@/components/app/loading-screen";
import { toast } from "sonner";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => {
        if (r.status === 403) {
          setPremiumRequired(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setMessages(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setSending(false);

    if (!res.ok) {
      toast.error("Failed to send message");
      return;
    }

    const reply = await res.json();
    setMessages((prev) => [...prev, reply]);
  };

  if (loading) return <LoadingScreen />;

  if (premiumRequired) {
    return (
      <>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <Crown className="mb-4 h-16 w-16 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">AI Coach</h1>
          <p className="mt-2 text-white/60">
            Get personalized advice based on your profile, progress, and goals
          </p>
          <Button asChild className="mt-6">
            <Link href="/premium">Unlock AI Coach</Link>
          </Button>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <div className="flex h-[calc(100vh-5rem)] flex-col px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">AI Coach</h1>
            <p className="text-xs text-white/60">Personalized ascension advice</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {messages.length === 0 && (
            <GlassCard className="text-center">
              <p className="text-sm text-white/60">
                Ask me anything about skincare, workouts, posture, nutrition, or your ascension plan.
              </p>
            </GlassCard>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
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
            disabled={sending}
          />
          <Button size="icon" onClick={send} disabled={sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
