"use client";

import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { playBackgroundMusic } from "@/lib/music";
import { BACKGROUND_MUSIC_LABEL } from "@/lib/site";

export function MusicToggle() {
  const { musicOn, toggleMusic } = useBooking();

  const handleClick = () => {
    if (!musicOn) {
      toggleMusic();
      playBackgroundMusic();
    } else {
      toggleMusic();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-btn fixed right-4 top-20 z-50 flex max-w-[min(100vw-2rem,220px)] items-center gap-2 rounded-full px-4 py-2 text-sm"
      aria-label={
        musicOn
          ? `Mute ${BACKGROUND_MUSIC_LABEL}`
          : `Play ${BACKGROUND_MUSIC_LABEL}`
      }
      title={BACKGROUND_MUSIC_LABEL}
    >
      <span className="truncate">
        {musicOn ? "🔊" : "🔇"} {musicOn ? "Music On" : "Music Off"}
      </span>
    </motion.button>
  );
}
