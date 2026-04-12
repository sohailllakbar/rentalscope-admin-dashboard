










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

import {
  Tenant,
  ApiTenant,
} from "@/types/tenant";

import {
  getBlockedTenantCache,
  setBlockedTenantCache,
  clearBlockedTenantCache,
} from "@/lib/cache/tenantBlockedCache";

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

export default function TenantsBlockedPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
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

    const key = `blocked-tenants-${debouncedSearch}`;
    const cached = getBlockedTenantCache(key);

    if (cached) {
      setTenants(cached);
      setLoading(false);
    }

    const fetchBlocked = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No token");

        const res = await fetch(`${BASE_URL}/api/admin/blocked-tenants`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("auth_token");
            window.location.href = "/admin/login?error=unauthorized";
            return;
          }
          throw new Error(`Failed: ${res.status}`);
        }

        const json = await res.json();

        const formatted = json.data.tenants.map(
          (t: ApiTenant): Tenant => ({
            ...t,
            image: t.image?.startsWith("http")
              ? t.image
              : `${BASE_URL}/${t.image || "default-profile.jpg"}`,
            gender: t.gender || "—",
            address: t.address || "—",
            status: t.status || "Blocked",
          }),
        );

        if (isMounted) {
          setTenants(formatted);
          setBlockedTenantCache(key, formatted);
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load blocked tenants",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlocked();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

  /* ================================
      FILTER
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
      ].some((val) => String(val).toLowerCase().includes(term)),
    );
  }, [tenants, debouncedSearch]);

  const totalPages = Math.ceil(filteredTenants.length / entries);

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * entries,
    currentPage * entries,
  );

  /* ================================
      ACTION
  ================================= */
  const handleUnblockClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleConfirmUnblock = async () => {
    if (!selectedTenant) return;

    try {
      setConfirmLoading(true);

      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await fetch(
        `${BASE_URL}/api/blocks/tenant/unblock/${selectedTenant.id}`,
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
        throw new Error(result.message || "Failed to unblock tenant");
      }

      setTenants((prev) =>
        prev.filter((t) => t.id !== selectedTenant.id),
      );

      clearBlockedTenantCache(); // ✅ invalidate

      toast.success("Tenant unblocked successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to unblock tenant",
      );
    } finally {
      setIsModalOpen(false);
      setSelectedTenant(null);
      setConfirmLoading(false);
    }
  };

  /* ================================
      STATES
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
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-red-600">Error</div>
          <p className="mb-6 text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Blocked Tenants" />

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
                  onAction={(row) => handleUnblockClick(row)}
                />
              ))}
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
        onConfirm={handleConfirmUnblock}
        isLoading={confirmLoading}
        title="Unblock Tenant"
        message={`Are you sure you want to unblock ${
          selectedTenant?.name || "this tenant"
        }?`}
        confirmText="Yes, Unblock"
        cancelText="Cancel"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />
    </div>
  );
}