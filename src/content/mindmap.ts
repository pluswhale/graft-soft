import type { MindmapEdge, MindmapNodeBase } from "./types";

/**
 * Language-independent layout for the hero capability map.
 * Copy (titles, descriptions, results) lives in the dictionaries, keyed by node id.
 */
export const MINDMAP_NODES: MindmapNodeBase[] = [
  {
    id: "root",
    position: { x: 124, y: 118 },
    variant: "root",
    accent: "primary",
    icon: "Sparkles",
  },
  {
    id: "agents",
    position: { x: 0, y: 0 },
    variant: "pillar",
    accent: "primary",
    icon: "Bot",
  },
  {
    id: "integrations",
    position: { x: 300, y: 0 },
    variant: "pillar",
    accent: "violet",
    icon: "PlugZap",
  },
  {
    id: "engineering",
    position: { x: 0, y: 252 },
    variant: "pillar",
    accent: "mint",
    icon: "Code2",
  },
  {
    id: "data",
    position: { x: 300, y: 252 },
    variant: "pillar",
    accent: "amber",
    icon: "BarChart3",
  },
];

export const MINDMAP_EDGES: MindmapEdge[] = [
  { id: "root-agents", source: "root", target: "agents", sourceHandle: "left", targetHandle: "right" },
  {
    id: "root-integrations",
    source: "root",
    target: "integrations",
    sourceHandle: "right",
    targetHandle: "left",
  },
  {
    id: "root-engineering",
    source: "root",
    target: "engineering",
    sourceHandle: "left",
    targetHandle: "right",
  },
  { id: "root-data", source: "root", target: "data", sourceHandle: "right", targetHandle: "left" },
];
