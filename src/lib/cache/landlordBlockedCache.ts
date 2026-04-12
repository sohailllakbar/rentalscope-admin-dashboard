// lib/cache/landlordBlockedCache.ts

import { Landlord } from "@/types/landlord";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const landlordCache = new Map<string, CacheEntry<Landlord[]>>();

const CACHE_TIME = 5 * 60 * 1000;

export function getLandlordCache(key: string): Landlord[] | null {
  const cached = landlordCache.get(key);
  if (!cached) return null;

  return Date.now() - cached.timestamp < CACHE_TIME
    ? cached.data
    : null;
}

export function setLandlordCache(key: string, data: Landlord[]) {
  landlordCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearLandlordCache() {
  landlordCache.clear();
}