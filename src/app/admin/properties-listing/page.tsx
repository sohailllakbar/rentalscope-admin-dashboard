


"use client";

import { useState, useEffect, useMemo } from "react";

import PageHeader from "@/components/common/PageHeader";
import TableControls from "@/components/common/TableControls";
import PropertiesTableHeader from "@/components/propertieslisting/PropertiesTableHeader";
import PropertiesTableRow from "@/components/propertieslisting/PropertiesTableRow";
import Pagination from "@/components/table/Pagination";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import ErrorState from "@/components/common/ErrorState";

import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

// ✅ IMPORT TYPES + CACHE
import { Property, ApiProperty } from "@/types/property";
import {
  getPropertyCache,
  setPropertyCache,
  clearPropertyCache,
} from "@/lib/cache/propertyCache";

const BASE_URL = "https://tenanttrust.appistansoft.com";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null);

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

    const key = `properties-${currentPage}-${entries}-${debouncedSearch}`;
    const cached = getPropertyCache(key);

    if (cached) {
      setProperties(cached);
      setLoading(false);
    }

    const fetchProperties = async () => {
      try {
        const result = await apiRequest(
          "/api/properties/properties/getall"
        );

        const formatted = result.data.map(
          (p: ApiProperty): Property => {
            let image: string | null = null;

            try {
              let imagesArray: string[] = [];

              // ✅ handle both string and array
              if (typeof p.images === "string") {
                imagesArray = JSON.parse(p.images || "[]");
              } else if (Array.isArray(p.images)) {
                imagesArray = p.images;
              }

              // ✅ find first valid image (ignore videos)
              const firstImage = imagesArray.find(
                (img) => typeof img === "string" && !img.endsWith(".mp4")
              );

              if (firstImage) {
                image = `${BASE_URL}/uploads/${firstImage}`;
              }
            } catch (error) {
              image = null;
            }

            return {
              id: p.id,
              name: p.title,
              description: p.description,
              type: p.saleOrRent === "Rent" ? "For Rent" : "For Sale",
              image, // ✅ final clean image
            };
          }
        );

        if (isMounted) {
          setProperties(formatted);
          setPropertyCache(key, formatted);
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load properties"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [currentPage, entries, debouncedSearch]);

  /* ================================
      FILTER
  ================================= */
  const filteredProperties = useMemo(() => {
    if (!debouncedSearch.trim()) return properties;

    const term = debouncedSearch.toLowerCase();

    return properties.filter((p) =>
      [p.name, p.description, p.type]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [properties, debouncedSearch]);

  const totalPages = Math.ceil(filteredProperties.length / entries);

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * entries,
    currentPage * entries,
  );

  /* ================================
      DELETE
  ================================= */
  const handleDelete = (id: number) => {
    const property = properties.find((p) => p.id === id);
    if (!property) return;

    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;

    try {
      setConfirmLoading(true);

      await apiRequest(
        `/api/properties/property/delete/${selectedProperty.id}`,
        { method: "DELETE" },
      );

      setProperties((prev) =>
        prev.filter((p) => p.id !== selectedProperty.id),
      );

      clearPropertyCache(); // ✅ invalidate cache

      toast.success("Property deleted successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete property",
      );
    } finally {
      setIsModalOpen(false);
      setSelectedProperty(null);
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
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

  /* ================================
      UI (UNCHANGED)
  ================================= */
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 lg:pr-6">
      <PageHeader title="Properties Listing" />

      <TableControls
        entries={entries}
        onEntriesChange={setEntries}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="mt-4 overflow-hidden rounded-[5px] bg-white">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <PropertiesTableHeader />

            <tbody>
              {paginatedProperties.map((property, index) => (
                <PropertiesTableRow
                  key={property.id}
                  property={property}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}

              {paginatedProperties.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    {search
                      ? "No matching properties found"
                      : "No properties found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredProperties.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredProperties.length}
            entriesPerPage={entries}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        isLoading={confirmLoading}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${selectedProperty?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}



