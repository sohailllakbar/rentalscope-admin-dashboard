

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

type ErrorStateProps = {
  onRetry?: () => void;
};

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA] p-6">
      <div className="text-center w-full max-w-md space-y-2">

        {/* 🔥 Error Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-95 aspect-square">
            <Image
              src="/logos/error-state.webp"
              alt="Error illustration"
              fill
              priority
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* 🔥 Retry Button */}
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="
              group mx-auto flex h-20 w-20 items-center justify-center
              rounded-3xl bg-[#0057FF] text-white
             
              hover:bg-[#0046cc] hover:shadow-2xl hover:shadow-blue-500/50
              transition-all duration-300
            "
          >
            <RefreshCw
              className="h-12 w-12 transition-transform duration-500 "
            />
          
          </motion.button>
        )}

      </div>
    </div>
  );
}