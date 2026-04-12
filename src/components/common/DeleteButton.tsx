// components/common/DeleteButton.tsx
"use client";

interface DeleteButtonProps {
  text?: string;                    // Custom button text (default: "Delete Property")
  size?: "sm" | "md" | "lg";        // Size variant: small, medium (default), large
  disabled?: boolean;               // Disable the button
  onClick?: () => void;             // Click handler
  className?: string;               // Optional extra classes (e.g. w-full, mx-auto...)
  type?: "button" | "submit" | "reset"; // Button type
}

export default function DeleteButton({
  text = "Delete Property",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: DeleteButtonProps) {
  // Base styles (shared for all sizes)
  const baseStyles =
    "inline-flex items-center justify-center font-medium text-white " +
    "transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm active:translate-y-[1px] " +
    "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  // Size-specific styles
  const sizeStyles = {
    sm: "px-5 py-2.5 text-sm rounded-[8px]",
    md: "px-8 py-3.5 text-base rounded-[8px]",
    lg: "px-10 py-4 text-[24px] rounded-[8px] font-semibold",
  }[size];

  // Only gradient background — no border / border-image
  const gradientStyles = "bg-gradient-to-b text-[#FFFFFF] from-[#EB141B] to-[#CD0108]";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${gradientStyles} ${className}`}
    >
      {text}
    </button>
  );
}