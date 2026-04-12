"use client";

import { useState } from "react";
import Image from "next/image";
import { nunito } from "@/lib/fonts";

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

export default function NewsBlogForm({
  initialData,
  loading = false,
  onSubmit,
}: NewsBlogFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialData?.media ?? []);

  const [submitting, setSubmitting] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newPreviews: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          newPreviews.push(reader.result as string);

          if (newPreviews.length === files.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        }
      };

      reader.readAsDataURL(file);
    });

    setMediaFiles((prev) => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

const handleSubmit = async () => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);

  mediaFiles.forEach((file) => {
    if (file.type.startsWith("image")) {
      formData.append("images", file);
    } else if (file.type.startsWith("video")) {
      formData.append("videos", file);
    }
  });

  try {
    setSubmitting(true);

    await onSubmit(formData);

    // ✅ THIS IS THE MAIN FIX (RESET FORM)
    setTitle("");
    setDescription("");
    setMediaFiles([]);
    setPreviews([]);
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
            {previews.length > 0
              ? `${previews.length} File${previews.length > 1 ? "s" : ""} Selected`
              : "No File Chosen"}
          </span>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {previews.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded border"
              >
                {src.endsWith(".mp4") ? (
                  <video
                    src={src}
                    className="h-full w-full object-cover"
                    controls
                  />
                ) : (
                  <Image
                    src={src}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                )}

                <button
                  onClick={() => removeMedia(index)}
                  type="button"
                  className="absolute top-0 right-0 h-7 w-7 rounded-full bg-red-600 text-white"
                >
                  ✕
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
        {submitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
