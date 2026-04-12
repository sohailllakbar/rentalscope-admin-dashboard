// components/auth/LoginForm.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import Button from "@/components/ui/auth/Button";
import FormHeading from "@/components/ui/auth/FormHeading";
import InputField from "@/components/ui/auth/InputField";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
type LoginResponse = {
  success: boolean;
  message?: string;
  token?: string; // ← new: token comes here
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
      router.replace(redirectTo);
    }
  }, [router, searchParams]);

  const onSubmit = (data: LoginFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    startTransition(async () => {
      try {
        const response = await fetch(
          "https://tenanttrust.appistansoft.com/api/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        const result: LoginResponse = await response.json();

        if (!response.ok || !result.success || !result.token) {
          throw new Error(
            result.message ||
              `Login failed (${response.status}). Please check your credentials.`,
          );
        }

        // 1. Store token
        localStorage.setItem("auth_token", result.token);
        const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
        window.location.href = redirectTo;

        // No need for router.replace or refresh here anymore
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.";

        setApiError(message);
      }
    });
  };

  return (
    <div className="flex w-full items-center justify-center bg-[#FFFFFF] pt-20 md:w-[55%]">
      <div className="w-full max-w-130 space-y-8 px-6 md:px-8 lg:px-0">
        <FormHeading
          title="Welcome Back!"
          subtitle="Please sign in to access the admin panel."
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
          {/* Email */}
          <InputField
            type="email"
            placeholder="Email"
            icon="/icons/auth/email-icon.svg"
            register={register("email")}
            error={errors.email?.message}
            disabled={isPending}
          />

          {/* Password */}
          <InputField
            type="password"
            placeholder="Password"
            icon="/icons/auth/pass-icon.svg"
            register={register("password")}
            error={errors.password?.message}
            disabled={isPending}
          />

          <Button type="submit" loading={isPending}>
            Sign In
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/forgot-password"
              className="text-[18px] text-[#FF031B] italic underline decoration-1 underline-offset-6 transition-colors hover:text-red-700"
            >
              Forgot Your Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
