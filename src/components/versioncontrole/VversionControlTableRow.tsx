// components/versioncontrole/VersionControlTableRow.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { nunito } from "@/lib/fonts";
import StatusBadgeButton from "@/components/versioncontrole/StatusBadgeButton";

const STATUS_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Outdated", value: "outdated" },
  { label: "Stable", value: "stable" },
  { label: "Beta", value: "beta" },
];

interface Version {
  id: string | number;
  versionNumber: string;
  description: string;
  releaseDate: string;
  status: string;
}

interface VersionControlTableRowProps {
  version: Version;
  index: number;
  onEdit?: (versionId: string | number) => void;
  onStatusChange?: (versionId: string | number, status: string) => Promise<void>;
}

function formatDate(dateString: string) {
  if (!dateString) return "";

  const [day, month, year] = dateString.split("/");

  const date = new Date(`${year}-${month}-${day}`);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  if (!status) return "Status";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export default function VersionControlTableRow({
  version,
  index,
  onStatusChange,
}: VersionControlTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const isEven = index % 2 === 0;
  const rowBg = isEven ? "bg-[#F2F2F2]" : "bg-[#FFFFFF]";

  const handleStatusSelect = async (status: string) => {
    setIsOpen(false);

    if (status.toLowerCase() === version.status.toLowerCase()) return;
    if (!onStatusChange) return;

    try {
      setUpdating(true);
      await onStatusChange(version.id, status);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <tr
      className={` ${rowBg} ${nunito.className} text-[16px] transition-colors duration-150 hover:bg-[#F1F5F9] md:text-[17px] lg:text-[18px]`}
    >
      {/* Version Number - centered */}
      <td className="border border-[#4747474D] px-4 py-5 text-center text-[16px] font-semibold text-[#444444] sm:px-6">
        {version.versionNumber}
      </td>

      {/* Description - left-aligned, multi-line clamp */}
      <td className="max-w-60 truncate border border-[#4747474D] px-3 py-3 text-[16px] font-semibold text-[#444444] sm:px-4 sm:py-4 ">
        {version.description}
      </td>

      {/* Release Date - centered */}
      <td className="border border-[#4747474D] px-4 py-5 text-center text-[16px] font-semibold text-[#444444] sm:px-6">
        {formatDate(version.releaseDate)}
      </td>

      {/* Version Status - centered badge */}
      <td className="relative border border-[#4747474D] px-4 py-5 text-center sm:px-6">
        <div className="relative inline-block text-left">
          <StatusBadgeButton
            status={updating ? "Updating..." : formatStatus(version.status)}
            onClick={() => setIsOpen((prev) => !prev)}
            showArrow={!updating}
            isOpen={isOpen}
            loading={updating}
          />

          {isOpen && (
            <div className="absolute left-1/2 z-20 mt-2 w-full min-w-38 -translate-x-1/2 overflow-hidden rounded-[3px] border border-[#D7D7D7] bg-white shadow-lg">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusSelect(option.value)}
                  className="block w-full px-4 py-2.5 text-left text-[15px] font-semibold text-[#444444] capitalize transition hover:bg-[#EEF6FF] hover:text-[#0D80E1]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}