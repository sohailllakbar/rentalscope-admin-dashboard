// components/common/ActionButton.tsx
"use client";

import { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode; // text or icon inside button
  variant?: "view" | "edit" | "delete" | "add" | "custom"; // style type
  onClick?: () => void; // what happens when clicked
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string; // extra classes if you want to add more
  size?: "sm" | "md" | "lg";
}

export default function ActionButton({
  children,
  variant = "custom",
  onClick,
  disabled = false,
  type = "button",
  className = "",
  size = "md",
}: ActionButtonProps) {
  // Base styles (same for every button)
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold tracking-[0.2px] text-white shadow-[0_6px_14px_rgba(13,128,225,0.35)] transition-all duration-200 ease-out hover:shadow-[0_8px_18px_rgba(13,128,225,0.45)] hover:brightness-[1.05] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  // Size variations
  let sizeClass = "";
  if (size === "sm") sizeClass = "px-4 py-2 text-[16px]";
  else if (size === "lg") sizeClass = "px-8 py-4 text-[22px]";
  else sizeClass = "px-6 py-3 text-[18px]"; // md default

  // Gradient + focus ring per variant
  let variantClass = "";
  if (variant === "view") {
    variantClass =
      "bg-gradient-to-b from-[#018EDE] to-[#0469A2] focus:ring-[#018EDE]/50";
  } else if (variant === "edit") {
    variantClass =
      "bg-gradient-to-b from-[#34A853] to-[#118630] focus:ring-[#34A853]/50";
  } else if (variant === "delete") {
    variantClass =
      "bg-gradient-to-b from-[#EB141B] to-[#CD0108] focus:ring-[#EB141B]/50";
  } else if (variant === "add") {
    variantClass =
      "bg-gradient-to-b from-[#0E86E8] to-[#085799] focus:ring-[#0E86E8]/50";
  }
  // "custom" → no gradient, user controls via className

  // Combine everything
  const fullClass = `${base} ${sizeClass} ${variantClass} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={fullClass}
    >
      {children}
    </button>
  );
}
