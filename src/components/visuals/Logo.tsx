import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-8", className)}>
      <path
        d="M23.78 8.22A11 11 0 1 0 27 16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M27 16h-9" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.75" fill="var(--color-mint)" stroke="var(--color-primary)" strokeWidth="1.5" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <LogoMark className="size-7" />
      <span className="text-[1.125rem] font-bold tracking-[-0.035em]">Graftsoft</span>
    </span>
  );
}
