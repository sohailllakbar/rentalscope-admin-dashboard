// components/ui/AvatarCell.tsx
"use client";

import Image from "next/image";

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
  const fallbackSrc =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTEzIDEzQzEzIDEwLjIzOTIgMTUuMjM5MiA4IDE5IDhIMjFDMjQuNzYwOCA4IDI4IDEwLjIzOTIgMjggMTNDMjggMTUuNzYwOCAyNC43NjA4IDE4IDIxIDE4SDE5QzE1LjIzOTIgMTggMTMgMTUuNzYwOCAxMyAxM1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE5IDIyQzE1LjY4NjMgMjIgMTMgMjQuNjg2MyAxMyAyOFYyOEMxMyAzMS4zMTM3IDE1LjY4NjMgMzQgMTkgMzRIMjFDMjQuMzEzNyAzNCAyNyAzMS4zMTM3IDI3IDI4VjI4QzI3IDI0LjY4NjMgMjQuMzEzNyAyMiAyMSAyMkgxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";

  return (
    <div
      className={`relative overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}   // ✅ FIX
    >
      <Image
        src={src ?? fallbackSrc}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}
