import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Date With Me 💖 | NickeL",
  description:
    "A romantic date invitation from NickeL — plan the perfect date together.",
  openGraph: {
    title: "Date With Me 💖",
    description: "Hi! I'm NickeL. Will you go on a date with me?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${playfair.variable} min-h-full font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
