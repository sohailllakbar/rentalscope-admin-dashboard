// lib/cache/blogCache.ts

import { Blog } from "@/types/blog";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const blogCache = new Map<string, CacheEntry<Blog[]>>();

const CACHE_TIME = 5 * 60 * 1000;

export function getBlogCache(key: string): Blog[] | null {
  const cached = blogCache.get(key);
  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;
  return isValid ? cached.data : null;
}

export function setBlogCache(key: string, data: Blog[]) {
  blogCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearBlogCache() {
  blogCache.clear();
}