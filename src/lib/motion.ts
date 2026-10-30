import type { CSSProperties } from "react";

export function reveal(
  delay = 0,
): { "data-reveal": ""; style: CSSProperties; suppressHydrationWarning: boolean } {
  // MotionRuntime adds `.is-revealed` to these elements after hydration; suppress
  // the resulting attribute mismatch on the (possibly streamed) node.
  return {
    "data-reveal": "",
    style: { "--reveal-delay": `${delay}ms` },
    suppressHydrationWarning: true,
  };
}
