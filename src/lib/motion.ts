import type { CSSProperties } from "react";

export function reveal(
  delay = 0,
): { "data-reveal": ""; style: CSSProperties } {
  return {
    "data-reveal": "",
    style: { "--reveal-delay": `${delay}ms` },
  };
}
