"use client";

import { useState } from "react";
import Image from "next/image";
import { nunito } from "@/lib/fonts";
import PageHeader from "@/components/common/PageHeader";
import { apiRequest } from "@/lib/apiHelper/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddManagerPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [creating, setCreating] = useState(false);

  // ==========================
  // Image Upload
  // ==========================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // ==========================
  // Form Submit
  // ==========================

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !imageFile) {
      toast.error("Name, email, password and profile image are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setCreating(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("profileImage", imageFile);

      const result = await apiRequest("/api/admin/manager/create", {
        method: "POST",
        body: formData,
      });

      toast.success(result.message || "Manager created successfully");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setProfileImage(null);
      setImageFile(null);

      // Small delay for better UX
      setTimeout(() => {
        router.refresh(); // refresh managers page data
        router.push("/admin/managers"); // navigate back
      }, 800);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create manager",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Management Managers" />

      <main
        className={`${nunito.className} flex flex-1 items-start justify-center`}
      >
        <div className="w-full max-w-275">
          <div className="rounded-[5px] bg-[#FFFFFF]">
            {/* Header */}
            <div className="rounded-t-[5px] bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-5">
              <h2 className="text-[24px] font-semibold text-[#FFFFFF]">
                Add New Management Manager
              </h2>
            </div>

            {/* Form */}
            <div className="space-y-8 p-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-[22px] font-bold text-[#000000]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  className="h-12 w-full rounded-[5px] border border-[#000000] px-5 py-9 text-base font-medium placeholder-[#444444] placeholder:text-[22px] focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[22px] font-bold text-[#000000]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="h-12 w-full rounded-[5px] border border-[#000000] px-5 py-9 text-base font-medium placeholder-[#444444] placeholder:text-[22px] focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-[22px] font-bold text-[#000000]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="h-12 w-full rounded-[5px] border border-[#000000] px-5 py-9 text-base font-medium placeholder-[#444444] placeholder:text-[22px] focus:border-[#0E86E8] focus:ring-1 focus:ring-[#0E86E82E] focus:outline-none"
                />
              </div>

              {/* Profile Image */}
              <div className="space-y-6">
                <label className="block text-[22px] font-bold text-[#000000]">
                  Profile Image
                </label>

                <div className="flex h-12 w-full items-center rounded-[5px] border border-[#000000] px-5 py-9">
                  <div className="flex items-center gap-6">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <div className="rounded-[5px] border border-[#767676C2] bg-[#76767670] px-6 py-3 text-[20px] font-medium">
                        Choose File
                      </div>
                    </label>

                    <span className="text-[20px] text-[#444444]">
                      {profileImage ? "Image Selected" : "No File Chosen"}
                    </span>
                  </div>
                </div>

                {/* Preview */}
                {profileImage && (
                  <div className="mt-6">
                    <div className="relative aspect-square max-w-50 overflow-hidden rounded-[5px]">
                      <Image
                        src={profileImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setProfileImage(null);
                          setImageFile(null);
                        }}
                        className="absolute top-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-600 text-white"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  disabled={creating}
                  onClick={handleSubmit}
                  className="rounded-lg bg-linear-to-b from-[#0D80E1] to-[#085799] px-14 py-4 text-[22px] font-bold text-white transition hover:brightness-105 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
