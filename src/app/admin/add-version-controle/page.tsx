// app/(auth)/change-password/page.tsx
import AddVersionControlPage from "@/components/version-controle/add-version-controleform";
import PageHeader from "@/components/common/PageHeader";

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title=" Add Version Controle" />
      <AddVersionControlPage />
    </div>
  );
}
