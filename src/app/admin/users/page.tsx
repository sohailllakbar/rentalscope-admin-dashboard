"use client";

import { useState, useEffect, useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import TableControls from "@/components/common/TableControls";
import TableHeader from "@/components/table/TableHeader";
import TableRow, { Column } from "@/components/table/TableRow";
import Pagination from "@/components/table/Pagination";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import ErrorState from "@/components/common/ErrorState";
import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";
import EmptyState from "@/components/common/EmptyState";

// ✅ IMPORT CACHE
import {
  getUsersCache,
  setUsersCache,
  clearUsersCache,
} from "@/lib/cache/usersCache";

const BASE_URL = "https://tenanttrust.appistansoft.com";

type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  image: string;
  role?: string;
  status?: string;
  createdAt?: string;
};

type User = ApiUser;

const userColumns: Column<User>[] = [
  { key: "image", label: "Images", sortable: false, align: "center" },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: true },
  { key: "gender", label: "Gender", sortable: true, align: "center" },
  { key: "address", label: "Address", sortable: true },
  { key: "action", label: "Action", sortable: false, align: "center" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

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
      FETCH USERS (WITH CACHE)
  ================================= */

  useEffect(() => {
    let isMounted = true;

    const key = `users-${currentPage}-${entries}-${debouncedSearch}`;

    const cached = getUsersCache(key);

    // ✅ Show cache instantly
    if (cached) {
      setUsers(cached);
      setLoading(false);
    }

    const fetchUsers = async () => {
      try {
        const json = await apiRequest("/api/admin/users");

        if (!json.success || !Array.isArray(json.data.users)) {
          throw new Error("Invalid response format");
        }

        const formattedUsers: User[] = json.data.users.map((u: ApiUser) => ({
          ...u,
          image: u.image?.startsWith("http")
            ? u.image
            : `${BASE_URL}/${u.image}`,
          gender: u.gender || "—",
          address: u.address || "—",
          status: u.status || "Active",
        }));

        if (isMounted) {
// ✅ FORCE EMPTY
 setUsers([]); 
   setUsersCache(key, formattedUsers); // ✅ cache set
        }
      } catch (err) {
        if (!cached && isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [currentPage, entries, debouncedSearch, token]);

  /* ================================
      SEARCH FILTER
  ================================= */

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch.trim()) return users;

    const term = debouncedSearch.toLowerCase();

    return users.filter((user) =>
      [user.name, user.email, user.phone, user.address, user.gender]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [users, debouncedSearch]);

  const totalPages = Math.ceil(filteredUsers.length / entries);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * entries,
    currentPage * entries,
  );

  /* ================================
      BLOCK CLICK
  ================================= */

  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  /* ================================
      CONFIRM BLOCK
  ================================= */

  const handleConfirmBlock = async () => {
    if (!selectedUser || !token) return;

    try {
      setConfirmLoading(true);

      const isBlocked = selectedUser.status === "Blocked";

      const endpoint = isBlocked
        ? `${BASE_URL}/api/blocks/user/unblock/${selectedUser.id}`
        : `${BASE_URL}/api/blocks/user/block/${selectedUser.id}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Action failed");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: isBlocked ? "Active" : "Blocked" }
            : u,
        ),
      );

      clearUsersCache(); // ✅ invalidate cache

      toast.success(result.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setConfirmLoading(false);
      setIsModalOpen(false);
      setSelectedUser(null);
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
      <ErrorState onRetry={() => window.location.reload()} />
    );
  }

  // ✅ EMPTY STATE (GLOBAL)
if (!filteredUsers || filteredUsers.length === 0) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <EmptyState
        image="/logos/no-data-image.svg"
        title={
          search
            ? "No users match your search"
            : "No users available"
        }
      />
    </div>
  );
}

  /* ================================
      UI (UNCHANGED)
  ================================= */

  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Users List" />

      <TableControls
        entries={entries}
        onEntriesChange={setEntries}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="mt-4 overflow-hidden rounded-[5px] bg-[#FFFFFF]">
        <div className="mx-4 my-10 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <TableHeader columns={userColumns} />

            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  row={user}
                  columns={userColumns}
                  index={index}
                  onAction={(row) => {
                    handleBlockClick(row);
                  }}
                />
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={userColumns.length}
                    className="py-12 text-center text-gray-500"
                  >
                    {search ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredUsers.length}
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
        title={
          selectedUser?.status === "Blocked" ? "Unblock User" : "Block User"
        }
        message={
          selectedUser?.status === "Blocked"
            ? `Are you sure you want to unblock ${selectedUser?.name}?`
            : `Are you sure you want to block ${selectedUser?.name}?`
        }
        confirmText={selectedUser?.status === "Blocked" ? "Unblock" : "Block"}
        cancelText="Cancel"
      />
    </div>
  );
}
