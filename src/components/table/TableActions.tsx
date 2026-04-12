// components/table/TableActions.tsx
"use client";

import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";

type TableActionsProps<T extends { status?: string; isBlocked?: boolean }> = {
  row: T;
  onAction?: (row: T, action: "block" | "unblock") => void;
};

export default function TableActions<
  T extends { status?: string; isBlocked?: boolean },
>({ row, onAction }: TableActionsProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"block" | "unblock">("block");

  // Now TypeScript knows these fields exist, no more `any`
  const isBlocked = row.status === "blocked" || row.isBlocked === true;

  const openModal = (action: "block" | "unblock") => {
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (onAction) {
      onAction(row, actionType);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Three dots button */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
          •••
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="ring-opacity-5 absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => openModal(isBlocked ? "unblock" : "block")}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block w-full px-4 py-2 text-left text-sm hover:bg-gray-50`}
                  >
                    {isBlocked ? "Unblock User" : "Block User"}
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${
          isBlocked ? "unblock" : "block"
        } this User Account?`}
        confirmText="Yes"
        cancelText="Cancel"
      />
    </>
  );
}
