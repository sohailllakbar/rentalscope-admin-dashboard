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
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{
          scale: [0.96, 1.12, 0.96],
          opacity: [0.82, 1, 0.82],
          y: [0, -4, 0],
        }}
        transition={{
          duration: 0.72,
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
          sizes="160px"
          className="drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
}
