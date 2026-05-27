"use client";

import { useCallback, useEffect, useRef } from "react";
import { useBooking } from "@/context/BookingContext";
import { playBackgroundMusic } from "@/lib/music";
import { BACKGROUND_MUSIC_SRC } from "@/lib/site";

export function BackgroundMusic() {
  const { musicOn } = useBooking();
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback(() => {
    if (!musicOn) return;
    playBackgroundMusic();
  }, [musicOn]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    if (musicOn) {
      void play();
    } else {
      pause();
    }
  }, [musicOn, play, pause]);

  useEffect(() => {
    const unlock = () => {
      if (musicOn) void play();
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [musicOn, play]);

  return (
    <audio
      id="bg-music"
      ref={audioRef}
      src={BACKGROUND_MUSIC_SRC}
      loop
      preload="auto"
      playsInline
      className="sr-only"
      aria-hidden
    />
  );
}
