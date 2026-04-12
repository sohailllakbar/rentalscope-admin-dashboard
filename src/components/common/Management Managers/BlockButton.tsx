"use client";

interface BlockButtonProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  isBlocked?: boolean; // ⭐ NEW
}

export default function BlockButton({
  text = "Block",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  type = "button",
  isBlocked = false,
}: BlockButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center " +
    "font-semibold text-white transition-all duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed " +
    "shadow-sm hover:shadow-md active:shadow-sm active:translate-y-[1px]";

  const sizeStyles = {
    sm: "px-5 py-2.5 text-sm rounded-lg",
    md: "px-8 py-3.5 text-base rounded-xl",
    lg: "px-10 py-4 text-lg rounded-xl font-semibold",
  }[size];

  // ⭐ Dynamic background
  const bgStyles = isBlocked
    ? "bg-[#828282B2] hover:bg-[#6e6e6e]"
    : "bg-[#EB141B] hover:bg-[#CD0108] active:bg-[#B30000]";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${bgStyles} ${className}`}
    >
      {text}
    </button>
  );
}