"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { StorageProvider } from "@/lib/storage/context";
import { useStorage } from "@/hooks/use-storage";

function ThemeSync({ children }: { children: React.ReactNode }) {
  const { data } = useStorage();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", data.theme === "dark");
  }, [data.theme]);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StorageProvider>
      <ThemeSync>
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
      </ThemeSync>
    </StorageProvider>
  );
}
