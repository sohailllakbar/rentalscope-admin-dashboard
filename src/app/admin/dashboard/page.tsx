"use client";

import useSWR from "swr";
import StatsCard from "@/components/dashboard/StatsCard";
import PageHeader from "@/components/common/PageHeader";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { dashboardStats } from "@/constants/dashboardStats";
import { apiRequest } from "@/lib/apiHelper/api";

interface DashboardData {
  totalUsers: number;
  activeTenants: number;
  blockedTenants: number;
  activeLandlords: number;
  blockedLandlords: number;
  totalProperties: number;
  activeProperties: number;
  totalAmenities: number;
  propertyRequests: number;
  helpRequests: number;
}

// ✅ SWR fetcher using your apiRequest
const fetcher = async (url: string): Promise<DashboardData> => {
  const res = await apiRequest(url);
  return res.data;
};

export default function Dashboard() {
  // ✅ SWR handles everything (cache + fetch + revalidate)
  const { data, error, isLoading } = useSWR("/api/admin/dashboard", fetcher, {
    revalidateOnFocus: true, // 🔄 refresh when tab focus
  });

  const formatValue = (num?: number) => {
    if (num === undefined || num === null) return "—";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // ✅ Loading State
  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <DashboardLoading />
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <ErrorState
       
        onRetry={() => window.location.reload()}
      />
    );
  }

  // ✅ Empty State
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <EmptyState
          image="/logos/no-data-image.svg"
          title="No dashboard data available"
        />
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={formatValue(data[stat.key as keyof DashboardData])}
            iconSrc={stat.iconSrc}
            bgColor={stat.bgColor}
            iconBgColor={stat.iconBgColor}
            href={stat.href}
          />
        ))}
      </div>
    </div>
  );
}
