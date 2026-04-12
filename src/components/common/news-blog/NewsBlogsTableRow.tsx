"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { nunito } from "@/lib/fonts";
import ActionButton from "@/components/common/news-blog/ActionButton";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

interface Blog {
  id: number;
  index?: number;
  image?: string | null;
  title: string;
  description: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewsBlogsTableRowProps {
  blog: Blog;
  index?: number;
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
}

// Image component
function BlogImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={80}
      height={80}
      quality={95}
      className="h-full w-full object-cover"
      onError={() => setImgSrc(placeholderImage.src)}
    />
  );
}

export default function NewsBlogsTableRow({
  blog,
  onDelete,
  index = 0,
}: NewsBlogsTableRowProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/admin/tem-preview/${blog.id}`);
  };

  const handleEdit = () => {
    router.push(`/admin/news-blogs/edit/${blog.id}`);
  };

  const isEven = index % 2 === 0;
  const bgColor = isEven ? "bg-[#F2F2F2]" : "bg-white";

  const imageSrc =
    blog.image && blog.image.startsWith("http")
      ? blog.image
      : placeholderImage.src;

  function formatDateTime(dateString?: string) {
    if (!dateString) return "-";

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

  const displayDate =
    blog.date ||
    formatDateTime(blog.updatedAt) ||
    formatDateTime(blog.createdAt);

  return (
    <tr
      className={`${bgColor} hover:bg-[#F8F9FA] ${nunito.className} border-b border-gray-200 text-[#000000] transition-colors`}
    >
      {/* Image */}
      <td className="border border-[#4747474D] px-6 py-6 text-center align-middle">
        <div className="flex justify-center">
          <div className="relative h-12 w-12 overflow-hidden rounded-full sm:h-16 sm:w-16">
            <BlogImage src={imageSrc} alt={blog.title} />
          </div>
        </div>
      </td>

      {/* Title */}
      <td
        className="border border-[#4747474D] px-6 py-6 text-left align-middle max-w-60 truncate text-[16px] font-semibold text-[#444444] md:text-[20px]"
        title={blog.title}
      >
        {blog.title}
      </td>

      {/* Description */}
      <td
        className="max-w-60 truncate border border-[#4747474D] px-3 py-3 text-[16px] text-[#444444] font-semibold sm:px-4 sm:py-4 sm:text-[20px]"
        title={blog.description}
      >
        {blog.description}
      </td>

      {/* Date */}
      <td className="border border-[#4747474D] px-6 py-6 text-center align-middle text-[16px] font-medium text-[#444444] md:text-[20px]">
        {displayDate}
      </td>

      {/* Actions */}
      <td className="border border-[#4747474D] px-6 py-6 text-center align-middle">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ActionButton variant="view" onClick={handleView} size="sm">
            View
          </ActionButton>

          <ActionButton variant="edit" onClick={handleEdit} size="sm">
            Edit
          </ActionButton>

          <ActionButton
            variant="delete"
            onClick={() => onDelete(blog.id)}
            size="sm"
          >
            Delete
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}