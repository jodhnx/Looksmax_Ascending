import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-indigo-950/20" />
      <div className="relative mx-auto max-w-lg">{children}</div>
    </div>
  );
}
