// components/layout/Sidebar.tsx
// components/layout/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Your colorful SVG icons from Figma (used when active) ────────────────
import dashboard1 from "@/assets/icons/sidebar/dashbaord1.svg";
import users1 from "@/assets/icons/sidebar/user-colorfull-icon.svg";
import tenants1 from "@/assets/icons/sidebar/tenant-listing1.svg";
import landlords1 from "@/assets/icons/sidebar/landlord1.svg";
import properties1 from "@/assets/icons/sidebar/properties-request1.svg";
import managers1 from "@/assets/icons/sidebar/managment1.svg";
import amenities1 from "@/assets/icons/sidebar/amenties1.svg";
import requests1 from "@/assets/icons/sidebar/help-request1.svg";
import news1 from "@/assets/icons/sidebar/news1.svg";
import version1 from "@/assets/icons/sidebar/version-controle1.svg";
import help1 from "@/assets/icons/sidebar/help-request1.svg";
import change1 from "@/assets/icons/sidebar/change1.svg";
import logout1 from "@/assets/icons/sidebar/logout1.svg";

// ── Your white SVG icons from Figma (used when normal/hover) ──────────────
import dashboard from "@/assets/icons/sidebar/dashboard.svg";
import users from "@/assets/icons/sidebar/user-icon.svg";
import tenants from "@/assets/icons/sidebar/tenant-listing.svg";
import landlords from "@/assets/icons/sidebar/landlord.svg";
import properties from "@/assets/icons/sidebar/active-properties.svg";
import managers from "@/assets/icons/sidebar/managment-manager.svg";
import amenities from "@/assets/icons/sidebar/Amenities-listing.svg";
import requests from "@/assets/icons/sidebar/help-request.svg";
import news from "@/assets/icons/sidebar/news.svg";
import version from "@/assets/icons/sidebar/version-controle.svg";
import help from "@/assets/icons/sidebar/help-request.svg";
import change from "@/assets/icons/sidebar/change-pass.svg";
import logout from "@/assets/icons/sidebar/logout.svg";

// Your real logo
import Logo from "@/assets/logos/common/sidebar-man-logo.webp";

// ── Nav items ────────────────────────────────────────────────────────────
const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    whiteIcon: dashboard,
    colorIcon: dashboard1,
  },
  {
    name: "Users Listing",
    href: "/admin/users",
    whiteIcon: users,
    colorIcon: users1,
  },
  {
    name: "Tenants Listing",
    href: "/admin/tenants-listing",
    whiteIcon: tenants,
    colorIcon: tenants1,
  },
  {
    name: "Landlords Listing",
    href: "/admin/landlords-listing",
    whiteIcon: landlords,
    colorIcon: landlords1,
  },
  {
    name: "Active Properties",
    href: "/admin/properties-listing",
    whiteIcon: properties,
    colorIcon: properties1,
  },
  {
    name: "Management Managers",
    href: "/admin/managers",
    whiteIcon: managers,
    colorIcon: managers1,
  },
  {
    name: "Amenities Listing",
    href: "/admin/amenities-listing",
    whiteIcon: amenities,
    colorIcon: amenities1,
  },
  {
    name: "Properties Requests",
    href: "/admin/properties-requests",
    whiteIcon: requests,
    colorIcon: requests1,
  },
  {
    name: "News/Blogs Section",
    href: "/admin/news-blogs",
    whiteIcon: news,
    colorIcon: news1,
  },
  {
    name: "Version Control",
    href: "/admin/tem-version-controle",
    whiteIcon: version,
    colorIcon: version1,
  },
  {
    name: "Help Requests",
    href: "/admin/help-requests",
    whiteIcon: help,
    colorIcon: help1,
  },
  {
    name: "Change Password",
    href: "/admin/change-password",
    whiteIcon: change,
    colorIcon: change1,
  },
  {
    name: "Logout",
    href: "/admin/logout",
    whiteIcon: logout,
    colorIcon: logout1,
  },
];

type SidebarProps = {
  isMobileOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  isMobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {/* Logo Header */}
      <div className="relative flex items-center justify-center pt-10 pb-8">
        <div className="relative h-28 w-52">
          <Image
            src={Logo}
            alt="Tenant Trust"
            fill
            priority
            sizes="208px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2 divide-y divide-white/15">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={isMobileOpen ? onClose : undefined} // close drawer on mobile nav click
                  className={`group flex items-center gap-3 px-4 py-3 text-[17px] transition-all duration-200 ${
                    isActive
                      ? "bg-white font-bold text-[#0D80E1]"
                      : "bg-white/6 font-semibold text-white hover:bg-white/25"
                  } `}
                >
                  {/* Show colorful icon when active, white when not */}
                  <Image
                    src={isActive ? item.colorIcon : item.whiteIcon}
                    alt={`${item.name} icon`}
                    width={24}
                    height={24}
                    className="h-7 w-7"
                  />
                  <span
                    className={`text-[18px] tracking-wide ${
                      isActive
                        ? "bg-linear-to-b from-[#0D80E1] to-[#085799] bg-clip-text font-bold text-transparent"
                        : "text-white"
                    } `}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  // Mobile version: sliding drawer
  if (isMobileOpen) {
    return (
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[#0D80E1] transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } scrollbar-hide overflow-y-auto`}
      >
        {sidebarContent}
      </div>
    );
  }

  // Desktop version: fixed sidebar (your original behavior)
  return (
    <div className="scrollbar-hide hidden pb-6 md:flex md:h-screen md:min-h-screen md:w-72 md:flex-col md:overflow-y-auto md:bg-[#0D80E1]">
      {sidebarContent}
    </div>
  );
}
