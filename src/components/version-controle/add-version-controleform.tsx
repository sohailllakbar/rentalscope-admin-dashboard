"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/apiHelper/api";
import { clearVersionCache } from "@/lib/cache/versionCache";
import toast from "react-hot-toast";

export default function AddVersionControlPage() {
  const router = useRouter();

  const [versionNumber, setVersionNumber] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ hidden real date input
  const hiddenDateRef = useRef<HTMLInputElement>(null);

  // =============================
  // Create Version
  // =============================
  const handleCreateVersion = async () => {
    if (
      !deviceType ||
      !versionNumber ||
      !releaseDate ||
      !status ||
      !description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const result = await apiRequest("/api/version/version/control/add", {
        method: "POST",
        body: JSON.stringify({
          deviceType,
          versionNumber,
          status,
          releaseDate,
          description,
        }),
      });

      if (result.success) {
        toast.success(result.message || "Version created successfully");
        clearVersionCache();

        setVersionNumber("");
        setReleaseDate("");
        setStatus("");
        setDeviceType("");
        setDescription("");

        setTimeout(() => {
          router.push("/admin/tem-version-controle");
        }, 1000);
      } else {
        toast.error(result.message || "Failed to create version");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F5F6FA]">
      <main className="flex flex-1 items-start justify-center">
        <div className="w-full max-w-275">
          <div className="rounded-[5px] bg-white">
            {/* Header */}
            <div className="rounded-[5px] bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-5">
              <h2 className="text-[24px] font-semibold text-white">
                Add New Version
              </h2>
            </div>

            {/* Form */}
            <div className="space-y-8 p-8">
              {/* Version Number */}
              <div className="space-y-2">
                <label
                  htmlFor="versionNumber"
                  className="block text-[20px] font-bold text-black"
                >
                  Version Number
                </label>

                <input
                  id="versionNumber"
                  type="text"
                  placeholder="Enter Version Number"
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                  className="h-12 w-full rounded border border-black px-4 pr-10 text-base placeholder-gray-400 focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* ✅ Release Date (NO mm/dd/yyyy EVER) */}
              <div className="space-y-2">
                <label
                  htmlFor="releaseDate"
                  className="block text-[20px] font-bold text-black"
                >
                  Release Date
                </label>

                <div
                  className="relative"
                  onClick={() => hiddenDateRef.current?.showPicker()}
                >
                  {/* Visible Input */}
                  <input
                    id="releaseDate"
                    type="text"
                    value={releaseDate}
                    readOnly
                    placeholder="Select date"
                    className="h-12 w-full cursor-pointer rounded border border-black px-4 pr-10 text-base focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                  />

                  {/* Hidden Real Date Input */}
                  <input
                    aria-label="date"
                    type="date"
                    ref={hiddenDateRef}
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="pointer-events-none absolute inset-0 opacity-0"
                  />
                </div>
              </div>

              {/* Version Status */}
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-[20px] font-bold text-black"
                >
                  Version Status
                </label>

                <div className="relative">
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-12 w-full appearance-none rounded border border-black px-4 pr-10 text-base focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                  >
                    <option value="">Select Version Status</option>
                    <option value="latest">Latest</option>
                    <option value="outdated">Outdated</option>
                    <option value="stable">Stable</option>
                    <option value="beta">Beta</option>
                  </select>

                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                    ▼
                  </span>
                </div>
              </div>

              {/* Device Type */}
              <div className="space-y-2">
                <label
                  htmlFor="deviceType"
                  className="block text-[20px] font-bold text-black"
                >
                  Device Type
                </label>

                <div className="relative">
                  <select
                    id="deviceType"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="h-12 w-full appearance-none rounded border border-black px-4 pr-10 text-base focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                  >
                    <option value="">Select Device Type</option>
                    <option value="android">Android Version</option>
                    <option value="ios">IOS Version</option>
                  </select>

                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                    ▼
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-[20px] font-bold text-black"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded border border-black px-4 py-3 text-base placeholder-gray-400 focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* Button */}
              <div className="pt-4">
                <button
                  onClick={handleCreateVersion}
                  disabled={loading}
                  className="cursor-pointer rounded-lg bg-linear-to-b from-[#0D80E1] to-[#085799] px-14 py-3 text-[20px] font-bold text-white transition hover:brightness-105 disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
