// components/common/VersionControlTableHeader.tsx
"use client";

import Image from "next/image";
import { nunito } from "@/lib/fonts";
import sortIcon from "@/assets/icons/common/sort-icon.svg";

export default function VersionControlTableHeader() {
  const columns = [
    {
      label: "Version Number",
      key: "versionNumber",
      sortable: true,
      width: "w-56 text-center",
    },
    {
      label: "Description",
      key: "description",
      sortable: true,
      width: "min-w-[300px]",
    },
    {
      label: "Release Date",
      key: "releaseDate",
      sortable: true,
      width: "w-56 text-center",
    },
    {
      label: "Version Status",
      key: "status",
      sortable: true,
      width: "w-56 text-center",
    },
  ];

  return (
    <thead className={`${nunito.className} bg-[#FFFFFF]`}>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`border border-[#4747474D] px-4 py-4 text-center text-[20px] font-bold text-[#000000]  ${col.width} `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{col.label}</span>
              {col.sortable && (
                <Image
                  src={sortIcon}
                  alt="Sort"
                  width={16}
                  height={16}
                  className="opacity-70"
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
