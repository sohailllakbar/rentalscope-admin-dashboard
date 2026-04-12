"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import MediaCarousel from "@/components/common/newsBlock/MediaCarousel";
import NewsBlogTitle from "@/components/common/newsBlock/NewsBlogTitle";
import NewsBlogContent from "@/components/common/newsBlock/NewsBlogContent";
import PageHeader from "@/components/common/PageHeader";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

// ✅ FIXED TYPE (added createdAt & updatedAt)
interface BlogApi {
  id: number;
  title: string;
  description: string;
  date?: string; // optional now
  createdAt?: string;
  updatedAt?: string;
  images?: string | string[] | null;
  videos?: string | string[] | null;
}

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface BlogDetail {
  title: string;
  date: string;
  content: string;
  media: MediaItem[];
}

// ✅ MEDIA PARSER
function parseMedia(input: string | string[] | null | undefined): string[] {
  if (!input) return [];

  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch {
      return [];
    }
  }

  return input;
}

// ✅ DATE FORMATTER
function formatDateTime(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogDetail | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await apiRequest("/api/blogs/blog/all");

        const blogData = res.data.find(
          (b: BlogApi) => b.id === Number(id)
        );

        if (!blogData) {
          toast.error("Blog not found");
          return;
        }

        // ✅ MEDIA HANDLING
        const images = parseMedia(blogData.images);
        const videos = parseMedia(blogData.videos);

        const media: MediaItem[] = [
          ...images.map((img) => ({
            type: "image" as const,
            url: img,
          })),
          ...videos.map((vid) => ({
            type: "video" as const,
            url: vid,
          })),
        ];

        // ✅ FIX: USE CREATED/UPDATED DATE
        const finalDate = formatDateTime(
          blogData.date ||
          blogData.updatedAt ||
          blogData.createdAt
        );

        setBlog({
          title: blogData.title,
          date: finalDate,
          content: blogData.description,
          media,
        });

      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog");
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // ✅ LOADING STATE
  if (!blog) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <DashboardLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-2">
      <PageHeader title="News/Blogs Section" />

      <div className="flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-[10px] border-2 border-[#00000014] bg-[#FFFFFF] px-8 py-6">
          <div className="w-full">
            {/* Media */}
            <div className="my-8">
              <MediaCarousel media={blog.media} />
            </div>

            {/* ✅ Title + Date (NOW WORKING) */}
            <NewsBlogTitle
              title={blog.title}
              date={blog.date}
            />
            <hr className="text-[#141E280D] my-4" />

            {/* Content */}
            <NewsBlogContent content={blog.content} />

          </div>
        </div>
      </div>
    </div>
  );
}