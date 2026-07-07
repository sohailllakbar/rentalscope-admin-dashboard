"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/common/PageHeader";
import AddAndFilterControls from "@/components/common/Management Managers/AddAndFilterControls";
import NewsBlogsTableHeader from "@/components/common/news-blog/NewsBlogsTableHeader";
import NewsBlogsTableRow from "@/components/common/news-blog/NewsBlogsTableRow";
import Pagination from "@/components/table/Pagination";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

// âœ… TYPES + CACHE
import { Blog, BlogAPI } from "@/types/blog";
import {
  getBlogCache,
  setBlogCache,
  clearBlogCache,
} from "@/lib/cache/blogCache";

const BASE_URL = "https://tenanttrust.appistansoft.com";

function normalizeBlogImageUrl(image: string) {
  const trimmed = image.trim();

  if (!trimmed) return null;
  if (/\.(mp4|mov|webm|avi|mkv)$/i.test(trimmed)) return null;
  if (trimmed.startsWith("http")) return trimmed;
  if (trimmed.startsWith("/uploads/")) return `${BASE_URL}${trimmed}`;
  if (trimmed.startsWith("uploads/")) return `${BASE_URL}/${trimmed}`;
  if (trimmed.startsWith("/")) return `${BASE_URL}${trimmed}`;

  return `${BASE_URL}/uploads/${trimmed}`;
}

function parseBlogMedia(value: string | string[] | null | undefined): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }

    if (typeof parsed === "string") {
      return parseBlogMedia(parsed);
    }
  } catch {
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getFirstImage(images: string | string[] | null | undefined): string | null {
  for (const image of parseBlogMedia(images)) {
    const normalized = normalizeBlogImageUrl(image);
    if (normalized) return normalized;
  }

  return null;
}
export default function NewsBlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  /* ================================
      DEBOUNCE
  ================================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================================
      FETCH (WITH CACHE)
  ================================= */
  useEffect(() => {
    let isMounted = true;

    const key = `blogs-${currentPage}-${debouncedSearch}`;
    const cached = getBlogCache(key);

    if (cached) {
      setBlogs(cached);
      setLoading(false);
    }

    const fetchBlogs = async () => {
      try {
        const result = await apiRequest("/api/blog/all");

        const formatted: Blog[] = result.data.map((blog: BlogAPI) => ({
          id: blog.id,
          title: blog.title || "", // âœ… FIX
          description: blog.description || "", // âœ… FIX
          image: getFirstImage(blog.images),
          date: blog.date || "", // âœ… FIX
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        }));

        if (isMounted) {
          setBlogs(formatted);
          setBlogCache(key, formatted);
        }
      } catch (err) {
        if (!cached && isMounted) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load blogs",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch]);

  /* ================================
      FILTER (FIXED)
  ================================= */
  const filteredBlogs = useMemo(() => {
    if (!debouncedSearch.trim()) return blogs;

    const term = debouncedSearch.toLowerCase();

    return blogs.filter((b) =>
      [b.title, b.description, b.date]
        .filter(Boolean) // âœ… remove undefined/null
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [blogs, debouncedSearch]);

  /* ================================
      PAGINATION
  ================================= */
  const totalPages = Math.ceil(filteredBlogs.length / entriesPerPage);

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  /* ================================
      ACTIONS
  ================================= */
  const handleView = (id: number) => {
    router.push(`/news-blogs/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/news-blogs/edit/${id}`);
  };

  const handleDeleteClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;

    try {
      setConfirmLoading(true);

      await apiRequest(`/api/blogs/blog/delete/${selectedBlog.id}`, {
        method: "DELETE",
      });

      toast.success("Blog deleted successfully");

      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));

      clearBlogCache();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsModalOpen(false);
      setSelectedBlog(null);
      setConfirmLoading(false);
    }
  };

  /* ================================
      LOADING
  ================================= */
  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <DashboardLoading />
      </div>
    );
  }

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="News/Blogs Section" />

      <AddAndFilterControls
        search={search}
        onSearchChange={setSearch}
        onAddClick={() => router.push("/admin/news-blogs/add")}
        addButtonText="Add New News/Blog"
      />

      <div className="mt-4 overflow-hidden rounded-[5px] bg-[#FFFFFF]">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <NewsBlogsTableHeader />

            <tbody>
              {paginatedBlogs.length > 0 ? (
                paginatedBlogs.map((blog, index) => (
                  <NewsBlogsTableRow
                    key={blog.id}
                    blog={blog}
                    index={index}
                    onDelete={() => handleDeleteClick(blog)}
                    onEdit={() => handleEdit(blog.id)}
                    onView={() => handleView(blog.id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    {search.trim()
                      ? "No blogs match your search"
                      : "No blogs found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredBlogs.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={confirmLoading}
        title="Delete Blog"
        message={`Are you sure you want to delete "${selectedBlog?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}