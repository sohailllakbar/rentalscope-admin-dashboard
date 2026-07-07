"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import NewsBlogForm from "@/components/common/news-blog/NewsBlogForm";
import { apiRequest } from "@/lib/apiHelper/api";
import { clearBlogCache } from "@/lib/cache/blogCache";
import toast from "react-hot-toast";

export default function AddNewsBlogPage() {
  const router = useRouter();

  const handleCreate = async (formData: FormData) => {
    try {
      const response = await apiRequest("/api/blogs/blog/add", {
        method: "POST",
        body: formData,
      });

      if (response.success) {
        clearBlogCache();
        toast.success("Blog created successfully");

        // redirect back to blog list
        router.push("/admin/news-blogs");
      } else {
        toast.error(response.message || "Failed to create blog");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-6">
      <PageHeader title="News/Blogs Section" />

      <div className="mx-auto max-w-5xl rounded bg-white">
        <div className="rounded-t bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-5">
          <h2 className="text-2xl font-semibold text-white">
            Add New News/Blog
          </h2>
        </div>

        <NewsBlogForm
          onSubmit={handleCreate}
          submitLabel="Create"
          submittingLabel="Creating..."
        />
      </div>
    </div>
  );
}
