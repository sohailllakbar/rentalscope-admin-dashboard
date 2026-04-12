// components/admin/properties/PropertiesTableHeader.tsx
"use client";

import Image from "next/image";
import sortIcon from "@/assets/icons/common/sort-icon.svg";
import { nunito } from "@/lib/fonts";

type SortDirection = "asc" | "desc" | null;

interface PropertiesTableHeaderProps {
  sortBy?: "images" | "name" | "description" | "type" | null;
  sortDirection?: SortDirection;
  onSort?: (column: "images" | "name" | "description" | "type") => void;
}

export default function PropertiesTableHeader({
  sortBy = null,
  sortDirection = null,
  onSort,
}: PropertiesTableHeaderProps) {

  const getSortIconClass = (
  column: "images" | "name" | "description" | "type"
) => {
  if (sortBy !== column) return "";
  return sortDirection === "asc" ? "rotate-180" : "";
};

  const handleSort = (column: "images" | "name" | "description" | "type") => {
    if (onSort) onSort(column);
  };

  return (
    <thead className={`${nunito.className} bg-[#FFFFFF]`}>
      <tr className="">
        {/* Images Column – centered text + icon right */}
        <th
          scope="col"
          className="relative cursor-pointer border border-[#4747474D] px-6 py-3 text-center text-[16px] font-bold transition-colors hover:text-gray-900 md:text-[20px]"
          onClick={() => handleSort("images")}
        >
          <span className="text-[20px] font-bold text-[#000000]">Images</span>
        </th>

        {/* Property Name Column – left text + icon right */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-3 text-[16px] font-semibold transition-colors hover:text-gray-900 md:text-[17px] lg:text-[18px]"
          onClick={() => handleSort("name")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold text-[#000000]">
              Property Name
            </span>
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`text-[#000000] ${getSortIconClass("name")}`}
            />
          </div>
        </th>

        {/* Description Column – left text + icon right */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-3 text-[16px] font-semibold transition-colors hover:text-gray-900 md:text-[17px] lg:text-[18px]"
          onClick={() => handleSort("description")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold text-[#000000]">
              Description
            </span>
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`text-[#000000] ${getSortIconClass("description")}`}
            />
          </div>
        </th>

        {/* Type Column – left text + icon right */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-3 text-[16px] font-semibold transition-colors hover:text-gray-900 md:text-[17px] lg:text-[18px]"
          onClick={() => handleSort("type")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold text-[#000000]">Type</span>
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`text-[#000000] ${getSortIconClass("type")}`}
            />
          </div>
        </th>

        {/* Action Column – centered text + icon right (static, not sortable) */}
        <th
          scope="col"
          className="border border-[#4747474D] px-6 py-3 text-center text-[16px] font-semibold md:text-[17px] lg:text-[18px]"
        >
          <div className="flex items-center justify-between">
            <span className="flex-1 text-center text-[20px] font-bold text-[#000000]">
              Action
            </span>
          </div>
        </th>
      </tr>
    </thead>
  );
}
