import { DashboardData } from "@/types/dashboard";

let dashboardCache: DashboardData | null = null;
let lastFetchTime = 0;

const CACHE_TIME = 60 * 60 * 1000;

export function getDashboardCache(): DashboardData | null {
  const now = Date.now();

  if (dashboardCache && now - lastFetchTime < CACHE_TIME) {
    return dashboardCache;
  }

  return null;
}

export function setDashboardCache(data: DashboardData) {
  dashboardCache = data;
  lastFetchTime = Date.now();
}
