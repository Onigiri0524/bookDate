"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingHeartsProps {
  count?: number;
  intensity?: number;
}

export function FloatingHearts({ count = 12, intensity = 1 }: FloatingHeartsProps) {
  const hearts = useMemo(
    () =>
      Array.from({ length: Math.floor(count * intensity) }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 8,
        size: 14 + Math.random() * 22,
        emoji: ["💖", "💕", "💗", "💓", "❤️", "✨"][Math.floor(Math.random() * 6)],
      })),
    [count, intensity]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute opacity-60"
          style={{ left: h.left, fontSize: h.size, bottom: "-5%" }}
          animate={{
            y: [0, -1100],
            x: [0, Math.sin(h.id) * 40],
            rotate: [0, 360],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  );
}
