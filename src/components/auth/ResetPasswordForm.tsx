"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/auth/Button";
import FormHeading from "@/components/ui/auth/FormHeading";
import InputField from "@/components/ui/auth/InputField";
const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

type ApiResponse = {
  success?: boolean;
  message?: string;
};


export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otpFromUrl = searchParams.get("otp") || ""; // ← new

  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    if (isSubmitting) return;

    if (!email) {
      setApiError("Email is missing. Please start the reset process again.");
      return;
    }

    if (!otpFromUrl || otpFromUrl.length !== 4 || !/^\d{4}$/.test(otpFromUrl)) {
      setApiError("Invalid or missing verification code. Please verify again.");
      return;
    }

    setApiSuccess(null);
    setApiError(null);

    try {
      const response = await fetch(
        "https://tenanttrust.appistansoft.com/api/admin/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: Number(otpFromUrl), // ← now sending it
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          }),
        },
      );

      let result: ApiResponse;
      try {
        result = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message ||
            `Failed to reset password (status ${response.status})`,
        );
      }

      setApiSuccess(result.message || "Password reset successful!");

      // 🔥 premium redirect timing
      setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 300);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setApiError(message);
    }
  };

  // ✅ missing email state
  if (!email) {
    return (
      <div className="flex w-full items-center justify-center bg-[#FFFFFF] pt-20 lg:w-[55%]">
        <div className="w-full max-w-130 space-y-8 text-center">
          <h1 className="text-[40px] font-bold text-[#0E86E8]">
            Reset Password
          </h1>

          <div className="rounded-md border border-red-200 bg-red-50 px-6 py-8 text-[20px] text-red-700">
            <p className="mb-6">
              Email is missing. Please start the password reset process again.
            </p>

            <Link
              href="/forgot-password"
              className="inline-block rounded-lg bg-[#0E86E8] px-8 py-4 text-white transition-colors hover:bg-[#0D80E1]"
            >
              Go to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center bg-[#FFFFFF] pt-20 md:w-[55%]">
      <div className="w-full max-w-130 space-y-8 px-6 md:px-8 lg:px-0">
        <FormHeading
          title="Reset Password"
          subtitle=" Enter your new password for your email"
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password */}
          <InputField
            type="password"
            placeholder="New Password"
            icon="/icons/auth/pass-icon.svg"
            register={register("newPassword")}
            error={errors.newPassword?.message}
            disabled={isSubmitting}
          />

          {/* Confirm Password */}
          <InputField
            type="password"
            placeholder="Confirm Password"
            icon="/icons/auth/pass-icon.svg"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            disabled={isSubmitting}
          />

          <Button type="submit" loading={isSubmitting}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
