"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { GlassCard } from "@/components/ui/GlassCard";

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function DateTimePicker() {
  const { booking, updateBooking, setStep } = useBooking();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const days = useMemo(() => {
    const total = getDaysInMonth(viewYear, viewMonth);
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    return { total, firstDay, blanks: Array(firstDay).fill(null) };
  }, [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const selectDate = (day: number) => {
    const iso = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    updateBooking({ date: iso });
  };

  const selectedParts = booking.date ? booking.date.split("-").map(Number) : null;

  const canContinue = booking.date && booking.time;

  return (
    <motion.section
      className="min-h-screen px-4 py-16 pb-28"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
    >
      <div className="mx-auto max-w-2xl">
        <motion.h2
          className="font-display romance-heading text-center text-3xl font-bold sm:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Choose the day we&apos;ll make memories together ✨
        </motion.h2>
        <p className="romance-muted mt-2 text-center">Pick a date & time that works for you</p>

        <GlassCard className="mt-8" glow>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="romance-body rounded-full px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear((y) => y - 1);
                } else setViewMonth((m) => m - 1);
              }}
            >
              ←
            </button>
            <span className="romance-heading font-semibold">{monthLabel}</span>
            <button
              type="button"
              className="romance-body rounded-full px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear((y) => y + 1);
                } else setViewMonth((m) => m + 1);
              }}
            >
              →
            </button>
          </div>

          <div className="romance-muted grid grid-cols-7 gap-1 text-center text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {days.blanks.map((_, i) => (
              <span key={`b-${i}`} />
            ))}
            {Array.from({ length: days.total }, (_, i) => i + 1).map((day) => {
              const isSelected =
                selectedParts?.[0] === viewYear &&
                selectedParts?.[1] === viewMonth + 1 &&
                selectedParts?.[2] === day;
              const cellDate = new Date(viewYear, viewMonth, day);
              const isPast = cellDate < todayStart;

              return (
                <motion.button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDate(day)}
                  whileHover={!isPast ? { scale: 1.1 } : {}}
                  className={`aspect-square rounded-xl text-sm transition ${
                    isSelected
                      ? "bg-gradient-to-br from-pink-500 to-rose-600 font-bold text-white shadow-lg shadow-pink-500/50"
                      : isPast
                        ? "cursor-not-allowed text-white/20"
                        : "romance-body hover:bg-pink-500/20 hover:shadow-[0_0_15px_rgba(255,105,180,0.4)] dark:hover:bg-pink-500/30"
                  }`}
                >
                  {day}
                </motion.button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="mt-6">
          <p className="romance-heading mb-3 font-semibold">Preferred time ⏰</p>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((t) => (
              <motion.button
                key={t}
                type="button"
                onClick={() => updateBooking({ time: t })}
                whileHover={{ scale: 1.05 }}
                className={`rounded-full px-4 py-2 text-sm ${
                  booking.time === t
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/40"
                    : "romance-chip hover:bg-pink-500/15"
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="mt-6">
          <label className="romance-heading mb-2 block font-semibold">
            Timezone (optional) 🌍
          </label>
          <input
            type="text"
            className="romantic-input w-full"
            value={booking.timezone}
            onChange={(e) => updateBooking({ timezone: e.target.value })}
            placeholder="e.g. Asia/Manila"
          />
        </GlassCard>

        <motion.button
          type="button"
          disabled={!canContinue}
          onClick={() => setStep("category")}
          whileHover={canContinue ? { scale: 1.03 } : {}}
          className="romantic-btn-yes mx-auto mt-8 block w-full max-w-md rounded-full py-4 font-bold disabled:opacity-40"
        >
          Continue to Date Vibes 💕
        </motion.button>
      </div>
    </motion.section>
  );
}
