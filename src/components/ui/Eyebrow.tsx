import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

export function Eyebrow({ children, tone = "light", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[0.75rem] uppercase tracking-[0.12em]",
        tone === "light" ? "text-ink-secondary" : "text-white/70",
        className,
      )}
    >
      <span aria-hidden className={cn("h-px w-8", tone === "light" ? "bg-primary" : "bg-mint")} />
      {children}
    </p>
  );
}
