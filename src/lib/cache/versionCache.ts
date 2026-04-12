// lib/cache/versionCache.ts

import { Version } from "@/types/version";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const versionCache = new Map<string, CacheEntry<Version[]>>();

const CACHE_TIME = 5 * 60 * 1000;

export function getVersionCache(key: string): Version[] | null {
  const cached = versionCache.get(key);
  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;
  return isValid ? cached.data : null;
}

export function setVersionCache(key: string, data: Version[]) {
  versionCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearVersionCache() {
  versionCache.clear();
}