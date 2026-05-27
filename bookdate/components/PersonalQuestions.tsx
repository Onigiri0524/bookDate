"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { TypingText } from "@/components/ui/TypingText";
import type { PersonalAnswers } from "@/lib/types";

const QUESTIONS: { key: keyof PersonalAnswers; label: string; placeholder: string }[] = [
  {
    key: "wearColor",
    label: "What color should I wear?",
    placeholder: "Pastel pink, all black, your favorite color…",
  },
  {
    key: "favoriteSnack",
    label: "What's your favorite snack?",
    placeholder: "Chips, mochi, fries, anything yummy…",
  },
  {
    key: "songRequest",
    label: "Any song requests for our playlist?",
    placeholder: "That one song that gives you butterflies…",
  },
  {
    key: "smileMost",
    label: "What makes you smile the most?",
    placeholder: "Tell me what lights you up ✨",
  },
  {
    key: "specialRequest",
    label: "Any special request for our date?",
    placeholder: "Surprises, vibes, anything your heart wants…",
  },
];

export function PersonalQuestions() {
  const { booking, updateBooking, setStep } = useBooking();

  const setAnswer = (key: keyof PersonalAnswers, value: string) => {
    updateBooking({
      answers: { ...booking.answers, [key]: value },
    });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateBooking({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.section
      className="min-h-screen px-4 py-16 pb-28"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="mx-auto max-w-xl">
        <h2 className="font-display romance-heading text-center text-3xl font-bold">
          <TypingText text="A few cute questions for you 💭" />
        </h2>
        <p className="romance-muted mt-2 text-center text-sm">
          All optional — but they make me smile
        </p>

        <div className="mt-8 space-y-5">
          {QUESTIONS.map((q, i) => (
            <motion.div
              key={q.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <label className="romance-body mb-2 block text-sm font-semibold">
                  {q.label}
                </label>
                <input
                  type="text"
                  className="romantic-input w-full"
                  placeholder={q.placeholder}
                  value={booking.answers[q.key]}
                  onChange={(e) => setAnswer(q.key, e.target.value)}
                />
              </GlassCard>
            </motion.div>
          ))}

          <GlassCard>
            <label className="romance-body mb-2 block text-sm font-semibold">
              Upload a cute photo (optional) 📷
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="romance-body w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-white"
            />
            {booking.photo && (
              <motion.img
                src={booking.photo}
                alt="Uploaded"
                className="mt-4 max-h-48 rounded-2xl object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </GlassCard>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <motion.button
            type="button"
            onClick={() => setStep("summary")}
            whileHover={{ scale: 1.03 }}
            className="romantic-btn-yes w-full max-w-md rounded-full py-4 font-bold"
          >
            See Our Date Plan 💖
          </motion.button>
          <button
            type="button"
            onClick={() => setStep("subcategory")}
            className="romance-muted text-sm underline"
          >
            ← Back
          </button>
        </div>
      </div>
    </motion.section>
  );
}
