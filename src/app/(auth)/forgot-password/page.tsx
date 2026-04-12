// app/(auth)/forgot-password/page.tsx (SERVER)
import { Suspense } from "react";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthLogoSection from "@/components/ui/auth/AuthLogoSection";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT - logo side*/}
      <AuthLogoSection />

      {/* RIGHT - Form side */}
      <Suspense fallback={<DashboardLoading />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
