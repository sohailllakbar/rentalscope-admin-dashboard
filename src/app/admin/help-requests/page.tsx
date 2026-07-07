"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/common/PageHeader";
import HelpRequestList from "@/components/common/help-request/HelpRequestList";
import HelpRequestDetails from "@/components/common/help-request/HelpRequestDetails";
import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

import DashboardLoading from "@/components/dashboard/DashboardLoading";
import ErrorState from "@/components/common/ErrorState";

import {
  Request,
  RequestDetails,
  ApiHelpRequest,
} from "@/types/helpRequest";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

import {
  getHelpListCache,
  setHelpListCache,
  getHelpDetailCache,
  setHelpDetailCache,
  clearHelpCache,
} from "@/lib/cache/helpRequestCache";

const BASE_URL = "https://tenanttrust.appistansoft.com";

function resolveProfileImage(imageProfile?: string | null) {
  if (!imageProfile || typeof imageProfile !== "string") {
    return placeholderImage.src;
  }

  const trimmed = imageProfile.trim();

  if (!trimmed) {
    return placeholderImage.src;
  }

  if (trimmed.startsWith("http") || trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  return `${BASE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

export default function HelpRequestsPage() {
  /* =========================
     STATE
  ========================= */
  const cachedList = getHelpListCache();

  const [requests, setRequests] = useState<Request[]>(
    Array.isArray(cachedList) ? cachedList : []
  );

  const [selectedRequest, setSelectedRequest] =
    useState<RequestDetails | null>(null);

  const [loading, setLoading] = useState(!cachedList); // ✅ only if no cache
  const [error, setError] = useState<string | null>(null);

  /* =========================
     SELECT REQUEST
  ========================= */
  const handleSelect = useCallback(async (id: number) => {
    const cached = getHelpDetailCache(id);

    if (cached) {
      setSelectedRequest(cached);
      return;
    }

    const data = requests.find((request) => request.id === id);
    if (!data) return;

    const request: RequestDetails = {
      id: data.id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      feedback: data.feedback,
      status: data.status,
      reply: data.reply ?? null,
      avatar: data.avatar,
    };

    setSelectedRequest(request);
    setHelpDetailCache(id, request);

  }, [requests]);

  /* =========================
     SEND REPLY
  ========================= */
  const handleSendReply = useCallback(
    async (reply: string) => {
      if (!selectedRequest) return;

      try {
        const result = await apiRequest(
          "/api/admin/help-requests/reply",
          {
            method: "POST",
            body: JSON.stringify({
              helpRequestId: selectedRequest.id,
              reply,
            }),
          },
        );

        if (result.success) {
          toast.success("Reply sent successfully");

          const updatedRequest: RequestDetails = {
            ...selectedRequest,
            reply,
            status: "Read",
          };

          setSelectedRequest(updatedRequest);
          setHelpDetailCache(selectedRequest.id, updatedRequest);

          setRequests((prev) =>
            prev.map((r) =>
              r.id === selectedRequest.id
                ? { ...r, status: "Read", reply }
                : r,
            ),
          );
          clearHelpCache();
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to send reply"
        );
      }
    },
    [selectedRequest]
  );

  /* =========================
     FETCH LIST
  ========================= */
  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        const result = await apiRequest("/api/admin/help-requests/getAll");
        const helpRequests = Array.isArray(result.helpRequests)
          ? result.helpRequests
          : Array.isArray(result.data)
            ? result.data
            : [];

        const formatted: Request[] = helpRequests.map((r: ApiHelpRequest) => ({
          id: r.id,
          name: r.requester?.name || r.firstName || r.name || "User",
          email: r.email || "N/A",
          subject: r.subject || "No subject",
          feedback: r.feedback || "No message",
          status: r.status,
          reply: r.reply ?? null,
          avatar: resolveProfileImage(
            r.imageProfile || r.requester?.imageProfile,
          ),
        }));

        if (!isMounted) return;

        setRequests((prev) => {
          const isSame =
            JSON.stringify(prev) === JSON.stringify(formatted);
          return isSame ? prev : formatted;
        });

        setHelpListCache(formatted);
        setError(null);

        const firstRequest =
          formatted.find((r) => r.status === "Unread") || formatted[0];

        if (firstRequest) {
          const request: RequestDetails = {
            id: firstRequest.id,
            name: firstRequest.name,
            email: firstRequest.email,
            subject: firstRequest.subject,
            feedback: firstRequest.feedback,
            status: firstRequest.status,
            reply: firstRequest.reply ?? null,
            avatar: firstRequest.avatar,
          };

          setSelectedRequest(request);
          setHelpDetailCache(firstRequest.id, request);
        }
      } catch (err) {
        const cache = getHelpListCache();
        const hasCache = Array.isArray(cache) && cache.length > 0;

        if (!hasCache && isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch help requests"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, []);


  /* =========================
     UI
  ========================= */

  // ✅ FULL PAGE LOADER
  if (loading && requests.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <DashboardLoading />
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <ErrorState onRetry={() => window.location.reload()} />
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
