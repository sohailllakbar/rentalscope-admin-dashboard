// components/versioncontrole/VersionControlTableRow.tsx
"use client";

import { nunito } from "@/lib/fonts";
import StatusBadgeButton from "@/components/versioncontrole/StatusBadgeButton";

interface Version {
  id: string | number;
  versionNumber: string;
  description: string;
  releaseDate: string;
  status: string; // ← Changed from strict union to string (fixes error)
}

interface VersionControlTableRowProps {
  version: Version;
  index: number;
  onEdit?: (versionId: string | number) => void;
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

export default function VersionControlTableRow({
  version,
  index,
}: VersionControlTableRowProps) {
  const isEven = index % 2 === 0;
  const rowBg = isEven ? "bg-[#F2F2F2]" : "bg-[#FFFFFF]";

  return (
    <tr
      className={` ${rowBg} ${nunito.className} text-[16px] transition-colors duration-150 hover:bg-[#F1F5F9] md:text-[17px] lg:text-[18px]`}
    >
      {/* Version Number – centered */}
      <td className="border border-[#4747474D] text-[16px] px-4 py-5 text-center font-semibold text-[#444444] sm:px-6">
        {version.versionNumber}
      </td>

      {/* Description – left-aligned, multi-line clamp */}
      <td className="max-w-60 truncate border border-[#4747474D] px-3 py-3 text-[16px] font-semibold text-[#444444] sm:px-4 sm:py-4 ">
        {version.description}
      </td>

      {/* Release Date – centered */}
     <td className="border border-[#4747474D] px-4 py-5 text-center text-[16px] font-semibold text-[#444444] sm:px-6">
  {formatDate(version.releaseDate)}
</td>

      {/* Version Status – centered badge */}
      <td className="border border-[#4747474D] px-4 py-5 text-center sm:px-6">
        <StatusBadgeButton
          status={version.status}
        />{" "}
      </td>
    </tr>
  );
}
