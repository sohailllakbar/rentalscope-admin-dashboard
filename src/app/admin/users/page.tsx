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
import toast from "react-hot-toast";
import { setUsersCache, clearUsersCache } from "@/lib/cache/usersCache";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let isMounted = true;
    clearUsersCache();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = window.localStorage.getItem("auth_token");
        const response = await fetch(`${BASE_URL}/api/admin/users`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.message || `Error ${response.status}`);
        }

        const apiUsers = Array.isArray(json.data?.users)
          ? json.data.users
          : Array.isArray(json.users)
            ? json.users
            : Array.isArray(json.data)
              ? json.data
              : [];

        const formattedUsers: User[] = apiUsers.map((u: ApiUser) => ({
          ...u,
          image: u.image?.startsWith("http")
            ? u.image
            : u.image
              ? `${BASE_URL}/${u.image}`
              : "",
          gender: u.gender || "-",
          address: u.address || "-",
          status: u.status || "Active",
        }));

        if (isMounted) {
          setUsers(formattedUsers);
          setUsersCache("users-list", formattedUsers);
        }
      } catch (err) {
        if (isMounted) {
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
  }, []);

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

  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedUser) return;

    const token = window.localStorage.getItem("auth_token");
    if (!token) return;

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

      clearUsersCache();

      toast.success(result.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setConfirmLoading(false);
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <DashboardLoading />
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

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
                    className="px-6 py-14 text-center"
                  >
                    <div className="space-y-1"><p className="text-[18px] font-semibold text-[#444444]">{search.trim() ? `No users found for "${search.trim()}"` : "No users found"}</p><p className="text-sm text-gray-400">Try a different keyword or clear the search.</p></div>
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
