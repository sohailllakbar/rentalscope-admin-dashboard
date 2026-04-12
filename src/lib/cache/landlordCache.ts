// lib/cache/landlordCache.ts

import { Landlord } from "@/types/landlord";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const landlordCache = new Map<string, CacheEntry<Landlord[]>>();

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/* ============================
   GET CACHE
============================ */
export function getLandlordCache(key: string): Landlord[] | null {
  const cached = landlordCache.get(key);

  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;

  return isValid ? cached.data : null;
}

/* ============================
   SET CACHE
============================ */
export function setLandlordCache(key: string, data: Landlord[]) {
  landlordCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/* ============================
   CLEAR CACHE
============================ */
export function clearLandlordCache() {
  landlordCache.clear();
}