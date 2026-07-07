"use client";

// components/ui/AvatarCell.tsx
import Image from "next/image";
import { useState } from "react";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

type AvatarCellProps = {
  src: string | null | undefined;  // URL from backend (can be null/undefined)
  alt: string;                     // usually user's name
  size?: number;                   // default 40px
  className?: string;              // optional extra styles
};

export default function AvatarCell({
  src,
  alt,
  size = 40,
  className = "",
}: AvatarCellProps) {
  const fallbackSrc = placeholderImage.src;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src && src !== failedSrc ? src : fallbackSrc;

  return (
    <div
      className={`
        relative w-${size} h-${size} rounded-full overflow-hidden
        border border-gray-200 shrink-0 bg-gray-100
        ${className}
      `}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image
        src={imageSrc}
        alt={alt || "User avatar"}
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={() => setFailedSrc(src || fallbackSrc)}
      />
    </div>
  );
}
