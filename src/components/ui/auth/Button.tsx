"use client";

import { BeatLoader } from "react-spinners";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  className?: string;
};

export default function Button({
  children,
  type = "button",
  loading = false,
  className = "",
}: ButtonProps) {
  const loaderColor = "#ffffff";

  return (
    <button
      type={type}
      disabled={loading}
      className={`relative mt-2 flex w-full items-center justify-center rounded-lg bg-linear-to-b from-[#0E86E8] via-[#0D80E1] to-[#085799] py-4 text-[26px] font-semibold tracking-[0.2px] text-white transition-all duration-200 ease-out hover:shadow-[0_8px_18px_rgba(13,128,225,0.45)] hover:brightness-[1.05] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80 ${className}`}
    >
      {/* Button Text */}
      <span
        className={`transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </span>

      {/* Loader */}
      {loading && (
        <span className="pointer-events-none absolute flex items-center justify-center">
          <BeatLoader color={loaderColor} size={12} />
        </span>
      )}
    </button>
  );
}
