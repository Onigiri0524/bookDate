"use client";

import { useMemo } from "react";

export function Particles({ count = 12 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (i * 17 + 7) % 100,
        y: (i * 23 + 11) % 100,
        size: 2 + (i % 3),
        delay: `${(i % 5) * 0.6}s`,
        duration: `${2.5 + (i % 4) * 0.5}s`,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
