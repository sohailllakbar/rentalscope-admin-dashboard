// components/ui/buttons/AddAmenityButton.tsx
"use client";

import { ButtonHTMLAttributes } from "react";
import { nunito } from "@/lib/fonts";

interface AddAmenityButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function AddAmenityButton({
  children = "Add Amenity",
  className = "",
  disabled,
  ...props
}: AddAmenityButtonProps) {
  return (
    <button
      type="button" // change to "submit" when used inside <form>
      disabled={disabled}
      className={`relative min-w-40 px-9 py-4 text-[19px] font-bold tracking-[0.4px] text-[#FFFFFF] md:text-[22px] lg:text-[24px] ${nunito.className}  overflow-hidden rounded-lg bg-linear-to-b from-[#0D80E1] to-[#085799] transition-all duration-250 ease-out hover:cursor-pointer  disabled:cursor-not-allowed disabled:opacity-55 disabled:before:hidden disabled:hover:scale-100 disabled:hover:brightness-100 ${className} `}
      {...props}
    >
      {children}
    </button>
  );
}
