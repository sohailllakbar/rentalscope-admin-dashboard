// components/table/DataTable.tsx
"use client";

import { useState } from "react";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
};

type DataTableProps<T extends Record<string, unknown>> = {
  title?: string; // optional - can be passed from PageHeader
  columns: Column<T>[];
  data: T[];
  keyField: keyof T; // e.g. "id"
  onAction?: (row: T, action: "block" | "unblock") => void;
  showHeaderControls?: boolean; // show/hide entries + search (if using PageHeader outside)
};

export default function DataTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  keyField,
  onAction,
  showHeaderControls = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  // Filter
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const paginatedData = sortedData.slice(
    (currentPage - 1) * entries,
    currentPage * entries,
  );

  const totalPages = Math.ceil(sortedData.length / entries);

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Optional title (if not using PageHeader outside) */}
      {title && (
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {/* Controls (entries + search) */}
      {showHeaderControls && (
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={entries}
              aria-label="Select number of entries per page"
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Type to search..."
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <TableHead
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={String(row[keyField])}
                  row={row}
                  columns={columns}
                  onAction={onAction}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredData.length}
        entriesPerPage={entries}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
