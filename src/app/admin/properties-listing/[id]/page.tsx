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


const BASE_URL = "https://tenanttrust.appistansoft.com";

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
  amenities: string[];
  images: string;
  landlord: {
    name: string;
  };
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
      setConfirmLoading(true); // ✅ START LOADING

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
      setConfirmLoading(false); // ✅ START LOADING
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const result = await apiRequest("/api/properties/properties/getall");

        const found = result.data.find(
          (p: PropertyDetail) => p.id === Number(id),
        );

        setProperty(found || null);
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
    return <EmptyState
      image="/logos/no-data-image.svg"
      title="Property not found"
    />
  }

  const images = JSON.parse(property.images || "[]");

  const mainImage = images.length ? `${BASE_URL}/uploads/${images[0]}` : "";

  const media = images.map((img: string) => ({
    type: "image",
    url: `${BASE_URL}/uploads/${img}`,
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
            amenities={property.amenities}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <div className="mt-4">
        <PropertyMediaGrid media={media} />
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        isLoading={confirmLoading} // ✅ PASS LOADING STATE
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
