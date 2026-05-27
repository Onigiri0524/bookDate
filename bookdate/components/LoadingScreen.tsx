"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import { CreatorBrand } from "@/components/ui/CreatorBrand";

export function LoadingScreen() {
  const { setStep } = useBooking();

  useEffect(() => {
    const t = setTimeout(() => setStep("proposal"), 2200);
    return () => clearTimeout(t);
  }, [setStep]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-pink-950 via-rose-900 to-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CreatorBrand variant="loading" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-7xl"
      >
        💖
      </motion.div>
      <motion.p
        className="mt-6 font-display text-2xl text-white"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Loading something special for you...
      </motion.p>
      <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
