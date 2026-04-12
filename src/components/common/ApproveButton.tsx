// components/common/ApproveButton.tsx
"use client";

interface ApproveButtonProps {
  text?: string; // Custom button text (default: "Approve Request")
  size?: "sm" | "md" | "lg"; // Size variant: small, medium (default), large
  disabled?: boolean; // Disable the button
  onClick?: () => void; // Click handler
  className?: string; // Optional extra classes (e.g. w-full, mx-auto...)
  type?: "button" | "submit" | "reset"; // Button type
}

export default function ApproveButton({
  text = "Approve Request",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: ApproveButtonProps) {
  // Base styles (shared for all sizes)
  const baseStyles =
    "inline-flex items-center justify-center font-medium text-white " +
    "transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm active:translate-y-[1px] " +
    "focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  // Size-specific styles
  const sizeStyles = {
    sm: "px-5 py-2.5 text-sm rounded-lg",
    md: "px-8 py-3.5 text-base rounded-lg",
    lg: "px-10 py-4 text-lg rounded-xl font-semibold",
  }[size];

  // Gradient background
  const gradientStyles = "bg-gradient-to-b from-[#34A853] to-[#118630]";

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
