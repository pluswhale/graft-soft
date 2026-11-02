import type { StageStructure } from "./types";

/**
 * Stage journey structure. Per-locale copy lives in `en.ts` / `ru.ts`
 * (`stages.items`, matched by index); visual constants (accent, icon, media
 * gradients) live here, mirroring how `mindmap.ts` works.
 */
export const STAGES: StageStructure[] = [
  {
    id: "discover",
    index: 1,
    accent: "primary",
    icon: "Compass",
    media: {
      url: "https://picsum.photos/seed/graft-discover/1280/800",
      gradientFrom: "#315efb",
      gradientTo: "#8067f7",
    },
  },
  {
    id: "strategy",
    index: 2,
    accent: "sky",
    icon: "Target",
    media: {
      gradientFrom: "#0ea5e9",
      gradientTo: "#315efb",
    },
  },
  {
    id: "design",
    index: 3,
    accent: "violet",
    icon: "PenTool",
    media: {
      url: "https://picsum.photos/seed/graft-design/1280/800",
      gradientFrom: "#8067f7",
      gradientTo: "#d946ef",
    },
  },
  {
    id: "build",
    index: 4,
    accent: "mint",
    icon: "Code2",
    media: {
      gradientFrom: "#2fbf8f",
      gradientTo: "#14b8a6",
    },
  },
  {
    id: "launch",
    index: 5,
    accent: "amber",
    icon: "Rocket",
    media: {
      url: "https://picsum.photos/seed/graft-launch/1280/800",
      gradientFrom: "#e39a34",
      gradientTo: "#f97316",
    },
  },
  {
    id: "evolve",
    index: 6,
    accent: "rose",
    icon: "TrendingUp",
    media: {
      gradientFrom: "#f43f5e",
      gradientTo: "#ec4899",
    },
  },
];
