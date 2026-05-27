"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useBooking();

  return (
    <motion.button
      type="button"
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-btn fixed right-4 top-4 z-50 rounded-full px-4 py-2 text-sm"
      aria-label="Toggle theme"
    >
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </motion.button>
  );
}
