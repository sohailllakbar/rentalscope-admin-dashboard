// components/versioncontrole/VersionControlTableRow.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { nunito } from "@/lib/fonts";

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
  onStatusChange?: (versionId: string | number, status: string) => void;
  isStatusUpdating?: boolean;
}

const STATUS_OPTIONS = ["latest", "outdated", "stable", "beta"];

function formatDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusStyles(status: string) {
  switch (status.toLowerCase()) {
    case "latest":
      return {
        border: "border-[#0057FF]",
        bg: "bg-blue-50",
        text: "text-[#0057FF]",
      };
    case "outdated":
      return {
        border: "border-red-500",
        bg: "bg-red-50",
        text: "text-red-600",
      };
    case "stable":
      return {
        border: "border-green-500",
        bg: "bg-green-50",
        text: "text-green-600",
      };
    case "beta":
      return {
        border: "border-yellow-500",
        bg: "bg-yellow-50",
        text: "text-yellow-600",
      };
    default:
      return {
        border: "border-gray-300",
        bg: "bg-gray-50",
        text: "text-gray-700",
      };
  }
}

function StatusSelect({
  status,
  disabled,
  onChange,
}: {
  status: string;
  disabled: boolean;
  onChange: (status: string) => void;
}) {
  const styles = getStatusStyles(status);

  return (
    <div className="relative mx-auto w-48">
      <select
        value={status}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Version status"
        className={`${styles.border} ${styles.bg} ${styles.text} h-12 w-full cursor-pointer appearance-none rounded-[3px] border px-5 pr-11 text-[20px] font-semibold capitalize outline-none transition disabled:cursor-wait disabled:opacity-60`}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={24}
        strokeWidth={2.6}
        className={`${styles.text} pointer-events-none absolute top-1/2 right-4 -translate-y-1/2`}
      />
    </div>
  );
}

export default function VersionControlTableRow({
  version,
  index,
  onStatusChange,
  isStatusUpdating = false,
}: VersionControlTableRowProps) {
  const isEven = index % 2 === 0;
  const rowBg = isEven ? "bg-[#F2F2F2]" : "bg-[#FFFFFF]";

  return (
    <tr
      className={`${rowBg} ${nunito.className} text-[16px] transition-colors duration-150 hover:bg-[#F1F5F9] md:text-[17px] lg:text-[18px]`}
    >
      <td className="border border-[#4747474D] px-4 py-5 text-center text-[16px] font-semibold text-[#444444] sm:px-6">
        {version.versionNumber}
      </td>

      <td className="max-w-60 truncate border border-[#4747474D] px-3 py-3 text-[16px] font-semibold text-[#444444] sm:px-4 sm:py-4">
        {version.description}
      </td>

      <td className="border border-[#4747474D] px-4 py-5 text-center text-[16px] font-semibold text-[#444444] sm:px-6">
        {formatDate(version.releaseDate)}
      </td>

      <td className="border border-[#4747474D] px-4 py-5 text-center sm:px-6">
        <StatusSelect
          status={version.status}
          disabled={isStatusUpdating}
          onChange={(status) => onStatusChange?.(version.id, status)}
        />
      </td>
    </tr>
  );
}
