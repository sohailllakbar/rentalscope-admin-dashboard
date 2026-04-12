






"use client";

import { useState, useEffect } from "react";
import { nunito } from "@/lib/fonts";

type Platform = "android" | "ios";

interface VersionSwitcherProps {
  initialPlatform?: Platform;
  onChange?: (platform: Platform) => void;
  className?: string;
}

export default function VersionSwitcher({
  initialPlatform = "android",
  onChange,
  className = "",
}: VersionSwitcherProps) {
  const [active, setActive] = useState<Platform>(initialPlatform);

  useEffect(() => {
    if (onChange) {
      onChange(active);
    }
  }, [active, onChange]);

  const handleSwitch = (platform: Platform) => {
    setActive(platform);
  };

  return (
    <div
      className={`inline-flex items-center bg-white ${nunito.className} ${className}`}
    >
      {/* Android */}
      <button
        type="button"
        onClick={() => handleSwitch("android")}
        className={`px-5 py-2.5 text-[18px] font-semibold transition ${
          active === "android"
            ? "bg-[#0D80E1] text-white"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        Android Version
      </button>

      {/* iOS */}
      <button
        type="button"
        onClick={() => handleSwitch("ios")}
        className={`border-l border-gray-200 px-5 py-2.5 text-[18px] font-semibold transition ${
          active === "ios"
            ? "bg-[#0D80E1] text-white"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        iOS Version
      </button>
    </div>
  );
}