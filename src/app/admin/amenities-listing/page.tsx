"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import TableControls from "@/components/common/TableControls";
import AmenitiesTopControls from "@/components/amenities/AmenitiesTopControls";
import AmenitiesTableHeader from "@/components/amenities/AmenitiesTableHeader";
import AmenitiesTableRow from "@/components/amenities/AmenitiesTableRow";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import Pagination from "@/components/table/Pagination";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import ErrorState from "@/components/common/ErrorState";

import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

// ✅ TYPES + CACHE
import { Amenity } from "@/types/amenity";
import {
  getAmenityCache,
  setAmenityCache,
} from "@/lib/cache/amenityCache";

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [adding, setAdding] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState("");

  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

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

    const key = `amenities-${currentPage}-${debouncedSearch}`;
    const cached = getAmenityCache(key);

    if (cached) {
      setAmenities(cached);
      setLoading(false);
    }

    const fetchAmenities = async () => {
      try {
        const result = await apiRequest("/api/admin/amenities/getAll");
        const data: Amenity[] = result.data || [];

        if (isMounted) {
          setAmenities(data);
          setAmenityCache(key, data);
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load amenities"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAmenities();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch]);

  /* ================================
      FILTER
  ================================= */
  const filteredAmenities = useMemo(() => {
    if (!debouncedSearch.trim()) return amenities;

    const term = debouncedSearch.toLowerCase();
    return amenities.filter((a) =>
      a.name.toLowerCase().includes(term)
    );
  }, [amenities, debouncedSearch]);

  /* ================================
      PAGINATION
  ================================= */
  const totalPages = Math.ceil(filteredAmenities.length / entries);

  const paginatedAmenities = filteredAmenities.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );
// ✅ ADD THIS HERE
  useEffect(() => {
  const totalPages = Math.ceil(filteredAmenities.length / entries);

  if (currentPage > totalPages) {
    setCurrentPage(totalPages || 1);
  }
}, [filteredAmenities, entries, currentPage]);

  /* ================================
      ADD (🔥 FIXED)
  ================================= */
 const handleAddAmenity = async (e: FormEvent) => {
  e.preventDefault();
  if (!newAmenityName.trim()) return;

  try {
    setAdding(true);

    const res = await apiRequest("/api/admin/amenities/add", {
      method: "POST",
      body: JSON.stringify({ name: newAmenityName.trim() }),
    });

    const newAmenity = res?.data?.[0] || {
      id: Date.now(),
      name: newAmenityName.trim(),
    };

    // ✅ CORRECT DATA NOW
    setAmenities((prev) => [newAmenity, ...prev]);

    setNewAmenityName("");
    setCurrentPage(1);

    toast.success("Amenity added successfully");
  } catch (err) {
    toast.error("Error adding amenity");
  } finally {
    setAdding(false);
  }
};

  /* ================================
      UPDATE (🔥 FIXED)
  ================================= */
  const handleSave = async (id: number, newName: string) => {
    if (!newName.trim()) return;

    try {
      await apiRequest(`/api/admin/amenities/update/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: newName.trim() }),
      });

      // ✅ INSTANT UI UPDATE
      setAmenities((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, name: newName.trim() } : a
        )
      );

      toast.success("Amenity updated successfully");
    } catch (err) {
      toast.error("Error updating amenity");
    }
  };

  /* ================================
      DELETE (🔥 FIXED)
  ================================= */
  const handleDelete = (id: number) => {
    const amenity = amenities.find((a) => a.id === id);
    if (!amenity) return;

    setSelectedAmenity(amenity);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAmenity) return;

    try {
      setConfirmLoading(true);

      await apiRequest(
        `/api/admin/amenities/delete/${selectedAmenity.id}`,
        { method: "DELETE" }
      );

      // ✅ INSTANT UI UPDATE
      setAmenities((prev) =>
        prev.filter((a) => a.id !== selectedAmenity.id)
      );

      toast.success("Amenity deleted successfully");
    } catch (err) {
      toast.error("Error deleting amenity");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedAmenity(null);
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
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Amenities Listing" />

      <AmenitiesTopControls
        newAmenityName={newAmenityName}
        onAmenityNameChange={setNewAmenityName}
        onAddAmenity={handleAddAmenity}
        isAddDisabled={!newAmenityName.trim() || adding}
        isAdding={adding}
        entries={entries}
        onEntriesChange={setEntries}
        search={search}
        onSearchChange={setSearch}
      />

      <TableControls
        entries={entries}
        onEntriesChange={setEntries}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="mt-4 overflow-hidden rounded-[5px] bg-white">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-200 border-collapse">
            <AmenitiesTableHeader />

            <tbody>
              {paginatedAmenities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    {search
                      ? "No matching amenities found"
                      : "No amenities available"}
                  </td>
                </tr>
              ) : (
                paginatedAmenities.map((amenity, index) => (
                  <AmenitiesTableRow
                    key={amenity.id}
                    amenity={amenity}
                    index={index}
                    currentPage={currentPage}
                    entriesPerPage={entries}
                    onSave={handleSave}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredAmenities.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredAmenities.length}
            entriesPerPage={entries}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={confirmLoading}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${selectedAmenity?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}