import type { Node } from "@xyflow/react";
import type { MindmapNode } from "@/content/types";

export type MindmapFlowData = MindmapNode["content"] & Pick<MindmapNode, "variant" | "accent" | "icon">;

export type MindmapFlowNode = Node<MindmapFlowData, "mind">;
