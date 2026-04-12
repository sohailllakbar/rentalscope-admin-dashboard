"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import OptionIcon from "@/assets/icons/common/option-icon.svg";
import { nunito } from "@/lib/fonts";

type TableControlsProps = {
  entries: number;
  onEntriesChange: (value: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  entriesOptions?: number[];
};

export default function TableControls({
  entries,
  onEntriesChange,
  search,
  onSearchChange,
  entriesOptions = [10, 25, 50, 100],
}: TableControlsProps) {
  const handleEntriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onEntriesChange(Number(e.target.value));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div
      className={`${nunito.className} flex flex-col gap-5 border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-5 xs:px-6 min-[1066px]:flex-row min-[1066px]:items-center min-[1066px]:justify-between md:px-8 md:py-6 lg:gap-8`}
    >
      {/* Entries dropdown section */}
      <div className="flex items-center gap-3 text-[18px] font-semibold text-[#000000CC] md:text-[20px]">
        <span>Show</span>

        <div className="relative inline-block min-w-20 xs:min-w-20 md:min-w-23.75">
          <select
            value={entries}
            aria-label="Select number of entries"
            onChange={handleEntriesChange}
            className={`w-full cursor-pointer appearance-none rounded-[3px] border border-[#2F2F2F80] bg-white px-3 py-2 pr-9 text-[18px] text-[#444444] focus:border-[#232222ad] focus:outline-none md:py-2.5 md:text-[20px]`}
          >
            {entriesOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Image
              src={OptionIcon}
              alt="Dropdown"
              width={12}
              height={12}
              className="opacity-70"
            />
          </div>
        </div>

        <span>entries</span>
      </div>

      {/* Search input section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 text-[18px] font-bold text-[#000000] md:text-[22px]">
        <span className="sm:self-center">Search:</span>

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