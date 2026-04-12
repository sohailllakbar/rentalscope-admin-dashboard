"use client";

import DeleteButton from "@/components/common/DeleteButton";
import ApproveButton from "@/components/common/ApproveButton";
import Image from "next/image";
import checktIcon from "@/assets/icons/common/check icon.svg";

// ✅ Better type
type AmenitiesInput = string | string[] | null | undefined;

interface PropertyInfoBoxProps {
  propertyName: string;
  propertyFor: "Rent" | "Sale";
  paymentFrequency: string;
  rentAmount: string;
  propertyType: string;
  bedrooms: number;
  washrooms: number | string;
  startTenancy: string;
  endTenancy: string;
  paymentDeadline: string;
  description: string;
  amenities: AmenitiesInput;
  onDelete?: () => void;
  onApprove?: () => void;
}

export default function PropertyInfoBoxx({
  propertyName,
  propertyFor,
  paymentFrequency,
  rentAmount,
  propertyType,
  bedrooms,
  washrooms,
  startTenancy,
  endTenancy,
  paymentDeadline,
  description,
  amenities,
  onDelete,
  onApprove,
}: PropertyInfoBoxProps) {

  // ✅ CLEAN AMENITIES (same logic as first file)
  const cleanAmenities = getCleanAmenities(amenities);

  // ✅ FORMAT DATE
  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ✅ FORMAT CURRENCY
  function formatCurrency(amount: string | number) {
    const num = Number(amount);

    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;

    return `$${num}`;
  }

  return (
    <div className="border border-gray-200 bg-white p-6 lg:p-8 lg:pb-12">
      <div className="space-y-6 lg:space-y-8">

        {/* Key Details */}

        <div className="grid grid-cols-1 gap-4 lg:gap-5">
          <InfoItem label="Property Name" value={propertyName} />
          <InfoItem label="Property For" value={propertyFor} />
          <InfoItem label="Payment Frequency" value={paymentFrequency} />
          <InfoItem label="Rent Amount" value={formatCurrency(rentAmount)} />
          <InfoItem label="Property Type" value={propertyType} />

          <InfoItem
            label="Bedrooms"
            value={`${bedrooms} Bedroom${bedrooms !== 1 ? "s" : ""}`}
          />

          <InfoItem
            label="Washrooms"
            value={`${washrooms} Washroom${washrooms !== 1 ? "s" : ""}`}
          />

          <InfoItem label="Start Tenancy" value={formatDate(startTenancy)} />
          <InfoItem label="End Tenancy" value={formatDate(endTenancy)} />
          <InfoItem label="Payment Deadline" value={formatDate(paymentDeadline)} />
          <InfoItem label="Description" value={description} />
        </div>

        {/* Amenities */}

        <div>
          <h3 className="mb-4 text-[16px] font-semibold text-[#000000]">
            Amenities:
          </h3>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            {cleanAmenities.length > 0 ? (
              cleanAmenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C8E6FF]">
                    <Image
                      src={checktIcon}
                      alt="Check"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>

                  <span className="text-[16px] font-normal text-[#828282]">
                    {amenity}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-sm text-[#828282]">
                No amenities available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}

      <div className="mt-10 flex justify-center gap-4 pt-8">
        <DeleteButton
          text="Decline Request"
          size="md"
          className="w-full max-w-md"
          onClick={onDelete}
        />

        <ApproveButton
          text="Approve Request"
          size="md"
          className="w-full max-w-md"
          onClick={() => onApprove?.()}
        />
      </div>
    </div>
  );
}

//
// ✅ SAME STRONG CLEANER (COPIED EXACTLY)
//
function getCleanAmenities(input: AmenitiesInput): string[] {
  if (!input) return [];

  let parsed: unknown = input;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item): string => {
      if (typeof item !== "string") return "";

      const value = item.trim();

      if (value.startsWith("[")) {
        try {
          const nested = JSON.parse(value);
          if (Array.isArray(nested)) {
            return typeof nested[0] === "string" ? nested[0].trim() : "";
          }
        } catch {
          return "";
        }
      }

      return value;
    })
    .filter((item) => {
      const lower = item.toLowerCase();

      return (
        item !== "" &&
        lower !== "check" &&
        lower !== "null" &&
        lower !== "undefined" &&
        lower !== "[]" &&
        lower !== '[""]'
      );
    });
}

/* Info Item (UNCHANGED) */

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline gap-3 text-[16px]">
      <span className="min-w-40 whitespace-nowrap font-bold text-[#000000]">
        {label}:
      </span>

      <span className="leading-snug font-medium text-[#828282]">{value}</span>
    </div>
  );
}