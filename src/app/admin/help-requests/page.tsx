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

import {
  getHelpListCache,
  setHelpListCache,
  getHelpDetailCache,
  setHelpDetailCache,
} from "@/lib/cache/helpRequestCache";

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
    }

    try {
      const result = await apiRequest(`/api/admin/help-requests/get/${id}`);
      const data = result.data?.[0];
      if (!data) return;

      const request: RequestDetails = {
        id: data.id,
        name: data.requester?.name || data.firstName || "User",
        email: data.email || "N/A",
        subject: data.subject || "No subject",
        feedback: data.feedback || "No message",
        status: data.status,
        reply: data.reply ?? null,
        avatar: `https://i.pravatar.cc/150?u=${data.id}`,
      };

      setSelectedRequest(request);
      setHelpDetailCache(id, request);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id && r.status !== "Read"
            ? { ...r, status: "Read" }
            : r
        )
      );
    } catch (err) {
      if (!cached) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to fetch request details"
        );
      }
    }
  }, []);

  /* =========================
     SEND REPLY
  ========================= */
  const handleSendReply = useCallback(
    async (reply: string) => {
      if (!selectedRequest) return;

      try {
        const result = await apiRequest(
          `/api/admin/help-requests/reply/${selectedRequest.id}`,
          {
            method: "POST",
            body: JSON.stringify({ reply }),
          }
        );

        if (result.success) {
          toast.success("Reply sent successfully");

          const updated = result.data?.[0];
          if (!updated) return;

          const updatedRequest: RequestDetails = {
            ...selectedRequest,
            reply: updated.reply,
            status: updated.status,
          };

          setSelectedRequest(updatedRequest);
          setHelpDetailCache(updated.id, updatedRequest);

          setRequests((prev) =>
            prev.map((r) =>
              r.id === updated.id ? { ...r, status: "Read" } : r
            )
          );
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

        const formatted: Request[] = result.data.map((r: ApiHelpRequest) => ({
          id: r.id,
          name: r.requester?.name || r.firstName || "User",
          email: r.email || "N/A",
          subject: r.subject || "No subject",
          feedback: r.feedback || "No message",
          status: r.status,
          reply: r.reply ?? null,
          avatar: `https://i.pravatar.cc/150?u=${r.id}`,
        }));

        if (!isMounted) return;

        setRequests((prev) => {
          const isSame =
            JSON.stringify(prev) === JSON.stringify(formatted);
          return isSame ? prev : formatted;
        });

        setHelpListCache(formatted);
        setError(null);

        const firstUnread = formatted.find((r) => r.status === "Unread");

        if (firstUnread) {
          handleSelect(firstUnread.id);
        } else if (formatted.length > 0) {
          handleSelect(formatted[0].id);
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
  }, [handleSelect]);

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