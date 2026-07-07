"use client";

import { useState, useEffect, useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import TableControls from "@/components/common/TableControls";
import TableHeader from "@/components/table/TableHeader";
import TableRow, { Column } from "@/components/table/TableRow";
import Pagination from "@/components/table/Pagination";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/apiHelper/api";
import ErrorState from "@/components/common/ErrorState";

// ✅ IMPORT TYPES
import { Tenant, ApiTenant } from "@/types/tenant";

// ✅ IMPORT CACHE
import {
  getTenantCache,
  setTenantCache,
  clearTenantCache,
} from "@/lib/cache/tenantCache";

const BASE_URL = "https://tenanttrust.appistansoft.com";

const tenantColumns: Column<Tenant>[] = [
  { key: "image", label: "Images", sortable: false, align: "center" },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: true },
  { key: "gender", label: "Gender", sortable: true, align: "center" },
  { key: "address", label: "Address", sortable: true },
  { key: "action", label: "Action", sortable: false, align: "center" },
];

export default function TenantsListingPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");

  /* ================================
      DEBOUNCE SEARCH
  ================================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================================
      FETCH TENANTS (WITH CACHE)
  ================================= */
  useEffect(() => {
    let isMounted = true;

    const key = `tenants-${currentPage}-${entries}-${debouncedSearch}`;
    const cached = getTenantCache(key);

    // ✅ Show cached data instantly
    if (cached) {
      setTenants(cached);
      setLoading(false);
    }

    const fetchTenants = async () => {
      try {
        const json = await apiRequest("/api/admin/tenants");

        if (!json.success || !json.data?.tenants) {
          throw new Error(json.message || "Invalid response");
        }

        const formatted = json.data.tenants.map(
          (t: ApiTenant): Tenant => ({
            ...t,
            image: t.image?.startsWith("http")
              ? t.image
              : `${BASE_URL}/${t.image}`,
            gender: t.gender || "—",
            address: t.address || "—",
            status: t.status || "Active",
          }),
        );

        if (isMounted) {
          setTenants(formatted);
          setTenantCache(key, formatted); // ✅ set cache
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load tenants",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTenants();

    return () => {
      isMounted = false;
    };
  }, [currentPage, entries, debouncedSearch]);

  /* ================================
      SEARCH FILTER
  ================================= */
  const filteredTenants = useMemo(() => {
    if (!debouncedSearch.trim()) return tenants;

    const term = debouncedSearch.toLowerCase();

    return tenants.filter((tenant) =>
      [
        tenant.name,
        tenant.email,
        tenant.phone,
        tenant.gender,
        tenant.address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [tenants, debouncedSearch]);

  const totalPages = Math.ceil(filteredTenants.length / entries);

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * entries,
    currentPage * entries,
  );

  /* ================================
      ACTIONS
  ================================= */
  const handleActionClick = (tenant: Tenant, action: "block" | "unblock") => {
    setSelectedTenant(tenant);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedTenant) return;

    try {
      setConfirmLoading(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await fetch(
        `${BASE_URL}/api/blocks/tenant/block/${selectedTenant.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to block tenant");
      }

      // ✅ Optimistic UI update
      setTenants((prev) =>
        prev.filter((t) => t.id !== selectedTenant.id),
      );

      clearTenantCache(); // ✅ invalidate cache

      toast.success("Tenant blocked successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Block action failed",
      );
    } finally {
      setIsModalOpen(false);
      setSelectedTenant(null);
      setConfirmLoading(false);
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

  if (error) {
    return (
      <ErrorState  onRetry={() => window.location.reload()} />
    );
  }

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Tenants Listing" />

      <TableControls
        entries={entries}
        onEntriesChange={setEntries}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="mt-4 overflow-hidden rounded-[5px] bg-[#FFFFFF]">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <TableHeader columns={tenantColumns} />

            <tbody className="divide-y divide-gray-200">
              {paginatedTenants.map((tenant, index) => (
                <TableRow
                  key={tenant.id}
                  row={tenant}
                  columns={tenantColumns}
                  index={index}
                  onAction={(row, action) =>
                    handleActionClick(row, action)
                  }
                />
              ))}

              {paginatedTenants.length === 0 && (
                <tr>
                  <td
                    colSpan={tenantColumns.length}
                    className="px-6 py-14 text-center"
                  >
                    <div className="space-y-1"><p className="text-[18px] font-semibold text-[#444444]">{search.trim() ? `No tenants found for "${search.trim()}"` : "No active tenants found"}</p><p className="text-sm text-gray-400">Try a different keyword or clear the search.</p></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredTenants.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredTenants.length}
            entriesPerPage={entries}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBlock}
        isLoading={confirmLoading}
        title={actionType === "block" ? "Block Tenant" : "Unblock Tenant"}
        message={`Are you sure you want to ${actionType} ${
          selectedTenant?.name || "this tenant"
        }?`}
        confirmText={actionType === "block" ? "Yes, Block" : "Yes, Unblock"}
        cancelText="Cancel"
      />
    </div>
  );
}