import VerificationForm from "@/components/auth/VerificationForm";
import AuthLogoSection from "@/components/ui/auth/AuthLogoSection";
import { Suspense } from "react";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
export default function VerifyPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT - logo side*/}
            <AuthLogoSection />
      {/* RIGHT - Form side */}   
      <Suspense fallback={<DashboardLoading />}>   
        <VerificationForm />
      </Suspense>
    
    </div>
  );
}