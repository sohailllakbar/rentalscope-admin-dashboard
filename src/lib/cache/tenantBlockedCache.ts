// lib/cache/tenantBlockedCache.ts

import { Tenant } from "@/types/tenant";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const blockedTenantCache = new Map<string, CacheEntry<Tenant[]>>();

const CACHE_TIME = 5 * 60 * 1000;

export function getBlockedTenantCache(key: string): Tenant[] | null {
  const cached = blockedTenantCache.get(key);
  if (!cached) return null;

  return Date.now() - cached.timestamp < CACHE_TIME
    ? cached.data
    : null;
}

export function setBlockedTenantCache(key: string, data: Tenant[]) {
  blockedTenantCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearBlockedTenantCache() {
  blockedTenantCache.clear();
}