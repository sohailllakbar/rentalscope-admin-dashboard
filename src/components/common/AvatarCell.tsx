// components/ui/AvatarCell.tsx
import Image from "next/image";

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
  // Fallback image if no src (gray placeholder)
  const fallbackSrc = "/images/placeholder-avatar.png"; // add a gray circle placeholder in public/images/

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
        src={src || fallbackSrc}
        alt={alt || "User avatar"}
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={(e) => {
          e.currentTarget.src = fallbackSrc; // fallback on error
        }}
      />
    </div>
  );
}