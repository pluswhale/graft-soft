"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type SwipeTrackProps = {
  children: ReactNode;
  hint: string;
  label: string;
  className?: string;
  as?: "ol" | "ul" | "div";
};

export function SwipeTrack({ children, hint, label, className, as: Tag = "div" }: SwipeTrackProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = track.scrollWidth - track.clientWidth;
      const visible = track.clientWidth / track.scrollWidth;
      const progress = max > 0 ? track.scrollLeft / max : 0;
      bar.style.width = `${Math.min(100, visible * 100)}%`;
      bar.style.transform = `translateX(${progress * (1 / Math.max(visible, 0.01) - 1) * 100}%)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div>
      <Tag
        ref={(node: HTMLElement | null) => {
          trackRef.current = node;
        }}
        aria-label={label}
        className={cn(
          "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden",
          "md:mx-0 md:snap-none md:overflow-visible md:px-0 md:pb-0",
          className,
        )}
      >
        {children}
      </Tag>
      <div aria-hidden className="mt-5 flex items-center gap-4 md:hidden">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">{hint} →</span>
        <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border">
          <span ref={barRef} className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary" />
        </span>
      </div>
    </div>
  );
}
