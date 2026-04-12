"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import PageHeader from "@/components/common/PageHeader";
import TableControls from "@/components/common/TableControls";
import PropertiesRequestsTableRow from "@/components/common/properties-requests/PropertiesRequestsTableRow";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import TableHeader from "@/components/table/TableHeader";
import Pagination from "@/components/table/Pagination";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Column } from "@/components/table/TableRow";

// Helpers
import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

// ✅ TYPES + CACHE
import { PropertyRequest, PropertyRequestAPI } from "@/types/propertyRequest";

import {
  getRequestCache,
  setRequestCache,
  clearRequestCache,
} from "@/lib/cache/propertyRequestCache";

const tenantColumns: Column<PropertyRequest>[] = [
  { key: "image", label: "Images", sortable: false, align: "center" },
  { key: "name", label: "Property Name", sortable: true },
  { key: "description", label: "Description", sortable: true },
  { key: "saleOrRent", label: "Type", sortable: true },
  { key: "action", label: "Action", sortable: false, align: "center" },
];

export default function PropertiesRequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [actionType, setActionType] = useState<"approve" | "decline">(
    "approve",
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

  /* ================================
      DEBOUNCE
  ================================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================================
      FETCH (WITH CACHE)
  ================================= */
  useEffect(() => {
    let isMounted = true;

    const key = `requests-${currentPage}-${debouncedSearch}`;
    const cached = getRequestCache(key);

    if (cached) {
      setRequests(cached);
      setLoading(false);
    }

    const fetchRequests = async () => {
      try {
        const res = await apiRequest("/api/properties/properties/pending");

        const formatted: PropertyRequest[] = res.data.map(
  (req: PropertyRequestAPI) => ({
    id: req.id,
    propertyId: req.propertyId,

    // ✅ ADD THIS LINE
    property: req.property,

    name: req.property?.title || "Unknown Property",
    description: `${
      req.property?.location || "Unknown Location"
    } • Requested by ${req.requestingTenant?.name || "Unknown Tenant"}`,
    saleOrRent: req.property?.saleOrRent || "—",
  }),
);

        if (isMounted) {
          setRequests(formatted);
          setRequestCache(key, formatted);
        }
      } catch (err) {
        if (!cached && isMounted) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to load property requests",
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
  }, [currentPage, debouncedSearch]);

  /* ================================
      FILTER
  ================================= */
  const filteredRequests = useMemo(() => {
    if (!debouncedSearch.trim()) return requests;

    const term = debouncedSearch.toLowerCase();

    return requests.filter(
      (req) =>
        req.name.toLowerCase().includes(term) ||
        req.description.toLowerCase().includes(term) ||
        req.saleOrRent.toLowerCase().includes(term),
    );
  }, [requests, debouncedSearch]);

  /* ================================
      PAGINATION
  ================================= */
  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  /* ================================
      ACTIONS
  ================================= */
  const handleView = (id: number) => {
    router.push(`/admin/properties-requests/${id}`);
  };

  const handleApprove = (id: number) => {
    setSelectedRequestId(id);
    setActionType("approve");
    setIsModalOpen(true);
  };

  const handleDecline = (id: number) => {
    setSelectedRequestId(id);
    setActionType("decline");
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequestId) return;

    try {
      setConfirmLoading(true);

      const endpoint =
        actionType === "approve"
          ? "/api/bookings/booking/requests/approve"
          : "/api/bookings/booking/requests/decline";

      await apiRequest(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ requestId: selectedRequestId }),
      });

      toast.success(
        actionType === "approve"
          ? "Booking request approved"
          : "Booking request declined",
      );

      setRequests((prev) => prev.filter((r) => r.id !== selectedRequestId));

      clearRequestCache(); // ✅ invalidate cache
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setConfirmLoading(false);
      setIsModalOpen(false);
      setSelectedRequestId(null);
    }
  };

  /* ================================
      LOADING
  ================================= */
  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <DashboardLoading />
      </div>
    );
  }

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Properties Requests" />

      <div className="mt-4">
        <TableControls
          entries={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-[5px] bg-[#FFFFFF]">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <TableHeader columns={tenantColumns} />

            <tbody className="divide-y divide-gray-200">
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req, index) => (
                  <PropertiesRequestsTableRow
                    key={req.id}
                    request={req}
                    index={index}
                    onView={handleView}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    {search.trim()
                      ? "No property requests match your search"
                      : "No property requests found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredRequests.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredRequests.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        isLoading={confirmLoading}
        title={
          actionType === "approve"
            ? "Approve Booking Request"
            : "Decline Booking Request"
        }
        message={`Are you sure you want to ${
          actionType === "approve" ? "approve" : "decline"
        } this property booking request?`}
        confirmText={actionType === "approve" ? "Yes, Approve" : "Yes, Decline"}
        cancelText="Cancel"
      />
    </div>
  );
}
