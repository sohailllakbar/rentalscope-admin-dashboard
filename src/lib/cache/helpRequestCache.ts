// lib/cache/helpRequestCache.ts

import { Request, RequestDetails } from "@/types/helpRequest";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const CACHE_TIME = 5 * 60 * 1000;

// 🔥 separate caches
const listCache = new Map<string, CacheEntry<Request[]>>();
const detailCache = new Map<number, CacheEntry<RequestDetails>>();

export function getHelpListCache(): Request[] | null {
  const cached = listCache.get("help-list");
  if (!cached) return null;

  return Date.now() - cached.timestamp < CACHE_TIME
    ? cached.data
    : null;
}

export function setHelpListCache(data: Request[]) {
  listCache.set("help-list", {
    data,
    timestamp: Date.now(),
  });
}

export function getHelpDetailCache(id: number): RequestDetails | null {
  const cached = detailCache.get(id);
  if (!cached) return null;

  return Date.now() - cached.timestamp < CACHE_TIME
    ? cached.data
    : null;
}

export function setHelpDetailCache(id: number, data: RequestDetails) {
  detailCache.set(id, {
    data,
    timestamp: Date.now(),
  });
}

export function clearHelpCache() {
  listCache.clear();
  detailCache.clear();
}