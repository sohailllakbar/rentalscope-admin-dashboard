// components/admin/amenities/AmenitiesTableHeader.tsx
"use client";

import Image from "next/image";
import sortIcon from "@/assets/icons/common/sort-icon.svg";
import { nunito } from "@/lib/fonts";

type SortDirection = "asc" | "desc" | null;

interface AmenitiesTableHeaderProps {
  sortBy?: "id" | "name" | null;
  sortDirection?: SortDirection;
  onSort?: (column: "id" | "name") => void;
}

export default function AmenitiesTableHeader({
  sortBy = null,
  sortDirection = null,
  onSort,
}: AmenitiesTableHeaderProps) {
  const getSortIconClass = (column: "id" | "name") => {
    if (sortBy !== column) return "";
    return sortDirection === "asc" ? "rotate-180" : "";
  };

  const handleSort = (column: "id" | "name") => {
    if (onSort) onSort(column);
  };

  return (
    <thead className={`${nunito.className} bg-[#FFFFFF]`}>
      <tr className="text-gray-700">
        <th
          scope="col"
          className="relative cursor-pointer border border-[#4747474D] px-12 py-3 text-center text-[16px] font-bold transition-colors hover:text-gray-900 md:text-[17px] lg:text-[18px]"
          onClick={() => handleSort("id")}
        >
          <span className="text-[22px] font-bold text-[#000000]">#</span>
        </th>

        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 text-[16px] font-semibold transition-colors hover:text-gray-900 md:text-[17px] lg:text-[18px]"
          onClick={() => handleSort("name")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-bold text-[#000000]">
              Amenities Name
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

        {/* Edit Column – centered text + icon right */}
        <th
          scope="col"
          className="border border-[#4747474D] px-6 text-center text-[16px] font-semibold md:text-[17px] lg:text-[18px]"
        >
          <div className="flex items-center justify-between">
            <span className="flex-1 text-center text-[20px] font-bold text-[#000000]">
              Edit
            </span>
            <Image src={sortIcon} alt="Sort" width={14} height={14} />
          </div>
        </th>

        {/* Delete Column – same as Edit */}
        <th
          scope="col"
          className="border border-[#4747474D] px-6 text-center text-[16px] font-semibold md:text-[17px] lg:text-[18px]"
        >
          <div className="flex items-center justify-between">
            <span className="flex-1 text-center text-[20px] font-bold text-[#000000]">
              Delete
            </span>
            <Image src={sortIcon} alt="Sort" width={14} height={14} />
          </div>
        </th>
      </tr>
    </thead>
  );
}
