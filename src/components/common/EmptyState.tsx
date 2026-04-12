import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
  image: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  image,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-20 text-center">
      
      {/* Illustration */}
      <Image
        src={image}
        alt="Empty state"
        width={320}
        height={320}
        className="mb-6"
        priority
      />

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="mt-2 max-w-md text-gray-500">
          {description}
        </p>
      )}

      {/* Optional Action Button */}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 rounded-lg bg-[#0E86E8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D80E1]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}