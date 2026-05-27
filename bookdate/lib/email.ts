import type { BookingData } from "./types";

const RECIPIENT = "nm.rasonable@gmail.com";

export function formatBookingEmailBody(
  booking: BookingData,
  timestamp: string
): string {
  const lines = [
    "💖 New Date Booking Received 💖",
    "",
    `📅 Date: ${booking.date || "Not set"}`,
    `⏰ Time: ${booking.time || "Not set"}`,
    `🌍 Timezone: ${booking.timezone || "Not set"}`,
    "",
    `🎯 Category: ${booking.categoryEmoji} ${booking.categoryLabel}`,
    `✨ Activities: ${booking.subcategories.length ? booking.subcategories.join(", ") : "None selected"}`,
    "",
    "💭 Personal Answers:",
    `• What color should I wear? ${booking.answers.wearColor || "—"}`,
    `• Favorite snack: ${booking.answers.favoriteSnack || "—"}`,
    `• Song requests: ${booking.answers.songRequest || "—"}`,
    `• What makes you smile: ${booking.answers.smileMost || "—"}`,
    `• Special request: ${booking.answers.specialRequest || "—"}`,
    "",
    booking.photo ? "📷 A cute photo was attached with the booking." : "",
    "",
    `🕐 Submitted at: ${timestamp}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export interface SendResult {
  ok: boolean;
  method?: "emailjs" | "api" | "demo";
  error?: string;
  info?: string;
}

export async function sendBookingEmail(
  booking: BookingData
): Promise<SendResult> {
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  const payload = {
    to_email: RECIPIENT,
    recipient: RECIPIENT,
    reply_to: RECIPIENT,
    subject: "💖 New Date Booking Received",
    message: formatBookingEmailBody(booking, timestamp),
    date: booking.date,
    time: booking.time,
    timezone: booking.timezone,
    category: `${booking.categoryEmoji} ${booking.categoryLabel}`,
    activities: booking.subcategories.join(", "),
    wear_color: booking.answers.wearColor,
    favorite_snack: booking.answers.favoriteSnack,
    song_request: booking.answers.songRequest,
    smile_most: booking.answers.smileMost,
    special_request: booking.answers.specialRequest,
    submitted_at: timestamp,
  };

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  try {
    const res = await fetch("/api/send-date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking, timestamp }),
    });
    const data = (await res.json()) as SendResult & {
      demo?: boolean;
      message?: string;
      info?: string;
    };
    if (res.ok) {
      // If SMTP isn't configured, API returns demo: true.
      if (data.demo) {
        const emailjsConfigured = Boolean(serviceId && templateId && publicKey);
        if (emailjsConfigured) {
          try {
            const emailjs = await import("@emailjs/browser");
            await emailjs.send(serviceId!, templateId!, payload, {
              publicKey: publicKey!,
            });
            return { ok: true, method: "emailjs", info: data.info };
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "EmailJS failed";
            return {
              ok: true,
              method: "demo",
              info:
                data.info ??
                `SMTP not configured. EmailJS also failed: ${message}`,
            };
          }
        }

        return {
          ok: true,
          method: "demo",
          info:
            data.info ??
            data.message ??
            "SMTP isn't configured. Add SMTP_* or EmailJS env vars to receive emails.",
        };
      }

      return { ok: true, method: "api", info: data.info };
    }
    return { ok: false, error: data.error ?? "Server email failed" };
  } catch (err) {
    // Network/server failure: as a fallback, try EmailJS if configured.
    const emailjsConfigured = Boolean(serviceId && templateId && publicKey);
    if (emailjsConfigured) {
      try {
        const emailjs = await import("@emailjs/browser");
        await emailjs.send(serviceId!, templateId!, payload, {
          publicKey: publicKey!,
        });
        return { ok: true, method: "emailjs" };
      } catch (emailErr) {
        const message =
          emailErr instanceof Error ? emailErr.message : "EmailJS failed";
        return {
          ok: false,
          error: message,
        };
      }
    }

    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: message };
  }
}
