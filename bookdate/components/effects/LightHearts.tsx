"use client";

import { useMemo } from "react";

const EMOJIS = ["💖", "💕", "💗", "✨"];

export function LightHearts({ count = 6 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${10 + (i * 80) % 85}%`,
        delay: `${i * 1.2}s`,
        duration: `${7 + (i % 3)}s`,
        size: 16 + (i % 3) * 6,
        emoji: EMOJIS[i % EMOJIS.length],
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-float"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
