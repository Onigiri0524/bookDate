"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BookingData, BookingStep } from "@/lib/types";
import { DEFAULT_BOOKING } from "@/lib/types";
import {
  clearAllProgress,
  clearLegacyProgress,
  loadBookingSession,
  saveBookingSession,
} from "@/lib/storage";

interface BookingContextValue {
  step: BookingStep;
  setStep: (step: BookingStep) => void;
  booking: BookingData;
  updateBooking: (patch: Partial<BookingData>) => void;
  yesScale: number;
  setYesScale: (n: number | ((prev: number) => number)) => void;
  noAttempts: number;
  incrementNoAttempts: () => void;
  accepted: boolean;
  setAccepted: (v: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  musicOn: boolean;
  toggleMusic: () => void;
  resetAll: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<BookingStep>("proposal");
  const [booking, setBooking] = useState<BookingData>({ ...DEFAULT_BOOKING });
  const [yesScale, setYesScale] = useState(1);
  const [noAttempts, setNoAttempts] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [musicOn, setMusicOn] = useState(true);

  useEffect(() => {
    clearLegacyProgress();

    const session = loadBookingSession();
    if (session) {
      setStep(session.step);
      setBooking(session.booking);
      setAccepted(true);
    } else {
      setStep("proposal");
      setBooking({ ...DEFAULT_BOOKING });
      setYesScale(1);
      setNoAttempts(0);
      setAccepted(false);
    }

    const theme = localStorage.getItem("bookdate-theme");
    if (theme === "light") setDarkMode(false);
    if (theme === "dark") setDarkMode(true);
    const musicPref = localStorage.getItem("bookdate-music");
    if (musicPref === "off") setMusicOn(false);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !accepted) return;
    if (step === "celebration") return;
    saveBookingSession({ step, booking, accepted: true });
  }, [hydrated, step, booking, accepted]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("bookdate-theme", darkMode ? "dark" : "light");
  }, [darkMode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("bookdate-music", musicOn ? "on" : "off");
  }, [musicOn, hydrated]);

  const updateBooking = useCallback((patch: Partial<BookingData>) => {
    setBooking((prev) => ({ ...prev, ...patch }));
  }, []);

  const incrementNoAttempts = useCallback(() => {
    setNoAttempts((n) => n + 1);
    setYesScale((s) => Math.min(s + 0.08, 2.2));
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);
  const toggleMusic = useCallback(() => setMusicOn((m) => !m), []);

  const resetAll = useCallback(() => {
    setStep("proposal");
    setBooking({ ...DEFAULT_BOOKING });
    setYesScale(1);
    setNoAttempts(0);
    setAccepted(false);
    clearAllProgress();
  }, []);

  const value = useMemo(
    () => ({
      step,
      setStep,
      booking,
      updateBooking,
      yesScale,
      setYesScale,
      noAttempts,
      incrementNoAttempts,
      accepted,
      setAccepted,
      darkMode,
      toggleDarkMode,
      musicOn,
      toggleMusic,
      resetAll,
    }),
    [
      step,
      booking,
      updateBooking,
      yesScale,
      noAttempts,
      incrementNoAttempts,
      accepted,
      darkMode,
      toggleDarkMode,
      musicOn,
      toggleMusic,
      resetAll,
    ]
  );

  if (!hydrated) {
    return null;
  }

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
