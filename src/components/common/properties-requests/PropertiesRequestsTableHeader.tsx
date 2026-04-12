// components/table/PropertiesRequestsTableHeader.tsx
"use client";

import Image from "next/image";
import { nunito } from "@/lib/fonts";
import sortIcon from "@/assets/icons/common/sort-icon.svg";

type SortDirection = "asc" | "desc" | null;

interface PropertiesRequestsTableHeaderProps {
  sortBy?: "images" | "name" | "description" | "type" | null;
  sortDirection?: SortDirection;
  onSort?: (column: "images" | "name" | "description" | "type") => void;
}

export default function PropertiesRequestsTableHeader({
  sortBy,
  sortDirection,
  onSort,
}: PropertiesRequestsTableHeaderProps) {
  const getSortIconClass = (column: string) => {
    if (sortBy !== column) return "opacity-40";
    return sortDirection === "asc" ? "rotate-180" : "";
  };

  return (
    <thead className={`${nunito.className} bg-[#FFFFFF]`}>
      <tr>
        {/* Images – centered, not sortable */}
        <th
          scope="col"
          className="border border-[#4747474D] px-6 py-4 text-center text-[18px] font-bold text-[#000000] md:text-[20px]"
        >
          Images
        </th>

        {/* Property Name – left, sortable */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-4 text-left text-[18px] font-bold text-[#000000] transition-colors hover:text-[#0E86E8] md:text-[20px]"
          onClick={() => onSort?.("name")}
        >
          <div className="flex items-center gap-2">
            Property Name
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`transition-transform ${getSortIconClass("name")}`}
            />
          </div>
        </th>

        {/* Description – left, sortable */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-4 text-left text-[18px] font-bold text-[#000000] transition-colors hover:text-[#0E86E8] md:text-[20px]"
          onClick={() => onSort?.("description")}
        >
          <div className="flex items-center gap-2">
            Description
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`transition-transform ${getSortIconClass("description")}`}
            />
          </div>
        </th>

        {/* Type – left, sortable */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-4 text-left text-[18px] font-bold text-[#000000] transition-colors hover:text-[#0E86E8] md:text-[20px]"
          onClick={() => onSort?.("type")}
        >
          <div className="flex items-center gap-2">
            Type
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`transition-transform ${getSortIconClass("type")}`}
            />
          </div>
        </th>

        {/* Action – centered, not sortable */}
        <th
          scope="col"
          className="border border-[#4747474D] px-6 py-4 text-center text-[18px] font-bold text-[#000000] md:text-[20px]"
        >
          Action
        </th>
      </tr>
    </thead>
  );
}