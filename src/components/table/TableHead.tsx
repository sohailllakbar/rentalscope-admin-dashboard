// components/table/TableHead.tsx
import React from "react";
import { Column } from "./DataTable";

type TableHeadProps<T> = {
  columns: Column<T>[];
  sortConfig: { key: keyof T | null; direction: "asc" | "desc" | null };
  onSort: (key: keyof T) => void;
};

export default function TableHead<T>({
  columns,
  sortConfig,
  onSort,
}: TableHeadProps<T>) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key as string}
            className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
          >
            {col.sortable ? (
              <button
                onClick={() => onSort(col.key as keyof T)}
                className="group flex items-center gap-1.5 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors"
              >
                {col.label}
                <span
                  className={`text-xs font-bold opacity-0 group-hover:opacity-70 transition-opacity ${
                    sortConfig.key === col.key ? "opacity-100" : ""
                  }`}
                >
                  {sortConfig.key === col.key
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : "↑↓"}
                </span>
              </button>
            ) : (
              col.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}