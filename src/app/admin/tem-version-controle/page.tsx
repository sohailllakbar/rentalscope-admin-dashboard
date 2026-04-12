"use client";

import { useState, useMemo, useEffect } from "react";

import PageHeader from "@/components/common/PageHeader";
import AddAndFilterControls from "@/components/common/Management Managers/AddAndFilterControls";
import VersionControlTableHeader from "@/components/versioncontrole/VersionControlTableRow";
import VersionControlTableRow from "@/components/versioncontrole/VversionControlTableRow";
import VersionSwitcher from "@/components/version-controle/VersionSwitcher";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import Pagination from "@/components/table/Pagination";
import ErrorState from "@/components/common/ErrorState";

import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/apiHelper/api";

// ✅ TYPES + CACHE
import { Version, ApiVersion, Platform } from "@/types/version";
import { getVersionCache, setVersionCache } from "@/lib/cache/versionCache";

export default function VersionControlPage() {
  const router = useRouter();

  const [versions, setVersions] = useState<Version[]>([]);
  const [activePlatform, setActivePlatform] = useState<Platform>("android");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const entriesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  /* ================================
      FORMAT
  ================================= */
  const formatVersions = (versions: ApiVersion[]): Version[] =>
    versions.map((v) => ({
      id: v.id,
      versionNumber: `Version ${v.versionNumber}`,
      description: v.description,
      releaseDate: new Date(v.releaseDate).toLocaleDateString(),
      status: v.status,
      deviceType: v.deviceType,
    }));

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

    const key = `versions-${activePlatform}-${currentPage}-${debouncedSearch}`;
    const cached = getVersionCache(key);

    if (cached) {
      setVersions(cached);
      setLoading(false);
    }

    const fetchVersions = async () => {
      try {
        const res = await apiRequest(
          `/api/version/versions?deviceType=${activePlatform}`,
        );

        const formatted = formatVersions(res.data);

        if (isMounted) {
          setVersions(formatted);
          setVersionCache(key, formatted);
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load versions",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVersions();

    return () => {
      isMounted = false;
    };
  }, [activePlatform, currentPage, debouncedSearch]);

  /* ================================
      FILTER
  ================================= */
  const filteredVersions = useMemo(() => {
    if (!debouncedSearch.trim()) return versions;

    const term = debouncedSearch.toLowerCase();

    return versions.filter(
      (v) =>
        v.versionNumber.toLowerCase().includes(term) ||
        v.description.toLowerCase().includes(term) ||
        v.releaseDate.toLowerCase().includes(term) ||
        v.status.toLowerCase().includes(term),
    );
  }, [versions, debouncedSearch]);

  /* ================================
      PAGINATION
  ================================= */
  const totalPages = Math.ceil(filteredVersions.length / entriesPerPage);

  const paginatedVersions = filteredVersions.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  /* ================================
      ACTIONS
  ================================= */
  const handleEdit = (id: string | number) => {
    router.push(`/admin/version-control/edit/${id}`);
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
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Version Control" />

      <VersionSwitcher onChange={setActivePlatform} />

      <AddAndFilterControls
        search={search}
        onSearchChange={setSearch}
        onAddClick={() => router.push("/admin/add-version-controle")}
      />

      <div className="overflow-hidden rounded-[5px] bg-[#FFFFFF]">
        <div className="mx-4 my-4 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <VersionControlTableHeader />

            <tbody className="divide-y divide-gray-200">
              {paginatedVersions.length > 0 ? (
                paginatedVersions.map((version, index) => (
                  <VersionControlTableRow
                    key={version.id}
                    version={version}
                    index={index}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    {search
                      ? "No matching versions found"
                      : "No versions found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredVersions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredVersions.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
