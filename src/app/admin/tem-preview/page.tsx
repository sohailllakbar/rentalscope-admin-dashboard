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

interface BlogApi {
  id: number;
  title: string;
  description: string;
  date: string;
  images?: string[];
  videos?: string[];
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

export default function BlogDetailPage() {
  const [blog, setBlog] = useState<BlogDetail | null>(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await apiRequest("/api/blogs/blog/all");

        const blogData = res.data.find((b: BlogApi) => b.id === Number(id));
        if (!blogData) {
          toast.error("Blog not found");
          return;
        }

        const media = [
          ...(blogData.images || []).map((img: string) => ({
            type: "image",
            url: img,
          })),
          ...(blogData.videos || []).map((vid: string) => ({
            type: "video",
            url: vid,
          })),
        ];

        setBlog({
          title: blogData.title,
          date: blogData.date,
          content: blogData.description,
          media,
        });
      } catch {
        toast.error("Failed to load blog");
      }
    };

    if (id) fetchBlog();
  }, [id]);




    if (!blog) {
      return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
          <DashboardLoading />
        </div>
      );
    }
  return (
    <div className="min-h-screen bg-[#F5F6FA] p-2">
      <PageHeader title="News/Blogs Section" />

      <div className="flex items-center justify-center">
        <div className="max-w-3xl rounded-[10px] border-2 border-[#00000014] bg-[#FFFFFF] px-8 py-2">
          <div className="mx-auto max-w-2xl">
            <div className="my-8">
              <MediaCarousel media={blog.media} />
            </div>

            <NewsBlogTitle title={blog.title} date={blog.date} />
            <NewsBlogContent content={blog.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
