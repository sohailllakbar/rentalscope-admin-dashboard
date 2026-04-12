






// components/common/ConfirmationModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { nunito } from "@/lib/fonts";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className={`fixed inset-0 overflow-y-auto ${nunito.className}`}>
          <div className="flex min-h-full items-start justify-center p-3 sm:p-4 pt-14 sm:pt-20 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[95%] sm:max-w-126 transform overflow-hidden rounded-[5px] bg-[#FFFFFF] p-4 sm:p-6 text-left align-middle shadow-2xl transition-all">
                
                <Dialog.Title
                  as="h3"
                  className="text-[16px] sm:text-[20px] leading-6 font-medium text-[#000000]"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-2">
                  <p className="text-[15px] sm:text-[20px] font-medium text-[#000000]">
                    {message}
                  </p>
                </div>

                {/* SAME ORDER — ONLY RESPONSIVE WIDTH + GAP */}
                <div className="mt-6 flex justify-end gap-3 sm:gap-7">
                  
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center rounded-[5px] border border-[#0A5EB8] bg-[#0D80E1] px-6 py-2 text-[16px] sm:text-[20px] font-medium text-white"
                    onClick={onConfirm}
                  >
                    {isLoading ? "Processing..." : confirmText}
                  </button>

                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center rounded-[5px] border border-gray-300 bg-white px-6 py-1.5 text-[16px] sm:text-[20px] font-medium text-[#018EDE] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>

                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}