"use client";

import { useState } from "react";
import SaveButton from "@/components/ui/buttons/SaveButton";
import DeleteButton from "@/components/ui/buttons/DeleteButton";
import { nunito } from "@/lib/fonts";

interface Amenity {
  id: number;
  name: string;
}

interface AmenitiesTableRowProps {
  amenity: Amenity;
  index: number;
  currentPage: number;
  entriesPerPage: number;
  onSave: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

export default function AmenitiesTableRow({
  amenity,
  index,
  currentPage,
  entriesPerPage,
  onSave,
  onDelete,
}: AmenitiesTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(amenity.name);

  const serialNumber = (currentPage - 1) * entriesPerPage + index + 1;

  const handleAction = () => {
    if (isEditing) {
      if (editedName.trim() === "") return;
      onSave(amenity.id, editedName.trim());
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const rowBg = isEditing ? "#F2F2F2" : index % 2 === 0 ? "#F2F2F2" : "#FFFFFF";

  return (
    <tr
      style={{ backgroundColor: rowBg }}
      className={`transition-colors ${nunito.className} hover:bg-gray-50`}
    >
      {/* Serial Number */}
      <td className="border border-[#47474733] px-6 py-4 text-center text-[16px] font-medium text-[#444444] md:text-[20px]">
        {serialNumber}
      </td>

      {/* Amenity Name */}
      <td className="border border-[#47474733] px-6 py-4 text-[16px] text-[#444444] md:text-[20px]">
        {isEditing ? (
         <input
  type="text"
  value={editedName}
  onChange={(e) => setEditedName(e.target.value)}
  autoFocus
  aria-label="Edit amenity name"
  className="w-[95%] border border-[#2F2F2F4D] bg-white px-4 py-2.5 text-[16px] font-medium text-gray-900 focus:border-[#0D80E1] focus:ring-1 focus:ring-[#0D80E1]/25 focus:outline-none md:text-[17px]"
/>
        ) : (
          amenity.name
        )}
      </td>

      {/* Edit / Save */}
      <td className="border border-[#47474733] px-6 py-8 text-center">
        <SaveButton
          onClick={handleAction}
          disabled={isEditing && !editedName.trim()}
        >
          {isEditing ? "Save" : "Edit"}
        </SaveButton>
      </td>

      {/* Delete */}
      <td className="border border-[#47474733] px-6 py-4 text-center">
        <DeleteButton onClick={() => onDelete(amenity.id)} />
      </td>
    </tr>
  );
}