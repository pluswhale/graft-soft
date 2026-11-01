import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ParallaxLayerProps = {
  children: ReactNode;
  speed?: number;
  depth?: number;
  className?: string;
};

export function ParallaxLayer({ children, speed = 0, depth = 0, className }: ParallaxLayerProps) {
  return (
    <div
      data-parallax={speed === 0 ? undefined : speed}
      suppressHydrationWarning
      style={{ "--depth": depth }}
      className={cn("depth-layer", className)}
    >
      {children}
    </div>
  );
}
