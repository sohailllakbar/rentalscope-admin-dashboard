"use client";

import NewsBlogForm from "./NewsBlogForm";
import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateBlogForm() {
  const router = useRouter();

  const handleCreate = async (formData: FormData) => {
    try {
      const res = await apiRequest("/api/blogs/blog/add", {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        toast.success("Blog created successfully");
        router.push("/admin/news-blogs");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to create blog");
    }
  };

  return <NewsBlogForm onSubmit={handleCreate} />;
}