"use client";

import { useState } from "react";
import Image from "next/image";
import { nunito } from "@/lib/fonts";

const BASE_URL = "https://tenanttrust.appistansoft.com";
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];

type MediaType = "image" | "video";

type ExistingMediaItem = {
  id: string;
  kind: "existing";
  original: string;
  src: string;
  mediaType: MediaType;
};

type NewMediaItem = {
  id: string;
  kind: "new";
  file: File;
  src: string;
  mediaType: MediaType;
};

type MediaItem = ExistingMediaItem | NewMediaItem;

interface NewsBlogData {
  title: string;
  description: string;
  media?: string[];
}

interface NewsBlogFormProps {
  initialData?: NewsBlogData;
  loading?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

function cleanMediaValue(value: string) {
  return value.trim().replace(/^"|"$/g, "");
}

function isVideoSource(value: string) {
  const cleanValue = cleanMediaValue(value).split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => cleanValue.endsWith(extension));
}

function normalizeMediaUrl(value: string, mediaType: MediaType) {
  const cleanValue = cleanMediaValue(value);

  if (!cleanValue) return cleanValue;
  if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://")) {
    return cleanValue;
  }

  const withoutSlash = cleanValue.replace(/^\/+/, "");
  if (withoutSlash.startsWith("uploads/")) {
    return `${BASE_URL}/${withoutSlash}`;
  }

  if (mediaType === "video") {
    return `${BASE_URL}/uploads/videos/${withoutSlash.replace(/^videos\//, "")}`;
  }

  return `${BASE_URL}/uploads/${withoutSlash}`;
}

function createExistingMediaItems(media: string[] = []): ExistingMediaItem[] {
  return media
    .map(cleanMediaValue)
    .filter(Boolean)
    .map((item, index) => {
      const mediaType: MediaType = isVideoSource(item) ? "video" : "image";

      return {
        id: `existing-${index}-${item}`,
        kind: "existing",
        original: item,
        src: normalizeMediaUrl(item, mediaType),
        mediaType,
      };
    });
}

function appendJsonAliases(formData: FormData, names: string[], values: string[]) {
  const jsonValue = JSON.stringify(values);
  names.forEach((name) => formData.append(name, jsonValue));
}

export default function NewsBlogForm({
  initialData,
  loading = false,
  onSubmit,
}: NewsBlogFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() =>
    createExistingMediaItems(initialData?.media),
  );

  const [submitting, setSubmitting] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const newItems = files.map<NewMediaItem>((file, index) => ({
      id: `new-${Date.now()}-${index}-${file.name}`,
      kind: "new",
      file,
      src: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video") ? "video" : "image",
    }));

    setMediaItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const removeMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    const existingImages = mediaItems
      .filter(
        (item): item is ExistingMediaItem =>
          item.kind === "existing" && item.mediaType === "image",
      )
      .map((item) => item.original);

    const existingVideos = mediaItems
      .filter(
        (item): item is ExistingMediaItem =>
          item.kind === "existing" && item.mediaType === "video",
      )
      .map((item) => item.original);

    mediaItems.forEach((item) => {
      if (item.kind !== "new") return;

      if (item.mediaType === "image") {
        formData.append("images", item.file);
      } else {
        formData.append("videos", item.file);
      }
    });

    appendJsonAliases(formData, ["existingImages", "imagesToKeep"], existingImages);
    appendJsonAliases(formData, ["existingVideos", "videosToKeep"], existingVideos);
    appendJsonAliases(formData, ["existingMedia", "mediaToKeep"], [
      ...existingImages,
      ...existingVideos,
    ]);
    formData.append("clearImages", existingImages.length === 0 ? "true" : "false");
    formData.append("clearVideos", existingVideos.length === 0 ? "true" : "false");

    try {
      setSubmitting(true);

      await onSubmit(formData);

      setTitle("");
      setDescription("");
      setMediaItems([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${nunito.className} space-y-8 p-8`}>
      {/* Title */}
      <div className="space-y-2">
        <label className="block text-[22px] font-bold">News/Blog Title</label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          className="h-12 w-full rounded-[5px] border border-black px-5 py-9 text-base"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-[22px] font-bold">Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Enter Description"
          className="w-full resize-none rounded-[5px] border border-black px-5 py-4"
        />
      </div>

      {/* Media Upload */}
      <div className="space-y-6">
        <label className="block text-[22px] font-bold">
          Select Images / Videos
        </label>

        <div className="flex h-12 items-center rounded-[5px] border border-black px-5 py-9">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              className="hidden"
            />

            <div className="rounded border bg-gray-200 px-6 py-3 text-[18px]">
              Choose File
            </div>
          </label>

          <span className="ml-5 text-[18px] text-gray-600">
            {mediaItems.length > 0
              ? `${mediaItems.length} File${mediaItems.length > 1 ? "s" : ""} Selected`
              : "No File Chosen"}
          </span>
        </div>

        {mediaItems.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded border"
              >
                {item.mediaType === "video" ? (
                  <video
                    src={item.src}
                    className="h-full w-full object-cover"
                    controls
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt="preview"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    className="object-cover"
                  />
                )}

                <button
                  onClick={() => removeMedia(item.id)}
                  type="button"
                  className="absolute top-0 right-0 h-7 w-7 rounded-full bg-red-600 text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        disabled={loading || submitting}
        onClick={handleSubmit}
        className="cursor-pointer rounded-lg bg-linear-to-b from-[#0D80E1] to-[#085799] px-14 py-3.5 text-[22px] font-bold text-[#FFFFFF] shadow-sm transition-all duration-200 hover:brightness-105 disabled:opacity-60"
      >
        {submitting ? "Saving..." : initialData ? "Update" : "Create"}
      </button>
    </div>
  );
}
