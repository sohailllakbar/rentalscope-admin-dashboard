"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      role="status"
      aria-label="Loading dashboard content"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: [0.9, 1.5, 0.9],
          opacity: [0.7, 1, 0.7],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="flex items-center justify-center"
      >
        <Image
          src="/logos/main-logo-rental-scope.webp"
          alt="TenantTrust Logo"
          width={160}
          height={160}
          priority
          className="drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
}