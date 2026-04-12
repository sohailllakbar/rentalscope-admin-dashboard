"use client";

import DeleteButton from "@/components/common/DeleteButton";
import Image from "next/image";
import checktIcon from "@/assets/icons/common/check icon.svg";

// ✅ Better type (no any)
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
  amenities: AmenitiesInput; // ✅ fixed
  onDelete?: () => void;
}

export default function PropertyInfoBox({
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
}: PropertyInfoBoxProps) {

  const cleanAmenities = getCleanAmenities(amenities);

  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatCurrency(amount: string | number) {
    const num = Number(amount);

    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;

    return `$${num}`;
  }


  const isRent = propertyFor === "Rent";

function getFrequencyText(freq: string) {
  if (!freq) return "";

  const f = freq.toLowerCase();

  if (f.includes("year")) return "year";
  if (f.includes("month")) return "month";

  return f; // fallback
}

const formattedAmount = formatCurrency(rentAmount);

// ✅ ONLY add "per month/year" for RENT
const rentDisplay = isRent
  ? `${formattedAmount} per ${getFrequencyText(paymentFrequency)}`
  : formattedAmount;

  return (
    <div className="border border-gray-200 bg-white p-6 lg:p-8 lg:pb-12">
      <div className="space-y-6 lg:space-y-8">

        {/* Key Details */}
        <div className="grid grid-cols-1 gap-4 lg:gap-5">
          <InfoItem label="Property Name" value={propertyName} />
          <InfoItem label="Property For" value={propertyFor} />
          {/* ✅ Amount / Price */}
<InfoItem
  label={isRent ? "Rent Amount" : "Price"}
  value={rentDisplay}
/>

{/* ✅ Payment Frequency ONLY for RENT (REQUIRED) */}
{isRent && (
  <InfoItem
    label="Payment Frequency"
    value={paymentFrequency}
  />
)}
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
        {cleanAmenities.length > 0 && (
          <div>
            <h3 className="mb-4 text-[16px] font-semibold text-[#000000]">
              Amenities:
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
              {cleanAmenities.map((amenity, idx) => (
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
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Delete Button */}
      <div className="mt-10 flex justify-center pt-8">
        <DeleteButton
          text="Decline Request"
          size="md"
          className="w-full max-w-md"
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

//
// ✅ FINAL STRONG CLEANER (handles ALL cases)
//
function getCleanAmenities(input: AmenitiesInput): string[] {
  if (!input) return [];

  let parsed: unknown = input;

  // Step 1: parse if string
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  // Step 2: must be array
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item): string => {
      if (typeof item !== "string") return "";

      const value = item.trim();

      // Handle nested JSON string like "[\"\"]"
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

// InfoItem (unchanged)
function InfoItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  // ❌ hide if empty / null / undefined
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="flex items-baseline gap-3 text-[16px]">
      <span className="min-w-40 font-bold whitespace-nowrap text-[#000000]">
        {label}:
      </span>
      <span className="leading-snug font-medium text-[#828282]">{value}</span>
    </div>
  );
}