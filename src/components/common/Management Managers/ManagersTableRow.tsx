"use client";

import Image from "next/image";
import { useState } from "react";
import { nunito } from "@/lib/fonts";
import BlockButton from "@/components/common/Management Managers/BlockButton";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg"; // ✅ added

interface Manager {
  id: string | number;
  avatar: string;
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
}

interface ManagersTableRowProps {
  manager: Manager;
  index: number;
  onBlock?: (managerId: string | number) => void;
}

export default function ManagersTableRow({
  manager,
  index,
  onBlock,
}: ManagersTableRowProps) {
  const isEven = index % 2 === 0;
  const rowBg = isEven ? "bg-[#F9FAFB]" : "bg-white";

  // ✅ image fallback state
  const [imgSrc, setImgSrc] = useState(
    manager.avatar && manager.avatar.trim() !== ""
      ? manager.avatar
      : placeholderImage.src
  );

  return (
    <tr
      className={` ${rowBg} ${nunito.className} border-b border-[#4747474D] text-[16px] transition-colors duration-150 hover:bg-[#F1F5F9] md:text-[17px] lg:text-[18px]`}
    >
      {/* Avatar / Image – centered */}
     <td className="border border-[#4747474D] px-4 py-5 text-center sm:px-6">
  <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-full sm:h-16 sm:w-16">
    <Image
      src={imgSrc}
      alt={manager.name}
      fill
      className="object-cover"
      sizes="64px"
      onError={() => {
        if (imgSrc !== placeholderImage.src) {
          setImgSrc(placeholderImage.src);
        }
      }}
    />
  </div>
</td>

      {/* Name */}
      <td className="border border-[#4747474D] px-4 py-5 font-medium text-gray-900 sm:px-6">
        {manager.name}
      </td>

      {/* Email */}
      <td className="border border-[#4747474D] px-4 py-5 text-gray-600 sm:px-6">
        {manager.email}
      </td>

      {/* Password */}
      <td className="border border-[#4747474D] px-4 py-5 font-mono text-gray-700 sm:px-6">
        {manager.password}
      </td>

      {/* Action */}
      <td className="border border-[#4747474D] px-4 py-5 text-center sm:px-6">
        <BlockButton
          text={manager.isBlocked ? "Unblock" : "Block"}
          size="md"
          isBlocked={manager.isBlocked}
          className="mx-auto w-full max-w-30"
          onClick={() => onBlock?.(manager.id)}
        />
      </td>
    </tr>
  );
}