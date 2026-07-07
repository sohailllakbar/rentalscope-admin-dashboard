// components/admin/properties/PropertyMediaGrid.tsx
"use client";

import Image from "next/image";
import playIcon from "@/assets/icons/common/video-play-icon.svg";
import { nunito } from "@/lib/fonts";

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

interface PropertyMediaGridProps {
  media: MediaItem[];
}

export default function PropertyMediaGrid({ media }: PropertyMediaGridProps) {
  return (
    <div className="bg-white p-6 lg:p-8">
      <h2
        className={`${nunito.className} mb-6 text-3xl font-bold text-black lg:text-4xl`}
      >
        Property Images & Video
      </h2>

      {media.length === 0 ? (
        <div
          className={`${nunito.className} rounded-[5px] border border-dashed border-[#4747474D] bg-[#F8F9FA] px-6 py-12 text-center`}
        >
          <p className="text-[18px] font-semibold text-[#444444]">
            No images or videos available
          </p>
          <p className="mt-1 text-sm text-gray-400">
            This property does not have media uploaded yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {media.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Image
                src={
                  item.thumbnail || item.url || "/images/media-placeholder.jpg"
                }
                alt={`Property ${item.type} ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgH3vK8AAAAASUVORK5CYII="
              />

              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/50">
                  <Image
                    src={playIcon}
                    alt="Play video"
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>
              )}

              <div
                className={`${nunito.className} absolute top-0 right-0 left-0 z-10 flex h-10 items-center justify-center bg-gradient-to-b from-[#0D80E1] to-[#085799] text-[15px] font-semibold tracking-wide text-white lg:text-[16px]`}
              >
                {item.type === "video" ? "Video" : "Image"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}