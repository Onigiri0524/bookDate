import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { BookingData } from "@/lib/types";
import { formatBookingEmailBody } from "@/lib/email";

const RECIPIENT = "nm.rasonable@gmail.com";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      booking: BookingData;
      timestamp: string;
    };
    const { booking, timestamp } = body;

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const from = process.env.SMTP_FROM ?? user;

    const text = formatBookingEmailBody(booking, timestamp);
    const html = text.replace(/\n/g, "<br>");

    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: from ?? user,
        to: RECIPIENT,
        subject: "💖 New Date Booking Received",
        text,
        html: `<div style="font-family:sans-serif;max-width:600px;padding:24px;background:#1a0a12;color:#ffc0cb;">
          <h1 style="color:#ff69b4;">💖 New Date Booking Received</h1>
          ${html}
        </div>`,
      });

      return NextResponse.json({ ok: true });
    }

    console.log("[bookdate] Email demo — configure SMTP or EmailJS:\n", text);

    return NextResponse.json({
      ok: true,
      demo: true,
      info:
        "SMTP isn't configured for this server. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to .env.local (or switch to EmailJS).",
      message:
        "Booking logged (demo). Configure SMTP_* or NEXT_PUBLIC_EMAILJS_* for real delivery.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
