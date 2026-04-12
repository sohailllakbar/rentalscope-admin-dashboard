// components/admin/properties/PropertyImageBox.tsx
"use client";

import Image from "next/image";
import { nunito } from "@/lib/fonts";

interface PropertyImageBoxProps {
  mainImage?: string | null;
  propertyName: string;
  createdBy: {
    name: string;
    avatar?: string | null;
  };
}

export default function PropertyImageBox({
  mainImage,
  propertyName,
  createdBy,
}: PropertyImageBoxProps) {
  return (
    <div
      className={`
        ${nunito.className}
        flex flex-col items-center gap-5
        bg-white
        px-8 md:px-10 lg:px-12
        py-7 md:py-8 lg:py-9
        
        border border-gray-200
       
        w-full
        max-w-85 md:max-w-95 lg:max-w-105
      `}
    >
      {/* Main image – medium size, not dominating */}
      <div className="mx-auto">
        <div
          className="
            relative h-40 w-40 
            overflow-hidden rounded-full
           
          "
        >
          <Image
            src={mainImage || "/images/property-placeholder.jpg"}
            alt={propertyName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 160px, (max-width: 1024px) 176px, 192px"
            priority
          />
        </div>
      </div>

      {/* Created by – compact, centered */}
      <div className="text-center space-y-1.5">
        <p className="text-sm md:text-base text-[#828282] font-semibold uppercase tracking-wide">
          Property Created By
        </p>
        <p className="text-lg md:text-xl font-medium text-[#828282]">
          {createdBy.name}
        </p>
      </div>
    </div>
  );
}