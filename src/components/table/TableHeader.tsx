// components/table/TableHeader.tsx
"use client";

import Image from "next/image";
import { nunito } from "@/lib/fonts";
import sortIcon from "@/assets/icons/common/sort-icon.svg";

// Reuse the same Column type from TableRow
import { Column } from "./TableRow";

interface TableHeaderProps<T> {
  columns: Column<T>[];
}

export default function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead className={`${nunito.className} bg-[#FFFFFF]`}>
      <tr>
        {columns.map((col) => (
          <th
            key={String(col.key)}
            className={`
              border border-[#4747474D]
              px-4 py-4
              text-left
              text-[20px]
              font-bold
              text-[#000000]
              ${col.sortable ? "cursor-pointer hover:text-[#0D80E1]" : ""}
              ${col.align === "center" ? "text-center" : ""}
              ${col.align === "right" ? "text-right" : ""}
            `}
          >
           <div
  className={`
    flex items-center gap-2
    ${col.align === "center" ? "justify-center" : ""}
    ${col.align === "right" ? "justify-end" : ""}
    ${!col.align || col.align === "left" ? "justify-between" : ""}
  `}
>
              <span>{col.label}</span>
              {col.sortable && (
                <Image
                  src={sortIcon}
                  alt="Sort icon"
                  width={16}
                  height={16}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}