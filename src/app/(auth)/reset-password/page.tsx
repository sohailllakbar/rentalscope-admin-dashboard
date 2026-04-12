import AuthLogoSection from "@/components/ui/auth/AuthLogoSection";
import { Suspense } from "react";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT - logo side*/}
      <AuthLogoSection />

      {/* RIGHT - Form side */}

      <Suspense fallback={<DashboardLoading />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
