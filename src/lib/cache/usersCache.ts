// lib/cache/usersCache.ts

import { User } from "@/types/user"; // 👈 create/export this if not already

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const usersCache = new Map<string, CacheEntry<User[]>>(); // ✅ FIXED

const CACHE_TIME = 5 * 60 * 1000; // 5 min

export function getUsersCache(key: string): User[] | null {
  const cached = usersCache.get(key);

  if (!cached) return null;

  const isValid = Date.now() - cached.timestamp < CACHE_TIME;

  return isValid ? cached.data : null;
}

export function setUsersCache(key: string, data: User[]) {
  usersCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/* Optional (recommended) */
export function clearUsersCache() {
  usersCache.clear();
}