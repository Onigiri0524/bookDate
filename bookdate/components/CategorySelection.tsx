"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { DATE_CATEGORIES } from "@/lib/categories";
export function CategorySelection() {
  const { booking, updateBooking, setStep } = useBooking();

  const select = (id: string, label: string, emoji: string) => {
    updateBooking({
      categoryId: id,
      categoryLabel: label,
      categoryEmoji: emoji,
      subcategories: [],
    });
    setStep("subcategory");
  };

  return (
    <motion.section
      className="min-h-screen px-4 py-16 pb-28"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display romance-heading text-center text-3xl font-bold">
          What kind of date are we having? 💫
        </h2>
        <p className="romance-muted mt-2 text-center">
          Pick the vibe — I&apos;ll match the perfect plan
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {DATE_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 30px rgba(255, 105, 180, 0.6)",
              }}
              onClick={() => select(cat.id, cat.label, cat.emoji)}
              className={`glass-card group p-5 text-left transition ${
                booking.categoryId === cat.id
                  ? "glass-card--glow ring-2 ring-pink-400/40"
                  : "hover:border-pink-400/40"
              }`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <p className="romance-heading mt-3 font-semibold">
                {cat.label}
              </p>
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setStep("datetime")}
          className="romance-muted mx-auto mt-8 block text-sm underline"
        >
          ← Back to date & time
        </button>
      </div>
    </motion.section>
  );
}
