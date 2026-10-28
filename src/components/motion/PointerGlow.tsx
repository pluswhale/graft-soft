import { cn } from "@/lib/cn";

type PointerGlowProps = {
  variant?: "soft" | "strong" | "night";
  className?: string;
};

export function PointerGlow({ variant = "soft", className }: PointerGlowProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-glow",
        variant === "strong" && "pointer-glow--strong",
        variant === "night" && "pointer-glow--night",
        className,
      )}
    />
  );
}
