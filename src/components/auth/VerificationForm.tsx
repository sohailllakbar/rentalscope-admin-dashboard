"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/auth/Button";
import FormHeading from "@/components/ui/auth/FormHeading";
type ApiResponse = {
  success?: boolean;
  message?: string;
};
export default function VerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ───────────────── OTP INPUT HANDLERS ─────────────────

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4 - index);

    if (!pasted) return;

    const newCode = [...code];
    pasted.split("").forEach((char, i) => {
      if (index + i < 4) newCode[index + i] = char;
    });

    setCode(newCode);

    const nextIndex = Math.min(index + pasted.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  // ───────────────── VERIFY OTP ─────────────────

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛡️ prevent double submit
    if (isVerifying) return;

    const fullCode = code.join("").trim();

    if (fullCode.length !== 4) {
      setError("Please enter a 4-digit code");
      return;
    }

    if (!email) {
      setError("Email is missing. Please go back and try again.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsVerifying(true);

    try {
      const response = await fetch(
        "https://tenanttrust.appistansoft.com/api/admin/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: Number(fullCode),
          }),
        },
      );

      let result: ApiResponse;

      try {
        result = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Verification failed. Invalid or expired OTP.",
        );
      }

      // ✅ professional success flow
      setSuccess("Verification successful!");

      setTimeout(() => {
        const fullCode = code.join("");
        router.replace(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${fullCode}`,
        );
        router.refresh();
      }, 200);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  // ───────────────── RESEND OTP ─────────────────

  const handleResend = async () => {
    if (isResending) return;

    if (!email) {
      setError("Email is missing. Please go back.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsResending(true);

    try {
      const response = await fetch(
        "https://tenanttrust.appistansoft.com/api/admin/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }), // ← perfect, matches updated spec
        },
      );

      let result: ApiResponse;
      try {
        result = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(result?.message || "Failed to resend OTP.");
      }

      setSuccess("New OTP sent to your email."); // ← or use result.message if you prefer
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not resend OTP. Try again later.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };
  // ───────────────── UI ─────────────────

  return (
    <div className="flex w-full items-center justify-center bg-[#FFFFFF] pt-20 md:w-[55%]">
      <div className="w-full max-w-130 space-y-8 px-6 md:px-8 lg:px-0">
        <FormHeading
          title=" Verification"
          subtitle=" Please provide the valid verification code, we sent to your mail."
        />

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-[18px] text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-center text-[18px] text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP inputs */}
          <div className="flex justify-center gap-6">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                placeholder="0"
                aria-label={`OTP digit ${index + 1}`}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className={`h-16 w-16 rounded-lg border-2 border-[#7a7b7c] bg-white text-center text-[32px] font-bold text-[#1f2937] transition-all duration-200 focus:border-[#018cfd] focus:ring-[#0E86E8]/30 focus:outline-none ${
                  isVerifying ? "cursor-not-allowed opacity-60" : ""
                }`}
                disabled={isVerifying}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center">
            <p className="text-[20px] font-medium text-[#7a7b7c]">
              Did not receive a code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isVerifying}
              className={`mt-2 text-[20px] font-bold text-[#0E86E8] underline underline-offset-4 transition-colors hover:text-blue-700 ${
                isResending || isVerifying
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
            >
              {isResending ? "Resending..." : "RESEND"}
            </button>
          </div>

          {/* Submit */}
          <Button type="submit" loading={isVerifying}>
            Verify & Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
