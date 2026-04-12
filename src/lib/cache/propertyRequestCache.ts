// lib/cache/propertyRequestCache.ts

import { PropertyRequest } from "@/types/propertyRequest";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const requestCache = new Map<string, CacheEntry<PropertyRequest[]>>();

const CACHE_TIME = 5 * 60 * 1000;

export function getRequestCache(key: string): PropertyRequest[] | null {
  const cached = requestCache.get(key);
  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;
  return isValid ? cached.data : null;
}

export function setRequestCache(key: string, data: PropertyRequest[]) {
  requestCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearRequestCache() {
  requestCache.clear();
}