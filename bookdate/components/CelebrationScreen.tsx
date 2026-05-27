"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { fireConfetti, fireHeartBurst } from "@/lib/confetti";
import { LightHearts } from "@/components/effects/LightHearts";

export function CelebrationScreen() {
  const { setStep } = useBooking();

  useEffect(() => {
    fireConfetti(1.5);
    fireHeartBurst();
    const burst = setInterval(() => fireHeartBurst(), 800);
    const next = setTimeout(() => setStep("datetime"), 3500);
    return () => {
      clearInterval(burst);
      clearTimeout(next);
    };
  }, [setStep]);

  return (
    <motion.section
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <LightHearts count={8} />
      <div className="glass-card glass-card--glow romantic-glow max-w-xl p-10">
        <motion.span
          className="text-6xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          💖
        </motion.span>
        <h2 className="font-display romance-heading mt-6 text-3xl font-bold sm:text-4xl">
          YAYYY 💖 You just made me the happiest person alive!
        </h2>
        <p className="romance-muted mt-4">Let&apos;s plan our perfect date together...</p>
        <motion.div
          className="mx-auto mt-8 h-1 w-32 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
        >
          <motion.div
            className="h-full bg-pink-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
