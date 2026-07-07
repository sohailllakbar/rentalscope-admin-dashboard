// components/ui/AvatarCell.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

type AvatarCellProps = {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
};

export default function AvatarCell({
  src,
  alt = "Avatar",
  size = 72,
  className = "",
}: AvatarCellProps) {
  const fallbackSrc = placeholderImage.src;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src && src !== failedSrc ? src : fallbackSrc;

  return (
    <div
      className={`relative overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}   // ✅ FIX
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={() => setFailedSrc(src ?? fallbackSrc)}
      />
    </div>
  );
}
