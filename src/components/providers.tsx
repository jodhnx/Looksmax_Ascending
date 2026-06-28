"use client";

import { Toaster } from "sonner";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegister />
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(26, 26, 46, 0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </>
  );
}
