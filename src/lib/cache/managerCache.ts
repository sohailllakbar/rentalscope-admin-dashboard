// lib/cache/managerCache.ts

import { Manager } from "@/types/manager";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const managerCache = new Map<string, CacheEntry<Manager[]>>();

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function getManagerCache(key: string): Manager[] | null {
  const cached = managerCache.get(key);

  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;

  return isValid ? cached.data : null;
}

export function setManagerCache(key: string, data: Manager[]) {
  managerCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearManagerCache() {
  managerCache.clear();
}