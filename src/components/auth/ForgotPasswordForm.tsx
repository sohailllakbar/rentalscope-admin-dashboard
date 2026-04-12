"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/auth/Button";
import FormHeading from "@/components/ui/auth/FormHeading";
import InputField from "@/components/ui/auth/InputField";
const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    // 🛡️ prevent double submit (professional safety)
    if (isSubmitting) return;

    setApiSuccess(null);
    setApiError(null);

    try {
      const response = await fetch(
        "https://tenanttrust.appistansoft.com/api/admin/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message ||
            `Server error (status ${response.status}) - Please try again`,
        );
      }

      // ✅ quick professional feedback
      setApiSuccess(result.message || "Code sent successfully.");

      // ✅ premium short redirect
      setTimeout(() => {
        router.replace(`/verify?email=${encodeURIComponent(data.email)}`);
        router.refresh();
      }, 200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setApiError(message);
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-[#FFFFFF] pt-20 md:w-[55%]">
      <div className="w-full max-w-130 space-y-8 px-6 md:px-8 lg:px-0">
        <FormHeading
          title="Forgot Password?"
          subtitle="Kindly verify your email address below, and we'll send you a verification code."
        />

        {apiSuccess && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-center text-[18px] text-green-700">
            {apiSuccess}
          </div>
        )}

        {apiError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-[18px] text-red-700">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <InputField
            type="email"
            placeholder="Email"
            icon="/icons/auth/email-icon.svg"
            register={register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          <Button type="submit" loading={isSubmitting}>
            Send Code
          </Button>
        </form>
      </div>
    </div>
  );
}
