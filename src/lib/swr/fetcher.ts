import { apiRequest } from "@/lib/apiHelper/api";

export const swrFetcher = async (endpoint: string) => {
  const res = await apiRequest(endpoint);
  return res.data; // ✅ because your API returns { success, data }
};