"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-br from-white via-gray-50 to-gray-100"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: "none" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-44 h-44 md:w-56 md:h-56"
        >
          <Image
            src="/logos/main-logo-rental-scope.webp"
            alt="Tenant Trust Logo"
            fill
            priority
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>

        <p className="mt-6 text-xs tracking-[0.3em] text-gray-400 uppercase">
          Initializing System
        </p>
      </motion.div>
    </motion.div>
  );
}