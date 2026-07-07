"use client";

import Image from "next/image";
import { nunito } from "@/lib/fonts";
import ActionButton from "@/components/common/news-blog/ActionButton";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

const BASE_URL = "https://tenanttrust.appistansoft.com";

function parseImages(images: string | string[] | null | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;

  try {
    const parsed = JSON.parse(images || "[]");

    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "string") {
      const nested = JSON.parse(parsed);
      return Array.isArray(nested) ? nested : [];
    }
  } catch {}

  return images
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

function isVideo(file: string) {
  return file.split("?")[0].toLowerCase().endsWith(".mp4");
}

function getImageUrl(file: string | null) {
  if (!file || isVideo(file)) return placeholderImage.src;
  if (file.startsWith("http://") || file.startsWith("https://")) return file;

  return `${BASE_URL}/uploads/${file.replace(/^\/+/, "").replace(/^uploads\//, "")}`;
}

interface PropertyRequest {
  id: number;
  propertyId: number;
  property?: {
    title: string;
    description: string;
    saleOrRent: string;
    images: string | string[] | null;
  };
  name: string;
  description: string;
  saleOrRent: string;
}

interface PropertiesRequestsTableRowProps {
  request: PropertyRequest;
  index: number;
  onView: (id: number) => void;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
}

export default function PropertiesRequestsTableRow({
  request,
  index,
  onView,
  onApprove,
  onDecline,
}: PropertiesRequestsTableRowProps) {
  const isEven = index % 2 === 0;
  const bgColor = isEven ? "bg-[#F2F2F2]" : "bg-white";

  const images = parseImages(request.property?.images);
  const firstImage = images.find((image) => !isVideo(image)) ?? null;
  const imageUrl = getImageUrl(firstImage);

  return (
    <tr
      className={`${bgColor} hover:bg-[#F8F9FA] ${nunito.className} border-b border-gray-200 text-[#000000] transition-colors`}
    >
      {/* Image */}
      <td className="border border-[#4747474D] px-3 py-3 text-center sm:px-4 sm:py-4">
        <div className="relative mx-auto h-12 w-12 overflow-hidden rounded-full border border-gray-200 sm:h-16 sm:w-16">
          <Image
            src={imageUrl}
            alt={request.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      </td>

      {/* Property Name */}
      <td
        className="max-w-50 truncate border border-[#4747474D] px-3 py-3 text-[16px] font-medium text-[#444444] sm:max-w-none sm:px-4 sm:py-4 sm:text-[20px]"
        title={request.name}
      >
        {request.name}
      </td>

      {/* Description */}
      <td
        className="max-w-60 truncate border border-[#4747474D] px-3 py-3 text-[16px] text-[#444444] sm:px-4 sm:py-4 sm:text-[20px]"
        title={request.description}
      >
        {request.description}
      </td>

      {/* Type */}
      <td className="border border-[#4747474D] px-3 py-3 text-center text-[16px] font-medium text-[#444444] sm:px-4 sm:py-4 sm:text-[20px]">
        {`For ${request.saleOrRent}`}
      </td>

      {/* Actions */}
      <td className="border border-[#4747474D] px-3 py-3 text-center sm:px-4 sm:py-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ActionButton
            variant="view"
            onClick={() => onView(request.id)}
            size="sm"
          >
            View
          </ActionButton>

          <ActionButton
            variant="edit"
            onClick={() => onApprove(request.id)}
            size="sm"
          >
            Approve
          </ActionButton>

          <ActionButton
            variant="delete"
            onClick={() => onDecline(request.id)}
            size="sm"
          >
            Decline
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}