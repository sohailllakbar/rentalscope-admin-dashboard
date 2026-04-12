const BASE_URL = "https://tenanttrust.appistansoft.com";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }), // ✅ only if token exists
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // ✅ handle non-json safely
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  // ✅ better error handling
  if (!res.ok || !data.success) {
    throw new Error(data?.message || `Error ${res.status}`);
  }

  return data;
}