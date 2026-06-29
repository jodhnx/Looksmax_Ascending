export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050508] pb-24">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-indigo-950/20" />
      <div className="relative mx-auto max-w-lg">{children}</div>
    </div>
  );
}
