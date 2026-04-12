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
import ErrorState from "@/components/common/ErrorState";

import { Landlord, ApiLandlord } from "@/types/landlord";

import {
  getLandlordCache,
  setLandlordCache,
  clearLandlordCache,
} from "@/lib/cache/landlordBlockedCache";

const BASE_URL = "https://tenanttrust.appistansoft.com";

const landlordColumns: Column<Landlord>[] = [
  { key: "image", label: "Images", sortable: false, align: "center" },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: true },
  { key: "gender", label: "Gender", sortable: true, align: "center" },
  { key: "address", label: "Address", sortable: true },
  { key: "action", label: "Action", sortable: false, align: "center" },
];

export default function LandlordsBlockedPage() {
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState<Landlord | null>(
    null,
  );

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

    const key = `blocked-landlords-${debouncedSearch}`;
    const cached = getLandlordCache(key);

    if (cached) {
      setLandlords(cached);
      setLoading(false);
    }

    const fetchBlockedLandlords = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No token");

        const res = await fetch(`${BASE_URL}/api/admin/blocked-landlords`, {
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

        const formatted: Landlord[] = json.data.landlords.map(
          (l: ApiLandlord) => ({
            ...l,
            image: l.image
              ? l.image.startsWith("http")
                ? l.image
                : `${BASE_URL}/${l.image}`
              : "/images/default-profile.jpg",
            gender: l.gender || "—",
            address: l.address || "—",
            status: l.status || "Blocked",
          }),
        );

        if (isMounted) {
          setLandlords(formatted);
          setLandlordCache(key, formatted);
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlockedLandlords();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

  /* ================================
      FILTER
  ================================= */
  const filteredLandlords = useMemo(() => {
    if (!debouncedSearch.trim()) return landlords;

    const term = debouncedSearch.toLowerCase();

    return landlords.filter((l) =>
      [l.name, l.email, l.phone, l.gender, l.address].some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
  }, [landlords, debouncedSearch]);

  const totalPages = Math.ceil(filteredLandlords.length / entries);

  const paginatedLandlords = filteredLandlords.slice(
    (currentPage - 1) * entries,
    currentPage * entries,
  );

  /* ================================
      ACTION
  ================================= */
  const handleUnblockClick = (landlord: Landlord) => {
    setSelectedLandlord(landlord);
    setIsModalOpen(true);
  };

  const handleConfirmUnblock = async () => {
    if (!selectedLandlord) return;

    try {
      setConfirmLoading(true);

      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const res = await fetch(
        `${BASE_URL}/api/blocks/landlord/unblock/${selectedLandlord.id}`,
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
        throw new Error(result.message || "Failed");
      }

      setLandlords((prev) => prev.filter((l) => l.id !== selectedLandlord.id));

      clearLandlordCache(); // ✅ invalidate

      toast.success("Landlord unblocked successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsModalOpen(false);
      setConfirmLoading(false);
      setSelectedLandlord(null);
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
      <ErrorState  onRetry={() => window.location.reload()} />
    );
  }

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Blocked Landlords" />

      <TableControls
        entries={entries}
        onEntriesChange={setEntries}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="mt-4 overflow-hidden rounded-[5px] bg-[#FFFFFF]">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <TableHeader columns={landlordColumns} />

            <tbody className="divide-y divide-gray-200">
              {paginatedLandlords.map((landlord, index) => (
                <TableRow
                  key={landlord.id}
                  row={landlord}
                  columns={landlordColumns}
                  index={index}
                  onAction={(row) => handleUnblockClick(row)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredLandlords.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredLandlords.length}
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
        title="Unblock Landlord"
        message={`Are you sure you want to unblock ${
          selectedLandlord?.name || "this landlord"
        }?`}
        confirmText="Yes, Unblock"
        cancelText="Cancel"
      />
    </div>
  );
}
