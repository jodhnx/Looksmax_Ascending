import { Suspense } from "react";
import AdminLoginForm from "./login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
