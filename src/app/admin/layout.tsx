"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/AdminSidebar"; // or "@/components/layout/Sidebar" — use your actual path
import { isAuthenticated } from "@/lib/auth";
import { Menu, X } from "lucide-react"; // ← for hamburger & close icons
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const ADMIN_PREFETCH_ROUTES = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/tenants-listing",
  "/admin/landlords-listing",
  "/admin/properties-listing",
  "/admin/managers",
  "/admin/amenities-listing",
  "/admin/properties-requests",
  "/admin/news-blogs",
  "/admin/tem-version-controle",
  "/admin/help-requests",
  "/admin/change-password",
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    if (!auth) {
      router.replace("/login");
    }

    // defer state update to avoid synchronous setState warning
    queueMicrotask(() => {
      setReady(true);
    });

    if (auth) {
      ADMIN_PREFETCH_ROUTES.forEach((href) => {
        router.prefetch(href);
      });
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <DashboardLoading />
      </div>
    );
  }
  // After mount + check: if still here, user is authenticated
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#F5F6FA]">
      {/* Mobile Hamburger Button – only visible on small screens */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md text-[#0D80E1] hover:bg-gray-100 transition md:hidden"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar – fixed on desktop, sliding drawer on mobile */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Backdrop – dark overlay when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <main
        className={`flex-1 overflow-y-auto pt-16 pb-6 pl-7 transition-all duration-300 md:pt-3 ${
          isMobileMenuOpen ? "md:ml-72" : ""
        } `} 
      >
        {children}
      </main>
    </div>
  );
}    


