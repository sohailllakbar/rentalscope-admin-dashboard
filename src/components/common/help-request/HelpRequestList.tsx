// components/common/HelpRequestList.tsx
"use client";

import { nunito } from "@/lib/fonts";
import Image from "next/image";
import listicon from "@/assets/icons/help-request/request-list-icon.svg";

interface Request {
  id: number;
  name: string;
  email: string;
  status: "Unread" | "Read";
  avatar: string;
}

interface HelpRequestListProps {
  requests: Request[];
  onSelect: (id: number) => void;
  selectedId?: number;
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
          key={request.id}
          onClick={() => onSelect(request.id)}
          className={`mx-2 my-4 flex cursor-pointer items-center justify-between gap-4 rounded-[5px] bg-[#FFFFFF] px-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${
            selectedId === request.id
              ? "translate-y-px bg-blue-50/80 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
              : ""
          } last:mb-0`}
        >
          {/* Avatar on left */}
          <div className="shrink-0">
            <Image
              src={request.avatar}
              alt={request.name}
              width={64}
              height={64}
              quality={100}
              priority={idx < 4} // faster load for first few visible items
              className="rounded-full border border-gray-200 object-cover"
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
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
