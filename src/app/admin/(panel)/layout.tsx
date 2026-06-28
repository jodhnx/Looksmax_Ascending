import Link from "next/link";
import { LayoutDashboard, BarChart3, Users, Crown } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/logout-button";

const nav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/statistics", icon: Users, label: "User Statistics" },
  { href: "/admin/premium", icon: Crown, label: "Premium Management" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-amber-950/20 via-transparent to-violet-950/20" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-white/10 p-6 md:block">
          <p className="mb-8 text-lg font-bold text-white">
            ASCEND <span className="text-amber-400">Admin</span>
          </p>
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8">
            <AdminLogoutButton />
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
