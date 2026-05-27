import type { BookingData, BookingStep } from "./types";
import { DEFAULT_BOOKING } from "./types";

/** Same-tab only — keeps booking mid-flow on refresh, not on a fresh visit */
const SESSION_KEY = "bookdate-booking-session";

const LEGACY_KEY = "bookdate-progress";

export interface BookingSession {
  step: BookingStep;
  booking: BookingData;
  accepted: boolean;
}

const BOOKING_STEPS: BookingStep[] = [
  "datetime",
  "category",
  "subcategory",
  "questions",
  "summary",
];

export function isBookingStep(step: BookingStep): boolean {
  return BOOKING_STEPS.includes(step);
}

export function loadBookingSession(): BookingSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as BookingSession;
    if (!data.accepted || !isBookingStep(data.step)) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveBookingSession(data: BookingSession): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function clearBookingSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

/** Remove old localStorage that used to skip the proposal page */
export function clearLegacyProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_KEY);
}

export function clearAllProgress(): void {
  clearBookingSession();
  clearLegacyProgress();
}
