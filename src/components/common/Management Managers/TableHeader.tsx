// components/common/ManagersTableHeader.tsx
"use client";

import Image from "next/image";
import sortIcon from "@/assets/icons/common/sort-icon.svg";
import { nunito } from "@/lib/fonts";

type SortDirection = "asc" | "desc" | null;

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface ManagersTableHeaderProps {
  sortBy?: "name" | "email" | null;
  sortDirection?: SortDirection;
  onSort?: (column: "name" | "email") => void;
}

export default function ManagersTableHeader({
  sortBy = null,
  sortDirection = null,
  onSort,
}: ManagersTableHeaderProps) {
  const columns: Column[] = [
    { key: "images", label: "Images", sortable: false, align: "center" },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "password", label: "Password", sortable: false },
    { key: "action", label: "Action", sortable: false, align: "center" },
  ];

  const getSortIconClass = (columnKey: string) => {
    if (sortBy === columnKey) {
      return sortDirection === "asc" ? "rotate-180" : "";
    }
    return "";
  };

  const handleSort = (key: string) => {
    if (onSort && (key === "name" || key === "email")) {
      onSort(key);
    }
  };

  return (
    <thead className={`${nunito.className} bg-[#FFFFFF]`}>
      <tr className="border-b border-[#4747474D] text-gray-700">
        {columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={`
              relative px-6 py-4 text-center md:text-left
              text-[16px] md:text-[17px] lg:text-[18px]
              font-bold text-[#000000]
              ${col.sortable ? "cursor-pointer hover:text-[#0D80E1] transition-colors" : ""}
              ${col.align === "center" ? "text-center" : "text-left"}
              border border-[#4747474D]
            `}
            onClick={() => col.sortable && handleSort(col.key)}
          >
            {/* Label */}
            <span className="font-bold">{col.label}</span>

            {/* Sort icon – only for sortable columns */}
            {col.sortable && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <Image
                  src={sortIcon}
                  alt="Sort"
                  width={16}
                  height={16}
                  className={`transition-transform ${getSortIconClass(col.key)}`}
                />
              </div>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}