// app/(auth)/change-password/page.tsx
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import PageHeader from "@/components/common/PageHeader";

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Change Password" />
        <ChangePasswordForm />
    </div>
  );
}
