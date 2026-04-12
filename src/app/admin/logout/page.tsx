"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { nunito } from "@/lib/fonts";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    // simulate async (optional if API call later)
    setTimeout(() => {
      localStorage.removeItem("auth_token");
      router.replace("/login");
    }, 800);
  };

  return (
    <div
      className={`flex min-h-screen w-full bg-[#F5F6FA] ${nunito.className}`}
    >
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[5px] bg-white shadow-sm">
            {/* Header */}
            <div className="bg-linear-to-b from-[#0D80E1] to-[#085799] px-8 py-9 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-9 w-9 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold text-white">Logout</h1>
            </div>

            {/* Content */}
            <div className="space-y-8 px-10 pt-9 pb-10 text-center">
              <p className="text-[22px] font-medium text-[#000000]">
                Are you absolutely certain you wish to proceed with logging out?
              </p>

              <div className="flex flex-col items-center justify-center gap-5 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="min-w-45 rounded-lg bg-linear-to-b from-[#0D80E1] to-[#085799] px-14 py-3.5 text-[22px] font-bold text-white shadow transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoggingOut ? "Signing you out..." : "Yes, Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
