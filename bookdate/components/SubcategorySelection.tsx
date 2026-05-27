"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { getCategoryById } from "@/lib/categories";
import { GlassCard } from "@/components/ui/GlassCard";

export function SubcategorySelection() {
  const { booking, updateBooking, setStep } = useBooking();
  const category = getCategoryById(booking.categoryId);

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <button
          type="button"
          className="romantic-btn-yes rounded-full px-6 py-3"
          onClick={() => setStep("category")}
        >
          Pick a category first 💕
        </button>
      </div>
    );
  }

  const toggle = (item: string) => {
    const list = booking.subcategories.includes(item)
      ? booking.subcategories.filter((s) => s !== item)
      : [...booking.subcategories, item];
    updateBooking({ subcategories: list });
  };

  return (
    <motion.section
      className="min-h-screen px-4 py-16 pb-28"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display romance-heading text-center text-3xl font-bold">
          {category.emoji} {category.label} — pick your favorites!
        </h2>
        <p className="romance-muted mt-2 text-center">Select one or more options</p>

        <GlassCard className="mt-8" glow>
          <div className="flex flex-wrap gap-3">
            {category.subcategories.map((item, i) => {
              const selected = booking.subcategories.includes(item);
              return (
                <motion.button
                  key={item}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => toggle(item)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    selected
                      ? "romance-chip--active shadow-lg shadow-pink-500/30"
                      : "romance-chip"
                  }`}
                >
                  {selected ? "✓ " : ""}
                  {item}
                </motion.button>
              );
            })}
          </div>
        </GlassCard>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setStep("category")}
            className="romance-muted rounded-full px-6 py-3 underline"
          >
            ← Change category
          </button>
          <motion.button
            type="button"
            disabled={booking.subcategories.length === 0}
            onClick={() => setStep("questions")}
            whileHover={{ scale: 1.03 }}
            className="romantic-btn-yes rounded-full px-8 py-3 font-bold disabled:opacity-40"
          >
            Continue 💖
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
