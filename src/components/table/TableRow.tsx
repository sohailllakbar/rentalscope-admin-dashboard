"use client";

import Image from "next/image";
import { useState } from "react";
import { nunito } from "@/lib/fonts";
import ActionMenu from "../table/ActionMenu";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg"; // ✅ import

// Column definition
export type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
};

// TableRow props
interface TableRowProps<T extends object> {
  row: T;
  columns: Column<T>[];
  onAction?: (row: T, action: "block" | "unblock") => void;
  index?: number;
}

// 🔥 Small internal image component (best practice)
function TableImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      sizes="64px"
      onError={() => setImgSrc(placeholderImage.src)} // ✅ fallback works properly
    />
  );
}

export default function TableRow<T extends object>({
  row,
  columns,
  onAction,
  index = 0,
}: TableRowProps<T>) {
  const isEven = index % 2 === 0;
  const bgColor = isEven ? "bg-[#F2F2F2]" : "bg-white";

  return (
    <tr
      className={` ${bgColor} hover:bg-[#F8F9FA] ${nunito.className} border-b border-gray-200 text-[#000000] transition-colors`}
    >
      {columns.map((column) => {
        const rawRow = row as Record<string, unknown>;
        const rawValue = rawRow[column.key as string];
        const value = (rawValue ?? "-") as T[keyof T];

        // Custom render
        if (column.render) {
          return (
            <td
              key={String(column.key)}
              className={`border border-[#4747474D] px-3 py-3 text-[16px] font-medium text-[#444444] sm:px-4 sm:py-4 sm:text-[20px] ${
                column.align === "center" ? "text-center" : ""
              } ${column.align === "right" ? "text-right" : ""}`}
            >
              {column.render(value, row)}
            </td>
          );
        }

        // ✅ Image column (FINAL FIX)
        if (column.key === "image") {
          const rawImage = rawRow["image"];
          const altName = String(rawRow["name"] ?? "User");

          // ✅ ALWAYS string (important)
          const imageSrc = rawImage
            ? String(rawImage)
            : placeholderImage.src;

          return (
            <td
              key={String(column.key)}
              className="border border-[#4747474D] px-3 py-3 text-center sm:px-4 sm:py-4"
            >
              <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-full  sm:h-16 sm:w-16">
                <TableImage
                  src={imageSrc}
                  alt={`${altName} profile`}
                />
              </div>
            </td>
          );
        }

        // Action column
        if (column.key === "action") {
          const blocked =
            String((row as Record<string, unknown>).status).toLowerCase() ===
            "blocked";

          return (
            <td
              key={String(column.key)}
              className="border border-[#4747474D] px-4 py-4 text-center"
            >
              <ActionMenu
                isBlocked={blocked}
                onBlock={() =>
                  onAction?.(row, blocked ? "unblock" : "block")
                }
              />
            </td>
          );
        }

        // Default cell
        return (
          <td
            key={String(column.key)}
            className={`max-w-50 truncate border border-[#4747474D] px-3 py-3 text-[16px] font-medium text-[#444444] sm:max-w-none sm:px-4 sm:py-4 sm:text-[20px] ${
              column.align === "center" ? "text-center" : ""
            } ${column.align === "right" ? "text-right" : ""}`}
          >
            {String(value)}
          </td>
        );
      })}
    </tr>
  );
}