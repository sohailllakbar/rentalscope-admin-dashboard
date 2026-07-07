// components/common/HelpRequestList.tsx
"use client";

import { nunito } from "@/lib/fonts";
import Image from "next/image";
import { useState } from "react";
import listicon from "@/assets/icons/help-request/request-list-icon.svg";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

interface Request {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: "Unread" | "Read";
  avatar: string;
}

interface HelpRequestListProps {
  requests: Request[];
  onSelect: (id: number) => void;
  selectedId?: number;
}

function RequestAvatar({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const fallbackSrc = placeholderImage.src;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src && src !== failedSrc ? src : fallbackSrc;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={64}
      height={64}
      quality={100}
      priority={priority}
      className="rounded-full border border-gray-200 object-cover"
      onError={() => setFailedSrc(src || fallbackSrc)}
    />
  );
}

export default function HelpRequestList({
  requests,
  onSelect,
  selectedId,
}: HelpRequestListProps) {
  return (
    <div className={` ${nunito.className} overflow-hidden`}>
      {requests.map((request, idx) => (
        <div
          key={`${request.id}-${request.email}-${request.subject}-${idx}`}
          onClick={() => onSelect(request.id)}
          className={`mx-2 my-4 flex cursor-pointer items-center justify-between gap-4 rounded-[5px] bg-[#FFFFFF] px-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${
            selectedId === request.id
              ? "translate-y-px bg-blue-50/80 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
              : ""
          } last:mb-0`}
        >
          {/* Avatar on left */}
          <div className="shrink-0">
            <RequestAvatar
              src={request.avatar}
              alt={request.name}
              priority={idx < 4}
            />
          </div>

          {/* Name + Email */}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-base font-bold tracking-[-0.01em] text-[#000000]">
              {request.name}
            </p>
            <p className="truncate text-[15px] tracking-[-0.01em] text-[#555555]">
              {request.email}
            </p>
          </div>

          {/* Status badge with your custom icon */}
          <div
            className={`flex italic items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium whitespace-nowrap ${
              request.status === "Unread" ? "text-[#018EDE]" : "text-[#EB141B]"
            } `}
          >
            <span>{request.status}</span>
            <Image
              src={listicon}
              alt="Status icon"
              width={12}
              height={12}
              className="h-3 w-3 object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
