// components/admin/amenities/AmenitiesSearch.tsx
"use client";

import { ChangeEvent } from "react";

interface AmenitiesSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

export default function AmenitiesSearch({
  searchValue,
  onSearchChange,
  className = "",
}: AmenitiesSearchProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div
      className={`flex items-center gap-3 ${className}`}
    >
      <span className="text-[18px] font-bold text-black md:text-[20px] lg:text-[22px] whitespace-nowrap">
        Search:
      </span>

      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder="Type to search..."
        className={`
          w-full max-w-[320px] sm:max-w-70 md:max-w-85 lg:max-w-95
          rounded-[5px]
          border border-[#2F2F2F80] /* light gray with opacity like figma */
          px-4 py-3           /* taller padding than minimal */
          text-[16px] md:text-[18px] lg:text-[19px]
          placeholder-gray-500
          bg-white
          transition-all duration-150
          focus:border-[#0E86E8]     /* match your primary blue on focus */
          focus:ring-1 focus:ring-[#0E86E8]/30
          focus:outline-none
          shadow-sm
        `}
      />
    </div>
  );
}