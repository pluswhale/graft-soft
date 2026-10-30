import type { AccentToken } from "@/content/types";

export type AccentStyle = {
  /** Gradient for the hairline bar on top of a node. */
  bar: string;
  /** Accent text colour that passes contrast on the light canvas. */
  text: string;
  /** Icon chip / metric box treatment. */
  chip: string;
  /** Focus / selection ring. */
  ring: string;
  /** Solid dot colour. */
  dot: string;
  /** Hex used for highlighted edges. */
  hex: string;
};

/** Egore's light-theme accent map. Class strings stay static so Tailwind picks them up. */
export const ACCENTS: Record<AccentToken, AccentStyle> = {
  primary: {
    bar: "from-primary to-[#7b96ff]",
    text: "text-primary",
    chip: "border-primary/25 bg-primary-soft text-primary",
    ring: "ring-primary/35",
    dot: "bg-primary",
    hex: "#315efb",
  },
  violet: {
    bar: "from-violet to-[#b7a6ff]",
    text: "text-violet-ink",
    chip: "border-violet/30 bg-violet/10 text-violet-ink",
    ring: "ring-violet/35",
    dot: "bg-violet",
    hex: "#8067f7",
  },
  mint: {
    bar: "from-[#3ecf9a] to-mint",
    text: "text-mint-ink",
    chip: "border-mint-ink/25 bg-mint/20 text-mint-ink",
    ring: "ring-mint-ink/35",
    dot: "bg-mint-ink",
    hex: "#2fbf8f",
  },
  amber: {
    bar: "from-[#f0b45a] to-[#e08a2b]",
    text: "text-amber-ink",
    chip: "border-amber-ink/20 bg-[#fdf1de] text-amber-ink",
    ring: "ring-amber-ink/30",
    dot: "bg-[#e39a34]",
    hex: "#e39a34",
  },
  sky: {
    bar: "from-sky-400 to-cyan-400",
    text: "text-sky-700",
    chip: "border-sky-500/25 bg-sky-50 text-sky-700",
    ring: "ring-sky-500/30",
    dot: "bg-sky-500",
    hex: "#0ea5e9",
  },
  rose: {
    bar: "from-rose-400 to-pink-400",
    text: "text-rose-700",
    chip: "border-rose-400/30 bg-rose-50 text-rose-700",
    ring: "ring-rose-400/30",
    dot: "bg-rose-500",
    hex: "#f43f5e",
  },
};
