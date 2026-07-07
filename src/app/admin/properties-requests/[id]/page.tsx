"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageHeader from "@/components/common/PageHeader";
import PropertyImageBox from "@/components/common/PropertyImageBox";
import PropertyInfoBoxx from "@/components/common/propertyInfoBoxx";
import PropertyMediaGrid from "@/components/common/PropertyMediaGrid";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

import toast from "react-hot-toast";
import { apiRequest } from "@/lib/apiHelper/api";

const BASE_URL = "https://tenanttrust.appistansoft.com";

type MediaItem = {
  type: "image" | "video";
  url: string;
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
  amenities: string | string[];
  images: string | string[] | null;
  landlord?: {
    name: string;
  };
}

interface PendingRequest {
  id: number;
  property: PropertyDetail;
}

function parseImages(images: string | string[] | null | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;

  try {
    const parsed = JSON.parse(images || "[]");

    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "string") {
      const nested = JSON.parse(parsed);
      return Array.isArray(nested) ? nested : [];
    }
  } catch {}

  return images
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

function parseAmenities(amenities: string | string[]): string[] {
  if (!amenities) return [];

  if (Array.isArray(amenities)) return amenities;

  try {
    const parsed = JSON.parse(amenities);

    if (Array.isArray(parsed)) return parsed;

    if (typeof parsed === "string") {
      return parsed.split(",").map((a) => a.trim());
    }
  } catch {}

  if (typeof amenities === "string") {
    return amenities
      .replace(/"/g, "")
      .split(",")
      .map((a) => a.trim());
  }

  return [];
}

function isVideo(file: string) {
  return file.split("?")[0].toLowerCase().endsWith(".mp4");
}

function normalizeMediaUrl(file: string, type: "image" | "video") {
  if (file.startsWith("http://") || file.startsWith("https://")) return file;

  const cleanFile = file.replace(/^\/+/, "");
  if (cleanFile.startsWith("uploads/")) return `${BASE_URL}/${cleanFile}`;

  if (type === "video") {
    return `${BASE_URL}/uploads/videos/${cleanFile.replace(/^videos\//, "")}`;
  }

  return `${BASE_URL}/uploads/${cleanFile}`;
}

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
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
      setConfirmLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleApproveClick = async () => {
    try {
      await apiRequest("/api/bookings/booking-request/update", {
        method: "PUT",
        body: JSON.stringify({
          requestId: Number(id),
          requestStatus: "Approved",
        }),
      });

      toast.success("Booking request approved successfully");

      router.push("/admin/properties-requests");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve request",
      );
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const result = await apiRequest("/api/properties/properties/pending");

        const foundRequest = result.data.find(
          (req: PendingRequest) => req.id === Number(id),
        );

        if (!foundRequest) {
          setProperty(null);
          return;
        }

        setProperty(foundRequest.property);
      } catch (error) {
        console.error(error);
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
    return <div className="p-10 text-center">Property not found</div>;
  }

  const images = parseImages(property.images);
  const amenities = parseAmenities(property.amenities);
  const firstImage = images.find((file) => !isVideo(file));

  const mainImage = firstImage
    ? normalizeMediaUrl(firstImage, "image")
    : placeholderImage.src;

  const media: MediaItem[] = images.map((file) => {
    const type = isVideo(file) ? "video" : "image";

    return {
      type,
      url: normalizeMediaUrl(file, type),
    };
  });

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-6 md:p-8 lg:p-6">
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
          <PropertyInfoBoxx
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
            onApprove={handleApproveClick}
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
        message={`Are you sure you want to decline "${property.title}"?`}
        confirmText="Yes, decline"
        cancelText="Cancel"
      />
    </div>
  );
}