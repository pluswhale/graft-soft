import { MINDMAP_EDGES, MINDMAP_NODES } from "@/content/mindmap";
import type { MindmapCopy, MindmapEdge, MindmapNode } from "@/content/types";

export { MINDMAP_EDGES };

/** Merges the shared layout with the locale-specific copy. */
export function buildMindmapNodes(map: MindmapCopy): MindmapNode[] {
  return MINDMAP_NODES.flatMap((node) => {
    const content = map.nodes[node.id];
    return content ? [{ ...node, content }] : [];
  });
}

export function findMindmapNode(nodes: MindmapNode[], id: string | null): MindmapNode | null {
  if (id == null) return null;
  return nodes.find((node) => node.id === id) ?? null;
}

export type { MindmapEdge };
