"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
  { href: "/coach", icon: MessageCircle, label: "Coach" },
  { href: "/stats", icon: BarChart3, label: "Stats" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-2xl safe-area-pb">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-colors",
                active ? "text-violet-400" : "text-white/50 hover:text-white/80"
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-2xl bg-violet-500/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className="relative h-5 w-5" />
              <span className="relative text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/premium"
          className={cn(
            "flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-colors",
            pathname === "/premium"
              ? "text-amber-400"
              : "text-white/50 hover:text-amber-400/80"
          )}
        >
          <Crown className="h-5 w-5" />
          <span className="text-[10px] font-medium">Pro</span>
        </Link>
      </div>
    </nav>
  );
}
