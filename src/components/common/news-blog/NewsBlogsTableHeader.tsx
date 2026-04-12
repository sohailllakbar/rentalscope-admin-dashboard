// components/table/NewsBlogsTableHeader.tsx
// (or PropertiesTableHeader.tsx – rename as you prefer)

"use client";

import Image from "next/image";
import { nunito } from "@/lib/fonts";
import sortIcon from "@/assets/icons/common/sort-icon.svg";

type SortDirection = "asc" | "desc" | null;

interface TableHeaderProps {
  sortBy?: "images" | "title" | "description" | "date" | null;
  sortDirection?: SortDirection;
  onSort?: (column: "images" | "title" | "description" | "date") => void;
}

export default function NewsBlogsTableHeader({
  sortBy,
  sortDirection,
  onSort,
}: TableHeaderProps) {


  const handleSort = (column: "images" | "title" | "description" | "date") => {
    if (onSort) onSort(column);
  };

  return (
    <thead className={`${nunito.className} bg-[#FFFFFF]`}>
      <tr className="border-b border-[#E5E7EB]">
        {/* Images – centered */}
        <th
          scope="col"
          className="border border-[#4747474D] px-6 py-4 text-center text-[18px] font-bold text-[#000000] md:text-[20px]"
        >
          Images
        </th>

        {/* Blog Title – left + sortable */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-4 text-left text-[18px] font-bold text-[#000000] transition-colors hover:text-[#0E86E8] md:text-[20px]"
          onClick={() => handleSort("title")}
        >
          <div className="flex items-center gap-2">
            Blog Title
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`transition-transform   text-[#000000] `}
            />
          </div>
        </th>

        {/* Description – left + sortable */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-4 text-left text-[18px] font-bold text-[#000000] transition-colors hover:text-[#0E86E8] md:text-[20px]"
          onClick={() => handleSort("description")}
        >
          <div className="flex items-center gap-2">
            Description
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`transition-transform`}
            />
          </div>
        </th>

        {/* Date – left + sortable */}
        <th
          scope="col"
          className="cursor-pointer border border-[#4747474D] px-6 py-4 text-left text-[18px] font-bold text-[#000000] transition-colors hover:text-[#0E86E8] md:text-[20px]"
          onClick={() => handleSort("date")}
        >
          <div className="flex items-center gap-2">
            Date
            <Image
              src={sortIcon}
              alt="Sort"
              width={14}
              height={14}
              className={`transition-transform `}
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
