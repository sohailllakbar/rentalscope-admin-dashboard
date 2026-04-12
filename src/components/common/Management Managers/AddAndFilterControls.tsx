// components/common/AddAndFilterControls.tsx
"use client";

import { ChangeEvent } from "react";
import AddNewButton from "@/components/common/AddNewButton";
import { nunito } from "@/lib/fonts";

// Add onAddClick as optional prop
type AddAndFilterControlsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick?: () => void;           // ← NEW: optional click handler
  addButtonText?: string;             // ← optional: customize button text
};

export default function AddAndFilterControls({
  search,
  onSearchChange,
  onAddClick,                        // ← receive it
  addButtonText = "Add New Version", // ← default text
}: AddAndFilterControlsProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div
      className={`${nunito.className} flex flex-col gap-5  bg-[#FFFFFF] px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-6`}
    >
      {/* Left: Add New Button */}
      <div className="flex items-center justify-center sm:justify-start">
        <AddNewButton
          text={addButtonText}           // ← use custom text if passed
          size="md"
          className="w-full max-w-70 sm:w-auto"
          onClick={onAddClick}           // ← use the handler
        />
      </div>

      {/* Right: Search Input */}
      <div className="flex items-center gap-3 text-[18px] font-bold text-[#000000] md:text-[22px]">
        <span>Search:</span>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Type to search..."
          className={`w-full rounded-[5px] border border-[#2F2F2F80] px-4 py-2.5 text-[16px] placeholder-gray-400 transition-all focus:border-[#24222280] focus:outline-none sm:w-64 md:w-72 md:py-3 md:text-[18px] lg:w-80 lg:text-[20px]`}
        />
      </div>
    </div>
  );
}