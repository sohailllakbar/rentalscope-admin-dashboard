import totalUsersIcon from "@/assets/icons/dashboard/users.svg";
import activeTenantsIcon from "@/assets/icons/dashboard/active-tenants.svg";
import blockedTenantsIcon from "@/assets/icons/dashboard/blocked-tenants.svg";
import activeLandlordsIcon from "@/assets/icons/dashboard/active-landlords.svg";
import blockedLandlordsIcon from "@/assets/icons/dashboard/blocked-tenants.svg";
import totalAmenitiesIcon from "@/assets/icons/dashboard/total-amenties.svg";
import activePropertiesIcon from "@/assets/icons/dashboard/active-properties.svg";
import propertiesRequestsIcon from "@/assets/icons/dashboard/properties-requests.svg";
import helpRequestsIcon from "@/assets/icons/dashboard/properties-requests.svg";

export const dashboardStats = [
  {
    key: "totalUsers",
    title: "Total Users",
    iconSrc: totalUsersIcon,
    bgColor: "#27B097",
    iconBgColor: "#1EA38B",
    href: "/admin/users",
  },
  {
    key: "activeTenants",
    title: "Active Tenants",
    iconSrc: activeTenantsIcon,
    bgColor: "#407093",
    iconBgColor: "#36688D",
    href: "/admin/tenants-listing",
  },
  {
    key: "blockedTenants",
    title: "Blocked Tenants",
    iconSrc: blockedTenantsIcon,
    bgColor: "#FF5252",
    iconBgColor: "#EC4747",
    href: "/admin/tenants-blocked",
  },
  {
    key: "activeLandlords",
    title: "Active Landlords",
    iconSrc: activeLandlordsIcon,
    bgColor: "#4671C6",
    iconBgColor: "#3B69C2",
    href: "/admin/landlords-listing",
  },
  {
    key: "blockedLandlords",
    title: "Blocked Landlords",
    iconSrc: blockedLandlordsIcon,
    bgColor: "#DD636E",
    iconBgColor: "#CA5761",
    href: "/admin/landlords-blocked",
  },
  {
    key: "totalAmenities",
    title: "Total Amenities",
    iconSrc: totalAmenitiesIcon,
    bgColor: "#17A2B7",
    iconBgColor: "#1392A4",
    href: "/admin/amenities-listing",
  },
  {
    key: "activeProperties",
    title: "Active Properties",
    iconSrc: activePropertiesIcon,
    bgColor: "#AFC23B",
    iconBgColor: "#9EB031",
    href: "/admin/properties-listing",
  },
  {
    key: "propertyRequests",
    title: "Properties Requests",
    iconSrc: propertiesRequestsIcon,
    bgColor: "#FF9800",
    iconBgColor: "#ED8D00",
    href: "/admin/properties-requests",
  },
  {
    key: "helpRequests",
    title: "Help Requests",
    iconSrc: helpRequestsIcon,
    bgColor: "#018EDE",
    iconBgColor: "#0184CD",
    href: "/admin/help-requests",
  },
];
