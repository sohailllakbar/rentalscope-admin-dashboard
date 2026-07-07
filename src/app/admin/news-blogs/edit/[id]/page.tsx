"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import EditBlogForm from "@/components/common/news-blog/EditBlogForm";
import { apiRequest } from "@/lib/apiHelper/api";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

import toast from "react-hot-toast";
interface Blog {
  id: number;
  title: string;
  description: string;
  images?: string | string[] | null;
  videos?: string | string[] | null;
}

interface BlogFormData {
  title: string;
  description: string;
  media: string[];
}

function parseMedia(input: string | string[] | null | undefined): string[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }

  const trimmedInput = input.trim();
  if (!trimmedInput) return [];

  try {
    const parsed = JSON.parse(trimmedInput);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof parsed === "string") {
      return [parsed.trim()].filter(Boolean);
    }
  } catch {}

  return trimmedInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function EditNewsBlogPage() {
  const { id } = useParams();
  const [data, setData] = useState<BlogFormData | null>(null);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await apiRequest("/api/blogs/blog/all");

        const blog = res.data.find((b: Blog) => b.id === Number(id));
        if (!blog) {
          toast.error("Blog not found");
          return;
        }

        const images = parseMedia(blog.images);
        const videos = parseMedia(blog.videos);

        setData({
          title: blog.title,
          description: blog.description,
          media: [...images, ...videos],
        });
      } catch {
        toast.error("Failed to load blog");
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (!data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <DashboardLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-6">
      <PageHeader title="News/Blogs Section" />

      <div className="mx-auto max-w-5xl rounded bg-white">
        <div className="rounded-t bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-5">
          <h2 className="text-2xl font-semibold text-white">Edit News/Blog</h2>
        </div>

        <EditBlogForm id={Number(id)} initialData={data} />
      </div>
    </div>
  );
}
