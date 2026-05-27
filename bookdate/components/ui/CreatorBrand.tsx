"use client";

import {
  CREATOR_BYLINE,
  CREATOR_GREETING,
  CREATOR_TAGLINE,
  SITE_TITLE,
} from "@/lib/site";

type Variant = "hero" | "footer" | "loading";

export function CreatorBrand({ variant = "footer" }: { variant?: Variant }) {
  if (variant === "hero") {
    return (
      <div className="relative z-10 mb-8 text-center">
        <p className="romance-body text-base sm:text-lg">
          {CREATOR_GREETING}
          <span className="sr-only"> — site creator</span>
        </p>
        <h2 className="font-display romance-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {SITE_TITLE} 💖
        </h2>
        <p className="romance-muted mt-2 text-sm">{CREATOR_TAGLINE}</p>
      </div>
    );
  }

  if (variant === "loading") {
    return (
      <div className="mb-4 text-center">
        <p className="text-sm text-pink-200/90">{CREATOR_GREETING}</p>
        <p className="font-display mt-2 text-3xl font-bold text-white">{SITE_TITLE}</p>
      </div>
    );
  }

  return (
    <footer
      className="pointer-events-none fixed bottom-3 left-0 right-0 z-30 px-4 text-center"
      aria-label="Site credits"
    >
      <p className="romance-muted text-xs sm:text-sm">
        <span className="font-medium romance-body">{SITE_TITLE}</span>
        <span className="mx-1.5 opacity-50">·</span>
        <span>{CREATOR_BYLINE}</span>
      </p>
    </footer>
  );
}
