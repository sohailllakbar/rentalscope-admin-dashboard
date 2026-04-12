// components/common/StatusBadgeButton.tsx
"use client";

import { nunito } from "@/lib/fonts";

type StatusType = "Latest" | "Outdated" | "Stable" | "Beta" | string; // allow string for flexibility

interface StatusBadgeButtonProps {
  status: StatusType;
  onClick?: () => void;
  className?: string;
}

export default function StatusBadgeButton({
  status,
  onClick,
  className = "",
}: StatusBadgeButtonProps) {
  // Status styles (modern, with opacity)
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "latest":
        return {
          bg: "bg-blue-50",
          text: "text-[#0057FF]",
          border: "border-[#0057FF]",
          hover: "hover:bg-blue-100 hover:border-blue-400",
        };
      case "outdated":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-300",
          hover: "hover:bg-red-100 hover:border-red-400",
        };
      case "stable":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-300",
          hover: "hover:bg-green-100 hover:border-green-400",
        };
      case "beta":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-300",
          hover: "hover:bg-yellow-100 hover:border-yellow-400",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-300",
          hover: "hover:bg-gray-200 hover:border-gray-400",
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={`Status: ${status}`}
      className={` ${nunito.className} inline-flex h-10 min-w-30 items-center justify-center rounded-[1px] border px-5 py-2 text-[16px] font-semibold capitalize transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed  ${styles.bg} ${styles.text} ${styles.border} ${styles.hover} ${className} `}
    >
      {status}
    </button>
  );
}
