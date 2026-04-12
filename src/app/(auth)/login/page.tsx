import LoginForm from "@/components/auth/LoginForm";
import AuthLogoSection from "@/components/ui/auth/AuthLogoSection";
import { Suspense } from "react";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* LEFT - logo side*/}
      <AuthLogoSection />
      {/* RIGHT - Form side */}
      <Suspense fallback={<DashboardLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
