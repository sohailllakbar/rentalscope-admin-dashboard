"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/common/PageHeader";
import HelpRequestList from "@/components/common/help-request/HelpRequestList";
import HelpRequestDetails from "@/components/common/help-request/HelpRequestDetails";
import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

import DashboardLoading from "@/components/dashboard/DashboardLoading";
import ErrorState from "@/components/common/ErrorState";

import { Request, RequestDetails, ApiHelpRequest } from "@/types/helpRequest";

import {
  getHelpListCache,
  setHelpListCache,
  getHelpDetailCache,
  setHelpDetailCache,
  clearHelpCache,
} from "@/lib/cache/helpRequestCache";

const PLACEHOLDER_AVATAR = "/logos/main-logo-rental-scope.webp";
const BASE_URL = "https://tenanttrust.appistansoft.com";

function normalizeImageUrl(value?: string | null) {
  if (!value) return PLACEHOLDER_AVATAR;

  const trimmed = value.trim();
  if (!trimmed) return PLACEHOLDER_AVATAR;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) return `${BASE_URL}${trimmed}`;

  return `${BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
}

function getPayloadArray(payload: unknown): ApiHelpRequest[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as ApiHelpRequest[];
    if (data && typeof data === "object") return [data as ApiHelpRequest];

    const contacts = (payload as { contacts?: unknown }).contacts;
    if (Array.isArray(contacts)) return contacts as ApiHelpRequest[];
  }

  return [];
}

function getName(data: ApiHelpRequest) {
  return (
    data.requester?.name ||
    data.name ||
    data.firstName ||
    data.email?.split("@")[0] ||
    "User"
  );
}

function formatRequest(data: ApiHelpRequest): Request {
  return {
    id: Number(data.id),
    name: getName(data),
    email: data.email || data.requester?.email || "N/A",
    subject: data.subject || "No subject",
    feedback: data.feedback || data.message || "No message",
    status: data.status === "Read" ? "Read" : "Unread",
    reply: data.reply ?? null,
    avatar: normalizeImageUrl(data.imageProfile || data.requester?.imageProfile),
  };
}

function toRequestDetails(request: Request): RequestDetails {
  return { ...request };
}

export default function HelpRequestsPage() {
  const cachedList = getHelpListCache();

  const [requests, setRequests] = useState<Request[]>(
    Array.isArray(cachedList) ? cachedList : [],
  );

  const [selectedRequest, setSelectedRequest] =
    useState<RequestDetails | null>(null);

  const [loading, setLoading] = useState(!cachedList);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = useCallback(
    async (id: number) => {
      const cached = getHelpDetailCache(id);

      if (cached) {
        setSelectedRequest(cached);
        return;
      }

      const listItem = requests.find((request) => request.id === id);
      if (listItem) {
        const details = toRequestDetails(listItem);
        setSelectedRequest(details);
        setHelpDetailCache(id, details);
      }
    },
    [requests],
  );

  const handleSendReply = useCallback(
    async (reply: string) => {
      if (!selectedRequest) return;

      const trimmedReply = reply.trim();

      try {
        const result = await apiRequest("/api/admin/help-requests/reply", {
          method: "POST",
          body: JSON.stringify({
            helpRequestId: Number(selectedRequest.id),
            reply: trimmedReply,
          }),
        });

        if (result.success) {
          toast.success(result.message || "Reply sent successfully");

          const updatedRequest: RequestDetails = {
            ...selectedRequest,
            reply: trimmedReply,
            status: "Read",
          };

          setSelectedRequest(updatedRequest);
          setHelpDetailCache(selectedRequest.id, updatedRequest);

          setRequests((prev) => {
            const next = prev.map((r) =>
              r.id === selectedRequest.id
                ? { ...r, reply: trimmedReply, status: "Read" as const }
                : r,
            );
            setHelpListCache(next);
            return next;
          });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send reply");
        throw err;
      }
    },
    [selectedRequest],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        const result = await apiRequest("/api/admin/help-requests/getAll");
        const formatted = getPayloadArray(result).map(formatRequest);

        if (!isMounted) return;

        setRequests((prev) => {
          const isSame = JSON.stringify(prev) === JSON.stringify(formatted);
          return isSame ? prev : formatted;
        });

        setHelpListCache(formatted);
        setError(null);

        const firstUnread = formatted.find((r) => r.status === "Unread");

        if (firstUnread) {
          const details = toRequestDetails(firstUnread);
          setSelectedRequest(details);
          setHelpDetailCache(firstUnread.id, details);
        } else if (formatted.length > 0) {
          const details = toRequestDetails(formatted[0]);
          setSelectedRequest(details);
          setHelpDetailCache(formatted[0].id, details);
        } else {
          setSelectedRequest(null);
        }
      } catch (err) {
        const cache = getHelpListCache();
        const hasCache = Array.isArray(cache) && cache.length > 0;

        if (!hasCache && isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch help requests",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    clearHelpCache();
    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading && requests.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <DashboardLoading />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Help Requests" />

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="w-full rounded-[5px] bg-[#FFFFFF] p-4 lg:w-[45%]">
          <HelpRequestList
            requests={requests}
            onSelect={handleSelect}
            selectedId={selectedRequest?.id}
          />
        </div>

        <div className="w-full lg:w-[55%]">
          {selectedRequest ? (
            <HelpRequestDetails
              key={selectedRequest.id + (selectedRequest.reply ?? "")}
              details={selectedRequest}
              onSendReply={handleSendReply}
            />
          ) : (
            <div className="flex h-100 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
              Select a request to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}