"use client";

import { useState, useRef, useEffect } from "react";

type ActionMenuProps = {
  onBlock: () => void;
  isBlocked?: boolean;
};

export default function ActionMenu({
  onBlock,
  isBlocked = false,
}: ActionMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBlockClick = () => {
    setIsMenuOpen(false);
    onBlock(); // ← send action to parent page
  };

  return (
    <div className="relative inline-block" ref={buttonRef}>
      <button
        type="button"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full font-black text-[#444444] hover:bg-gray-100"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="text-5xl leading-none">⋮</span>
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 z-50 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5"
        >
          <button
            onClick={handleBlockClick}
            className="block w-full px-4 py-2 text-left text-[16px] font-medium text-[#272727] hover:bg-gray-50"
          >
            {isBlocked ? "Unblock User" : "Block User"}
          </button>
        </div>
      )}
    </div>
  );
}
