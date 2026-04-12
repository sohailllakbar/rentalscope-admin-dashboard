// components/ui/buttons/DeleteButton.tsx
"use client";

import { ButtonHTMLAttributes } from "react";
import { nunito } from "@/lib/fonts";

interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function DeleteButton({
  children = "Delete",
  className = "",
  disabled = false,
  ...props
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`relative px-5 py-2 text-[17px] font-medium tracking-[0.3px] text-white transition-all duration-200 ease-out sm:text-[18px] ${nunito.className} overflow-hidden rounded-[5px] bg-linear-to-b from-[#EB141B] to-[#CD0108] hover:from-[#FF1A22] hover:to-[#E50910] hover:shadow-[0_8px_20px_rgba(235,20,27,0.45)] hover:brightness-[1.12] focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 focus:outline-none active:scale-[0.98] active:shadow-[0_4px_12px_rgba(235,20,27,0.35)] active:brightness-[0.92] disabled:cursor-not-allowed disabled:bg-[#FCA5A5] disabled:opacity-55 disabled:brightness-100 disabled:hover:bg-[#FCA5A5] disabled:hover:shadow-none ${className} `}
      {...props}
    >
      {children}
    </button>
  );
}
