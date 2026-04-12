// components/table/Pagination.tsx
"use client";

import { nunito } from "@/lib/fonts";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * entriesPerPage + 1;
  const end = Math.min(start + entriesPerPage - 1, totalEntries);

  // Generate professional page list
  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Show ellipsis if needed
  if (currentPage > 4) {
    pages.push("…");
  }

  // Show current page ± 1 (or ± 2 for better UX)
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Show ellipsis before last page
  if (currentPage < totalPages - 3) {
    pages.push("…");
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <div
      className={`${nunito.className} flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 text-sm text-gray-600 md:flex-row`}
    >
      {/* Showing text */}
      <div className="text-[20px] font-medium text-[#000000]">
        Showing <span className="font-bold">{start}</span> to{" "}
        <span className="font-bold">{end}</span> of{" "}
        <span className="font-bold">{totalEntries}</span> entries
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous - blue circle */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D80E1] text-white transition-colors hover:bg-[#0B6BC5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-lg">&lt;</span>
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number"}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all ${
              currentPage === page
                ? "bg-[#0D80E1] text-white"
                : typeof page === "number"
                  ? "text-gray-700 hover:bg-gray-100"
                  : "cursor-default text-gray-400"
            } `}
          >
            {page}
          </button>
        ))}

        {/* Next - blue circle */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D80E1] text-white transition-colors hover:bg-[#0B6BC5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-lg">&gt;</span>
        </button>
      </div>
    </div>
  );
}
