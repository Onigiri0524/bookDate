"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import type { BookingStep } from "@/lib/types";

const STEPS: { id: BookingStep; label: string }[] = [
  { id: "datetime", label: "When" },
  { id: "category", label: "Vibe" },
  { id: "subcategory", label: "Details" },
  { id: "questions", label: "Extras" },
  { id: "summary", label: "Plan" },
];

export function StepNav() {
  const { step } = useBooking();
  const currentIndex = STEPS.findIndex((s) => s.id === step);

  if (currentIndex < 0) return null;

  return (
    <nav className="step-nav fixed bottom-12 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-full px-4 py-2 sm:bottom-14">
      {STEPS.map((s, i) => (
        <div
          key={s.id}
          className={`flex items-center gap-1 text-xs ${
            i <= currentIndex ? "romance-body font-medium" : "romance-muted opacity-50"
          }`}
        >
          <motion.span
            className={`h-2 w-2 rounded-full ${
              i <= currentIndex ? "bg-pink-500" : "bg-current opacity-30"
            }`}
            animate={i === currentIndex ? { scale: [1, 1.4, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="hidden sm:inline">{s.label}</span>
        </div>
      ))}
    </nav>
  );
}
