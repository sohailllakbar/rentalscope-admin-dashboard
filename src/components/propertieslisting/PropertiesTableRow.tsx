"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/ui/buttons/DeleteButton";
import { nunito } from "@/lib/fonts";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";


interface Property {
  id: number;
image?: string | null;
  name: string;
  description: string;
  type: "For Sale" | "For Rent" | string;
}

interface PropertiesTableRowProps {
  property: Property;
  index: number;
  onView?: (id: number) => void;
  onDelete: (id: number) => void;
}

// ✅ Image wrapper
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
      sizes="80px"
      onError={() => setImgSrc(placeholderImage.src)}
    />
  );
}

export default function PropertiesTableRow({
  property,
  index,
  onView,
  onDelete,
}: PropertiesTableRowProps) {
  const router = useRouter();

  const handleView = () => {
    if (onView) {
      onView(property.id);
    } else {
      router.push(`/admin/properties-listing/${property.id}`);
    }
  };

  const rowBg = index % 2 === 0 ? "#F2F2F2" : "#FFFFFF";

const imageSrc = property.image || placeholderImage.src;
  return (
    <tr
      style={{ backgroundColor: rowBg }}
      className={`${nunito.className} border-b border-[#4747474D] transition-colors hover:bg-gray-50`}
    >
      {/* Images */}
      <td className="border border-[#4747474D] px-6 py-3 text-center">
        <div className="flex justify-center">
          <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-full sm:h-16 sm:w-16">
            <TableImage src={imageSrc} alt={property.name} />
          </div>
        </div>
      </td>

      {/* Property Name */}
      <td className="border border-[#4747474D] px-6 py-4 text-[16px] font-medium text-[#444444] md:text-[20px]">
        {property.name}
      </td>

      {/* Description */}
      <td className="max-w-60 truncate border border-[#4747474D] px-3 py-3 text-[16px] text-[#444444] sm:px-4 sm:py-4 sm:text-[20px]">
          {property.description}
        
      </td>

      {/* Type */}
      <td className="border border-[#4747474D] px-6 py-6 text-center text-[16px] font-medium text-[#444444] md:text-[20px]">
        {property.type}
      </td>

      {/* Action */}
      <td className="border border-[#4747474D] px-6 py-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleView}
            className="rounded-[5px] bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-2.5 text-[17px] font-medium text-white transition-all duration-200 ease-out hover:shadow-[0_4px_12px_rgba(13,128,225,0.3)] hover:brightness-110 active:scale-[0.98] md:text-[18px]"
          >
            View
          </button>

          <DeleteButton onClick={() => onDelete(property.id)} />
        </div>
      </td>
    </tr>
  );
}