"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { LightHearts } from "@/components/effects/LightHearts";
import { CreatorBrand } from "@/components/ui/CreatorBrand";
import { fireConfetti, fireHeartBurst } from "@/lib/confetti";
import { playBackgroundMusic } from "@/lib/music";
import { playSuccessChime } from "@/lib/sounds";

const NO_MESSAGES = [
  "Are you sure? 🥺",
  "Please don't say no 😭",
  "Try the other button 💕",
  "No is unavailable today 😌",
  "My heart can't take rejection 💔",
];

const BTN_W = 100;
const BTN_H = 48;
const TRIGGER_RADIUS = 110;
const MIN_FLEE_MS = 80;
const MAX_FLEE_DIST = 72;

interface FleeBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getFleeBounds(container: HTMLElement): FleeBounds {
  const rect = container.getBoundingClientRect();
  const padX = 36;
  const padY = 28;
  return {
    minX: rect.left - padX,
    maxX: rect.right - BTN_W + padX,
    minY: rect.top - padY,
    maxY: rect.bottom - BTN_H + padY,
  };
}

function clampToBounds(x: number, y: number, bounds: FleeBounds) {
  return {
    x: clamp(x, bounds.minX, bounds.maxX),
    y: clamp(y, bounds.minY, bounds.maxY),
  };
}

/** Small random hop — stays inside the button area */
function randomInBounds(bounds: FleeBounds) {
  const width = Math.max(bounds.maxX - bounds.minX, 0);
  const height = Math.max(bounds.maxY - bounds.minY, 0);
  return {
    ...clampToBounds(
      bounds.minX + Math.random() * width,
      bounds.minY + Math.random() * height,
      bounds
    ),
    rotation: -22 + Math.random() * 44,
    scale: 0.65 + Math.random() * 0.4,
  };
}

/** Flee near cursor but only within the button zone */
function fleeNearCursor(
  cursorX: number,
  cursorY: number,
  btnCenterX: number,
  btnCenterY: number,
  bounds: FleeBounds
) {
  let dx = btnCenterX - cursorX;
  let dy = btnCenterY - cursorY;
  const len = Math.hypot(dx, dy);

  if (len < 8) {
    const angle = Math.random() * Math.PI * 2;
    dx = Math.cos(angle);
    dy = Math.sin(angle);
  } else {
    dx /= len;
    dy /= len;
  }

  const fleeDist = 48 + Math.random() * (MAX_FLEE_DIST - 48);
  const centerX = cursorX + dx * fleeDist;
  const centerY = cursorY + dy * fleeDist;

  const { x, y } = clampToBounds(
    centerX - BTN_W / 2,
    centerY - BTN_H / 2,
    bounds
  );

  return {
    x,
    y,
    rotation: -16 + Math.random() * 32,
    scale: 0.75 + Math.random() * 0.35,
  };
}

export function ProposalLanding() {
  const { setStep, setAccepted, yesScale, incrementNoAttempts, noAttempts } =
    useBooking();

  const [noMessage, setNoMessage] = useState(NO_MESSAGES[0]);
  const [noFixed, setNoFixed] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0, rotation: 0, scale: 1 });
  const [swapButtons, setSwapButtons] = useState(false);
  const [heartCount, setHeartCount] = useState(8);

  const noBtnRef = useRef<HTMLButtonElement>(null);
  const buttonsAreaRef = useRef<HTMLDivElement>(null);
  const noAttemptsRef = useRef(0);
  const lastFleeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const dodgeNo = useCallback(
    (cursorX: number, cursorY: number) => {
      const area = buttonsAreaRef.current;
      if (!area) return;

      const now = performance.now();
      if (now - lastFleeRef.current < MIN_FLEE_MS) return;
      lastFleeRef.current = now;

      const bounds = getFleeBounds(area);
      const btn = noBtnRef.current;
      let btnCenterX = cursorX;
      let btnCenterY = cursorY;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        btnCenterX = rect.left + rect.width / 2;
        btnCenterY = rect.top + rect.height / 2;
      }

      noAttemptsRef.current += 1;
      const attempt = noAttemptsRef.current;

      incrementNoAttempts();
      setNoMessage(NO_MESSAGES[(attempt - 1) % NO_MESSAGES.length]);
      setHeartCount((c) => Math.min(c + 2, 14));

      const useRandomHop = attempt > 1 && Math.random() > 0.55;
      const next = useRandomHop
        ? randomInBounds(bounds)
        : fleeNearCursor(cursorX, cursorY, btnCenterX, btnCenterY, bounds);

      setNoPos(next);
      setNoFixed(true);

      if (Math.random() > 0.65) setSwapButtons((s) => !s);
    },
    [incrementNoAttempts]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const btn = noBtnRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

        if (dist < TRIGGER_RADIUS) {
          dodgeNo(e.clientX, e.clientY);
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [dodgeNo]);

  const handleYes = () => {
    playBackgroundMusic();
    setAccepted(true);
    fireConfetti(2);
    fireHeartBurst();
    playSuccessChime();
    setStep("celebration");
  };

  const yesButton = (
    <motion.button
      type="button"
      onClick={handleYes}
      animate={{
        scale: yesScale,
        boxShadow: [
          "0 0 20px rgba(255, 105, 180, 0.45)",
          `0 0 ${28 + noAttempts * 10}px rgba(255, 23, 68, 0.85)`,
          "0 0 20px rgba(255, 105, 180, 0.45)",
        ],
      }}
      transition={{
        scale: { type: "spring", stiffness: 260, damping: 18 },
        boxShadow: { duration: 1.4, repeat: Infinity },
      }}
      whileHover={{ scale: yesScale * 1.08 }}
      whileTap={{ scale: yesScale * 0.95 }}
      className="romantic-btn-yes relative z-20 min-w-[140px] rounded-full px-8 py-4 text-lg font-bold"
    >
      YES 💖
    </motion.button>
  );

  const noButton = (
    <button
      ref={noBtnRef}
      type="button"
      onMouseEnter={(e) => dodgeNo(e.clientX, e.clientY)}
      onClick={(e) => {
        e.preventDefault();
        dodgeNo(e.clientX, e.clientY);
      }}
      style={
        noFixed
          ? {
              position: "fixed",
              left: noPos.x,
              top: noPos.y,
              transform: `rotate(${noPos.rotation}deg) scale(${noPos.scale})`,
              zIndex: 50,
              transition: "left 0.1s ease-out, top 0.1s ease-out, transform 0.12s ease-out",
            }
          : undefined
      }
      className="romantic-btn-no z-30 shrink-0 rounded-full px-6 py-3 text-sm font-semibold"
    >
      NO 💔
    </button>
  );

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 pb-24">
      <LightHearts count={heartCount} />

      <GlassCard
        glow={noAttempts > 1}
        className="relative z-10 max-w-lg text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display romance-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Will you go on a date with me? 💖
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={noMessage + String(noAttempts)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="romance-muted mt-4 min-h-[28px] text-sm"
          >
            {noAttempts > 0 ? noMessage : "Take your time… I'm nervous too 🥹"}
          </motion.p>
        </AnimatePresence>

        <div
          ref={buttonsAreaRef}
          className="relative mt-10 flex min-h-[88px] min-w-[280px] flex-wrap items-center justify-center gap-6 px-2 py-4"
        >
          {swapButtons ? (
            <>
              {noButton}
              {yesButton}
            </>
          ) : (
            <>
              {yesButton}
              {noButton}
            </>
          )}
        </div>
      </GlassCard>

      <div className="relative z-10 mt-10">
        <CreatorBrand variant="hero" />
      </div>
    </section>
  );
}
