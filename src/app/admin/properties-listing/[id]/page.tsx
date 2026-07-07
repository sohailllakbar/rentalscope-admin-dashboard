"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import PageHeader from "@/components/common/PageHeader";
import PropertyImageBox from "@/components/common/PropertyImageBox";
import PropertyInfoBox from "@/components/common/PropertyInfoBox";
import PropertyMediaGrid from "@/components/common/PropertyMediaGrid";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/apiHelper/api";
import EmptyState from "@/components/common/EmptyState";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

const BASE_URL = "https://tenanttrust.appistansoft.com";

type MediaItem = {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
};

interface PropertyDetail {
  id: number;
  title: string;
  propertyType: string;
  saleOrRent: string;
  paymentFrequency: string;
  amount: string;
  bedrooms: number;
  bathrooms: number;
  startDate: string;
  endDate: string;
  rentDeadline: string;
  description: string;
  amenities: string | string[] | null;
  images: string | string[] | null;
  landlord?: {
    name?: string;
  };
}

function parseStringArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }

    if (typeof parsed === "string") {
      return parseStringArray(parsed);
    }
  } catch {
    return trimmed
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((item) => item.replace(/^"|"$/g, "").trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeMediaUrl(file: string) {
  if (file.startsWith("http")) return file;
  if (file.startsWith("/uploads/")) return `${BASE_URL}${file}`;
  if (file.startsWith("uploads/")) return `${BASE_URL}/${file}`;
  if (file.startsWith("/")) return `${BASE_URL}${file}`;
  return `${BASE_URL}/uploads/${file}`;
}

function isVideo(file: string) {
  return /\.(mp4|mov|webm|avi|mkv)$/i.test(file);
}

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!property) return;

    try {
      setConfirmLoading(true);

      await apiRequest(`/api/properties/property/delete/${property.id}`, {
        method: "DELETE",
      });

      toast.success("Property deleted successfully");

      router.push("/admin/properties-listing");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete property",
      );
    } finally {
      setIsModalOpen(false);
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const result = await apiRequest("/api/properties/properties/getall");
        const list = Array.isArray(result.data) ? result.data : [];

        const found = list.find(
          (p: PropertyDetail) => Number(p.id) === Number(id),
        );

        setProperty(found || null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load property details");
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <DashboardLoading />
      </div>
    );
  }

  if (!property) {
    return (
      <EmptyState image="/logos/no-data-image.svg" title="Property not found" />
    );
  }

  const images = parseStringArray(property.images);
  const amenities = parseStringArray(property.amenities);
  const firstImage = images.find((file) => !isVideo(file));

  const mainImage = firstImage ? normalizeMediaUrl(firstImage) : placeholderImage.src;

  const media: MediaItem[] = images.map((file) => ({
    type: isVideo(file) ? "video" : "image",
    url: normalizeMediaUrl(file),
  }));

  return (
    <div className="min-h-screen bg-[#F5F6FA] pt-2 pr-6">
      <PageHeader title="Property Details" />

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[auto_1fr] lg:gap-6">
        <div className="min-w-0 lg:col-span-1">
          <PropertyImageBox
            mainImage={mainImage}
            propertyName={property.title}
            createdBy={{
              name: property.landlord?.name || "Unknown",
              avatar: "https://i.pravatar.cc/150",
            }}
          />
        </div>

        <div className="lg:col-span-2 lg:col-start-2">
          <PropertyInfoBox
            propertyName={property.title}
            propertyFor={property.saleOrRent === "Rent" ? "Rent" : "Sale"}
            paymentFrequency={property.paymentFrequency}
            rentAmount={property.amount}
            propertyType={property.propertyType}
            bedrooms={property.bedrooms}
            washrooms={property.bathrooms}
            startTenancy={property.startDate}
            endTenancy={property.endDate}
            paymentDeadline={property.rentDeadline}
            description={property.description}
            amenities={amenities}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <div className="mt-4">
        <PropertyMediaGrid media={media} />
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        isLoading={confirmLoading}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to decline "${property?.title}"?`}
        confirmText="Yes"
        cancelText="Cancel"
      />
    </div>
  );
}