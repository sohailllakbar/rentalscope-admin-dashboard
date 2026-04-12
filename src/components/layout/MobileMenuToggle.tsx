// components/layout/MobileMenuToggle.tsx
"use client";

import { Menu, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export default function MobileMenuToggle({ isOpen, toggle }: Props) {
  return (
    <button
      onClick={toggle}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-[#0D80E1] hover:bg-gray-100 transition"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  );
}