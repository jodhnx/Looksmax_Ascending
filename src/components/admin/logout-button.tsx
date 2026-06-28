"use client";

import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
