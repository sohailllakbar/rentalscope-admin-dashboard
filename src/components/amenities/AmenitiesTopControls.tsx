"use client";

import { FormEvent } from "react";
import AddAmenityButton from "@/components/amenities/AddAmenityButton";
import { nunito } from "@/lib/fonts";

interface AmenitiesTopControlsProps {
  newAmenityName: string;
  onAmenityNameChange: (value: string) => void;
  onAddAmenity: (e: FormEvent<HTMLFormElement>) => void;
  isAddDisabled?: boolean;
  isAdding?: boolean;

  // Note: entries, search props are unused in current JSX → kept for interface compatibility
  entries?: number;
  onEntriesChange?: (value: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export default function AmenitiesTopControls({
  newAmenityName,
  onAmenityNameChange,
  onAddAmenity,
  isAddDisabled = false,
  isAdding = false,
}: AmenitiesTopControlsProps) {
  return (
    <div
      className={`mb-6 rounded-xl border border-gray-200/70 bg-white px-6 pt-6 pb-8 backdrop-blur-[0.5px] transition-all duration-200 md:px-8`}
    >
      <div>
        <h2
          className={`mb-4 text-2xl font-extrabold tracking-tight text-[#0D80E1] md:text-[26px]`}
        >
          Add New Amenity
        </h2>

        <form
          onSubmit={onAddAmenity}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="amenity-name"
              className={` ${nunito.className} mb-2.5 block text-lg font-bold text-gray-900 md:text-[20px]`}
            >
              Amenity Name
            </label>

            <input
              id="amenity-name"
              type="text"
              value={newAmenityName}
              onChange={(e) => onAmenityNameChange(e.target.value)}
              placeholder="Enter Amenity Name"
              disabled={isAdding}
              className={` ${nunito.className} w-full rounded-sm border border-[#00000066] bg-white/70 px-4.5 py-3 text-base font-normal text-gray-900 transition-all duration-200 placeholder:text-gray-400/80 hover:border-gray-500/80 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 md:py-4 md:text-[17px] lg:text-[20px]`}
            />
          </div>

          <div className="sm:self-end">
            <AddAmenityButton
              type="submit"
              disabled={isAddDisabled || isAdding}
              className={`min-w-35 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:min-w-40`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Amenity"
              )}
            </AddAmenityButton>
          </div>
        </form>
      </div>
    </div>
  );
}
