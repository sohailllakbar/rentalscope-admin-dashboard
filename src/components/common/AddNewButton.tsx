// components/common/AddNewButton.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import plusIcon from "@/assets/icons/common/plus-icon.svg";

interface AddNewButtonProps {
  text?: string;                    // Button text (default: "Add New")
  href?: string;                    // If provided → becomes a Next.js Link (navigation)
  size?: "sm" | "md" | "lg";        // Size variant
  disabled?: boolean;
  onClick?: () => void;             // Click handler (used when href is not provided)
  className?: string;               // Extra Tailwind classes
  type?: "button" | "submit" | "reset"; // Only used when it's a button
}

export default function AddNewButton({
  text = "Add New",
  href,
  size = "md",
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: AddNewButtonProps) {
  // Base styles (shared)
  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 " +
    "font-semibold text-white transition-all duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed " +
    "shadow-sm hover:shadow-md active:shadow-sm active:translate-y-[1px]";

  // Size styles
  const sizeStyles = {
    sm: "px-5 py-2.5 text-sm rounded-[4px]",
    md: "px-6 py-3.5 text-base rounded-[4px]",
    lg: "px-8 py-4 text-lg rounded-[4px] font-semibold",
  }[size];

  // Gradient background
  const gradientStyles = "bg-gradient-to-b from-[#0D80E1] to-[#085799]";

  const content = (
    <>
      <span>{text}</span>
      <Image
        src={plusIcon}
        alt="Add new"
        width={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        height={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        className="object-contain"
      />
    </>
  );

  const commonClasses = `${baseStyles} ${sizeStyles} ${gradientStyles} ${className}`;

  // If href is provided → render as Next.js Link (navigation)
  if (href) {
    return (
      <Link href={href} className={commonClasses}>
        {content}
      </Link>
    );
  }

  // Otherwise → render as button (for modal, form submit, etc.)
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={commonClasses}
    >
      {content}
    </button>
  );
}