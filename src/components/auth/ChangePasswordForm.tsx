"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =============================
  // Update Password
  // =============================

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await apiRequest("/api/admin/update-password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (result.success) {
        toast.success(result.message || "Password updated successfully");

        // Reset fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message || "Password update failed");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F5F6FA]">
      <main className="flex flex-1 items-start justify-center">
        <div className="w-full max-w-275">
          <div className="rounded-[5px] bg-[#FFFFFF]">
            <div className="rounded-[5px] bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-5">
              <h2 className="text-[24px] font-semibold text-[#FFFFFF]">
                Update Password
              </h2>
            </div>

            <div className="space-y-8 p-8">
              {/* Old Password */}
              <div className="space-y-2">
                <label className="block text-[22px] font-bold text-[#000000]">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="h-12 w-full rounded-[5px] border border-[#000000] px-5 py-9 text-base font-medium text-[#111827] placeholder-[#74767a] transition-all duration-150 placeholder:text-[22px] focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-[22px] font-bold text-[#000000]">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 w-full rounded-[5px] border border-[#000000] px-5 py-9 text-base font-medium text-[#111827] placeholder-[#74767a] transition-all duration-150 placeholder:text-[22px] focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-[22px] font-bold text-[#000000]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 w-full rounded-[5px] border border-[#000000] px-5 py-9 text-base font-medium text-[#111827] placeholder-[#74767a] transition-all duration-150 placeholder:text-[22px] focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* Update Button */}
              <div className="pt-4">
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className="cursor-pointer rounded-lg bg-linear-to-b from-[#0D80E1] to-[#085799] px-14 py-3.5 text-[22px] font-bold text-[#FFFFFF] shadow-sm transition-all duration-200 hover:brightness-105 disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
