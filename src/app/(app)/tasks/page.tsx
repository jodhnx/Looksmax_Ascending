"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { LoadingScreen } from "@/components/app/loading-screen";

interface Task {
  id: string;
  label: string;
  completed: boolean;
  category?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((data) => {
        if (data.dailyTask) {
          setTasks(data.dailyTask.tasks);
          setCompleted(data.dailyTask.completed);
          setTotal(data.dailyTask.total);
        }
        setLoading(false);
      });
  }, []);

  const toggle = async (taskId: string, checked: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: checked } : t))
    );
    setCompleted((c) => c + (checked ? 1 : -1));

    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, completed: checked }),
    });
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">Daily Checklist</h1>
        <p className="mt-1 text-white/60">Complete tasks to maintain your streak</p>

        <GlassCard className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-white/60">Progress</span>
            <span className="font-semibold text-white">{completed}/{total}</span>
          </div>
          <Progress value={total ? (completed / total) * 100 : 0} />
        </GlassCard>

        <div className="mt-4 space-y-2">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="!p-4">
                <label className="flex cursor-pointer items-center gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(c) => toggle(task.id, c === true)}
                  />
                  <span className={task.completed ? "text-white/40 line-through" : "text-white"}>
                    {task.label}
                  </span>
                </label>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
