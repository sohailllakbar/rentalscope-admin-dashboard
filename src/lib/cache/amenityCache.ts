// lib/cache/amenityCache.ts

import { Amenity } from "@/types/amenity";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const amenityCache = new Map<string, CacheEntry<Amenity[]>>();

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function getAmenityCache(key: string): Amenity[] | null {
  const cached = amenityCache.get(key);
  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;
  return isValid ? cached.data : null;
}

export function setAmenityCache(key: string, data: Amenity[]) {
  amenityCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearAmenityCache() {
  amenityCache.clear();
}