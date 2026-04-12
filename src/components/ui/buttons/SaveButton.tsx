// components/ui/buttons/SaveButton.tsx
"use client";

import { ButtonHTMLAttributes } from "react";
import { nunito } from "@/lib/fonts"; // assuming this is your font import

interface SaveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "primary" | "outline"; // optional – can extend later
}

export default function SaveButton({
  children = "Save",
  disabled = false,
  ...props
}: SaveButtonProps) {
  return (
    <button
      type="button" // change to "submit" when used in forms
      disabled={disabled}
      className={`rounded-[5px] ${nunito.className} bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-2 text-[18px] font-medium tracking-[0.3px] text-[#FFFFFF] transition-all duration-200 ease-out hover:shadow-[0_4px_12px_rgba(13,128,225,0.3)] hover:brightness-110 focus:ring-2 focus:ring-[#0D80E1]/40 focus:ring-offset-2 focus:outline-none active:scale-[0.98]`}
      {...props}
    >
      {children}
    </button>
  );
}
