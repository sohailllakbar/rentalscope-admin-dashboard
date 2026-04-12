// types/blog.ts

export type Blog = {
  id: number;
  image?: string | null;
  title: string;
  description: string;
  date: string;
};

export type BlogAPI = {
  id: number;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  date: string;
    createdAt: string; // ✅ ADD THIS
  updatedAt: string; // ✅ ADD THIS
};