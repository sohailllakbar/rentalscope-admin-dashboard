"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  type?: "text" | "email" | "password";
  placeholder: string;
  icon: string;
  error?: string;
  disabled?: boolean;
  register: UseFormRegisterReturn;
};

export default function InputField({
  type = "text",
  placeholder,
  icon,
  error,
  disabled,
  register,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <div className="relative">
        {/* Left Icon */}
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <Image src={icon} alt="input icon" width={20} height={20} />
        </div>

        <input
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          className={`w-full rounded-[5px] border border-[#7a7b7c] bg-white py-3.25 pr-12 pl-12 text-[22px] text-[#1f2937] placeholder-[#74767a] transition-all duration-150 focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none ${
            error ? "border-red-500" : ""
          } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-4 flex items-center text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={1.8} />
            ) : (
              <Eye size={20} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
