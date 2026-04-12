// components/common/newsBlock/MediaCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import playIcon from "@/assets/icons/common/video-play-icon.svg";

interface MediaItem {
  type: string; // changed to string (more flexible)
  url: string;
  thumbnail?: string;
}

interface MediaCarouselProps {
  media: MediaItem[];
}

export default function MediaCarousel({ media }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (media.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [media.length, isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPaused(true);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
    setIsPaused(true);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  if (media.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-500 font-medium">No media available</p>
      </div>
    );
  }

  const currentItem = media[currentIndex];
  const isVideo = currentItem.type.toLowerCase() === "video";

  return (
    <div
      className="group relative w-full overflow-hidden rounded-xl bg-white shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-video w-full">
        <Image
          src={currentItem.thumbnail || currentItem.url || "/fallback.jpg"} // fallback if url missing
          alt={`Media ${currentIndex + 1}`}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 80vw"
          quality={85}
          priority={currentIndex === 0}
          loading={currentIndex === 0 ? "eager" : "lazy"}
        />
      </div>

      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:bg-black/50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform group-hover:scale-110">
            <Image
              src={playIcon}
              alt="Play Video"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
        </div>
      )}

      {media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            aria-label="Previous media"
            className="absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all group-hover:opacity-80 hover:bg-black/70 hover:scale-110"
          >
            ←
          </button>
          <button
            onClick={goToNext}
            aria-label="Next media"
            className="absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all group-hover:opacity-80 hover:bg-black/70 hover:scale-110"
          >
            →
          </button>
        </>
      )}

      {media.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {media.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-white shadow-md" : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}