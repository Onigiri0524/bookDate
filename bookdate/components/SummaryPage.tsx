"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { useBooking } from "@/context/BookingContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { LightHearts } from "@/components/effects/LightHearts";
import { fireConfetti } from "@/lib/confetti";
import { sendBookingEmail } from "@/lib/email";
import { clearAllProgress } from "@/lib/storage";

function formatDisplayDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function SummaryPage() {
  const { booking, resetAll, setStep, darkMode } = useBooking();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [demoInfo, setDemoInfo] = useState<string | null>(null);

  const sweetSummary = `On ${formatDisplayDate(booking.date)} at ${booking.time || "—"}, we're going on a ${booking.categoryEmoji} ${booking.categoryLabel}! We'll enjoy ${booking.subcategories.join(", ") || "whatever makes us happiest"}. I can't wait to make memories with you. 💖`;

  const downloadScreenshot = async () => {
    if (!summaryRef.current) return;
    const canvas = await html2canvas(summaryRef.current, {
      backgroundColor: darkMode ? "#1a0a12" : "#fff5f9",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = "our-date-plan.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const sendEmail = async () => {
    setSending(true);
    setError(null);
    const result = await sendBookingEmail(booking);
    setSending(false);
    if (result.ok) {
      setSent(true);
      setDemoMode(result.method === "demo");
      setDemoInfo(result.info ?? null);
      fireConfetti(1.5);
      clearAllProgress();
    } else {
      setError(result.error ?? "Could not send email. Check configuration.");
    }
  };

  return (
    <motion.section
      className="min-h-screen px-4 py-16 pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <LightHearts count={6} />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="font-display romance-heading text-center text-4xl font-bold">
          Our Date Plan 💖
        </h2>

        <div ref={summaryRef} className="mt-8 space-y-4 rounded-3xl p-2">
          <GlassCard glow className="romantic-glow">
            <p className="romance-body text-lg leading-relaxed">{sweetSummary}</p>
          </GlassCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <GlassCard>
              <p className="romance-muted text-xs uppercase tracking-wider">Date</p>
              <p className="romance-heading mt-1 font-semibold">
                {formatDisplayDate(booking.date)}
              </p>
            </GlassCard>
            <GlassCard>
              <p className="romance-muted text-xs uppercase tracking-wider">Time</p>
              <p className="romance-heading mt-1 font-semibold">
                {booking.time || "—"} ({booking.timezone})
              </p>
            </GlassCard>
            <GlassCard className="sm:col-span-2">
              <p className="romance-muted text-xs uppercase tracking-wider">Category</p>
              <p className="romance-heading mt-1 font-semibold">
                {booking.categoryEmoji} {booking.categoryLabel}
              </p>
            </GlassCard>
            <GlassCard className="sm:col-span-2">
              <p className="romance-muted text-xs uppercase tracking-wider">Activities</p>
              <p className="romance-body mt-1">
                {booking.subcategories.join(" • ") || "—"}
              </p>
            </GlassCard>
          </div>

          <GlassCard>
            <p className="romance-heading mb-3 font-semibold">Your sweet answers 💭</p>
            <ul className="romance-body space-y-2 text-sm">
              <li>
                <span className="romance-muted font-medium">Wear:</span>{" "}
                {booking.answers.wearColor || "—"}
              </li>
              <li>
                <span className="romance-muted font-medium">Snack:</span>{" "}
                {booking.answers.favoriteSnack || "—"}
              </li>
              <li>
                <span className="romance-muted font-medium">Playlist:</span>{" "}
                {booking.answers.songRequest || "—"}
              </li>
              <li>
                <span className="romance-muted font-medium">Smile:</span>{" "}
                {booking.answers.smileMost || "—"}
              </li>
              <li>
                <span className="romance-muted font-medium">Special:</span>{" "}
                {booking.answers.specialRequest || "—"}
              </li>
            </ul>
          </GlassCard>

          {booking.photo && (
            <GlassCard>
              <p className="romance-muted mb-2 text-sm">Cute photo 📷</p>
              <img
                src={booking.photo}
                alt="Date mood"
                className="max-h-56 w-full rounded-2xl object-cover"
              />
            </GlassCard>
          )}
        </div>

        {sent ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card glass-card--glow mt-8 p-6 text-center"
          >
            <p className="romance-heading text-xl font-bold">
              Your date request has been successfully sent 💌
            </p>
            {demoMode && (
              <p className="romance-muted mt-2 text-sm">
                {demoInfo ??
                  "Email delivery is not configured yet (server is in demo mode)."}
              </p>
            )}
          </motion.div>
        ) : (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.button
              type="button"
              onClick={downloadScreenshot}
              whileHover={{ scale: 1.03 }}
              className="glass-btn rounded-full px-8 py-3 font-semibold"
            >
              Download Screenshot 📸
            </motion.button>
            <motion.button
              type="button"
              onClick={sendEmail}
              disabled={sending}
              whileHover={{ scale: 1.03 }}
              className="romantic-btn-yes rounded-full px-8 py-3 font-bold disabled:opacity-60"
            >
              {sending ? "Sending… 💌" : "Send to My Love 💌"}
            </motion.button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-300">{error}</p>
        )}

        <div className="mt-8 flex justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => setStep("questions")}
            className="romance-muted underline"
          >
            ← Edit answers
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="romance-muted underline"
          >
            Start over
          </button>
        </div>
      </div>
    </motion.section>
  );
}
