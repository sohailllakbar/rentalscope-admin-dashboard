// lib/cache/propertyCache.ts

import { Property } from "@/types/property";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const propertyCache = new Map<string, CacheEntry<Property[]>>();

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function getPropertyCache(key: string): Property[] | null {
  const cached = propertyCache.get(key);

  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;

  return isValid ? cached.data : null;
}

export function setPropertyCache(key: string, data: Property[]) {
  propertyCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearPropertyCache() {
  propertyCache.clear();
}