"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

import PageHeader from "@/components/common/PageHeader";
import AddAndFilterControls from "@/components/common/Management Managers/AddAndFilterControls";
import ManagersTableHeader from "@/components/common/Management Managers/TableHeader";
import ManagersTableRow from "@/components/common/Management Managers/ManagersTableRow";
import Pagination from "@/components/table/Pagination";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ErrorState from "@/components/common/ErrorState";

import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";
         const BASE_URL = "http://tenanttrust.appistansoft.com/uploads/";

import { Manager, ApiManager } from "@/types/manager";
import {
  getManagerCache,
  setManagerCache,
  clearManagerCache,
} from "@/lib/cache/managerCache";

export default function ManagersPage() {
  const router = useRouter();

  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

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
      FETCH (WITH CACHE)
  ================================= */
  useEffect(() => {
    let isMounted = true;

    const key = `managers-${currentPage}-${debouncedSearch}`;
    const cached = getManagerCache(key);

    if (cached) {
      setManagers(cached);
      setLoading(false);
    }

    const fetchManagers = async () => {
      try {
        const result = await apiRequest("/api/admin/manager/all");

        const formatted: Manager[] = result.data.map((m: ApiManager) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          password: m.password,

avatar: m.profileImage
  ? m.profileImage.startsWith("http")
    ? m.profileImage
    : `${BASE_URL}${m.profileImage}`
  : "/images/default-avatar.png",
          isBlocked: m.isBlocked,
        }));

        if (isMounted) {
          setManagers(formatted);
          setManagerCache(key, formatted);
          setError(null);
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load managers"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchManagers();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch]);

  /* ================================
      FILTER
  ================================= */
  const filteredManagers = useMemo(() => {
    if (!debouncedSearch.trim()) return managers;

    const term = debouncedSearch.toLowerCase();

    return managers.filter((m) =>
      [m.name, m.email].join(" ").toLowerCase().includes(term)
    );
  }, [managers, debouncedSearch]);

  const entries = 10;
  const totalPages = Math.ceil(filteredManagers.length / entries);

  const paginatedManagers = filteredManagers.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  /* ================================
      ACTIONS
  ================================= */
  const handleBlockClick = (manager: Manager) => {
    setSelectedManager(manager);
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedManager) return;

    try {
      setConfirmLoading(true);

      const endpoint = selectedManager.isBlocked
        ? `/api/admin/manager/unblock/${selectedManager.id}`
        : `/api/admin/manager/block/${selectedManager.id}`;

      await apiRequest(endpoint, { method: "PATCH" });

      setManagers((prev) =>
        prev.map((m) =>
          m.id === selectedManager.id ? { ...m, isBlocked: !m.isBlocked } : m
        )
      );

      clearManagerCache();

      toast.success(
        selectedManager.isBlocked
          ? "Manager unblocked successfully"
          : "Manager blocked successfully"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setIsModalOpen(false);
      setConfirmLoading(false);
      setSelectedManager(null);
    }
  };

  /* ================================
      STATES (🔥 FIXED)
  ================================= */

  // ✅ FULL PAGE LOADER
  if (loading && managers.length === 0) {
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

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Managers List" />

      <AddAndFilterControls
        search={search}
        onSearchChange={setSearch}
        onAddClick={() => router.push("/admin/managers/add")}
        addButtonText="Add New Manager"
      />

      <div className="mt-4 overflow-hidden rounded-[5px] bg-[#FFFFFF]">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <ManagersTableHeader />

            <tbody className="divide-y divide-gray-200">
              {paginatedManagers.map((manager, index) => (
                <ManagersTableRow
                  key={manager.id}
                  manager={manager}
                  index={index}
                  onBlock={() => handleBlockClick(manager)}
                />
              ))}

              {paginatedManagers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No managers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredManagers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredManagers.length}
            entriesPerPage={entries}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        isLoading={confirmLoading}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBlock}
        title={selectedManager?.isBlocked ? "Unblock Manager" : "Block Manager"}
        message={
          selectedManager?.isBlocked
            ? "Are you sure you want to unblock this Manager Account?"
            : "Are you sure you want to block this Manager Account?"
        }
        confirmText={selectedManager?.isBlocked ? "Yes, Unblock" : "Yes, Block"}
        cancelText="Cancel"
      />
    </div>
  );
}