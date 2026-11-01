"use client";

import { cn } from "@/lib/cn";

/** Pulsing status dot used by the map chrome strip. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative flex h-2 w-2", className)}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
    </span>
  );
}
