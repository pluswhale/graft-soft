"use client";

import { cn } from "@/lib/cn";

type LiveDotProps = {
  className?: string;
};

/** Tiny pulsing status dot used by the capability-map chrome. */
export function LiveDot({ className }: LiveDotProps) {
  return (
    <span aria-hidden className={cn("relative flex size-1.5", className)}>
      <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-70 motion-reduce:animate-none" />
      <span className="relative size-full rounded-full bg-mint-ink" />
    </span>
  );
}
