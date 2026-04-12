// lib/cache/tenantCache.ts

import { Tenant } from "@/types/tenant";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const tenantCache = new Map<string, CacheEntry<Tenant[]>>();

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/* ============================
   GET CACHE
============================ */
export function getTenantCache(key: string): Tenant[] | null {
  const cached = tenantCache.get(key);

  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;

  return isValid ? cached.data : null;
}

/* ============================
   SET CACHE
============================ */
export function setTenantCache(key: string, data: Tenant[]) {
  tenantCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/* ============================
   CLEAR CACHE (IMPORTANT)
============================ */
export function clearTenantCache() {
  tenantCache.clear();
}