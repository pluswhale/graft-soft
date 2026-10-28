import { cn } from "@/lib/cn";

export function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3 w-5">
      <span
        className={cn(
          "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-500 ease-[var(--ease-expo)]",
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-[1.5px] rounded-full bg-current transition-all duration-500 ease-[var(--ease-expo)]",
          open ? "top-1/2 w-full -translate-y-1/2 -rotate-45" : "bottom-0 w-3/5",
        )}
      />
    </span>
  );
}
