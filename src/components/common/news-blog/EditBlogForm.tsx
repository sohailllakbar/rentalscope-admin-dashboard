"use client";

import NewsBlogForm from "./NewsBlogForm";
import { apiRequest } from "@/lib/apiHelper/api";
import { clearBlogCache } from "@/lib/cache/blogCache";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BlogFormData {
  title: string;
  description: string;
  media: string[];
}

interface Props {
  initialData: BlogFormData;
  id: number;
}

export default function EditBlogForm({ initialData, id }: Props) {
    const router = useRouter();
  
  const handleUpdate = async (formData: FormData) => {

    try {
      const res = await apiRequest(`/api/blogs/blog/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.success) {
        clearBlogCache();
        toast.success("Blog updated successfully");
                router.push("/admin/news-blogs");

      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <NewsBlogForm
      initialData={initialData}
      onSubmit={handleUpdate}
      submitLabel="Update"
      submittingLabel="Updating..."
      resetAfterSubmit={false}
    />
  );
}
