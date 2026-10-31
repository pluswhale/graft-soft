"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./mindmap-theme.css";
import { cn } from "@/lib/cn";
import type { MindmapEdge, MindmapNode } from "@/content/types";
import { ACCENTS } from "./accents";
import { MindmapNodeView } from "./MindmapNode";
import type { MindmapFlowNode } from "./types";

const NODE_TYPES = { mind: MindmapNodeView } as const;

type MindmapCanvasProps = {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  label: string;
  className?: string;
};

export function MindmapCanvas({ nodes, edges, selectedId, onSelect, label, className }: MindmapCanvasProps) {
  return (
    <ReactFlowProvider>
      <MindmapCanvasInner
        nodes={nodes}
        edges={edges}
        selectedId={selectedId}
        onSelect={onSelect}
        label={label}
        className={className}
      />
    </ReactFlowProvider>
  );
}

function MindmapCanvasInner({
  nodes,
  edges,
  selectedId,
  onSelect,
  label,
  className,
}: MindmapCanvasProps) {
  const { fitView } = useReactFlow();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // React Flow reports readiness separately from commit, so fit only once nodes are measured.
  const nodesInitialized = useStore((state) => state.nodesInitialized);

  /** node id -> set of directly connected node ids */
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const link = (a: string, b: string) => {
      const set = map.get(a) ?? new Set<string>();
      set.add(b);
      map.set(a, set);
    };
    for (const edge of edges) {
      link(edge.source, edge.target);
      link(edge.target, edge.source);
    }
    return map;
  }, [edges]);

  const focusId = selectedId ?? hoveredId;
  const focusAccent = useMemo(() => {
    const node = focusId == null ? null : nodes.find((item) => item.id === focusId);
    return ACCENTS[node?.accent ?? "primary"];
  }, [focusId, nodes]);

  const flowNodes = useMemo(() => {
    return nodes.map((node) => {
      const connected =
        focusId == null ||
        node.id === focusId ||
        adjacency.get(focusId)?.has(node.id) === true;

      return {
        id: node.id,
        type: "mind" as const,
        position: node.position,
        data: {
          ...node.content,
          variant: node.variant,
          accent: node.accent,
          icon: node.icon,
        },
        ariaLabel: node.content.title,
        draggable: false,
        selected: node.id === selectedId,
        style: {
          opacity: connected ? 1 : 0.35,
          transition: "opacity 200ms var(--ease-out-quart)",
        },
      };
    });
  }, [nodes, focusId, selectedId, adjacency]);

  const flowEdges = useMemo<Edge[]>(() => {
    return edges.map((edge) => {
      const connected =
        focusId != null && (edge.source === focusId || edge.target === focusId);
      const dimmed = focusId != null && !connected;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        animated: connected,
        style: {
          strokeWidth: connected ? 2 : 1.4,
          stroke: connected ? focusAccent.hex : "var(--color-border-strong)",
          opacity: dimmed ? 0.3 : 1,
        },
      };
    });
  }, [edges, focusId, focusAccent]);

  const handleNodeClick = useCallback(
    (_: MouseEvent, node: MindmapFlowNode) => {
      onSelect(node.id === selectedId ? null : node.id);
    },
    [selectedId, onSelect],
  );

  // fitView once nodes are measured (hydration resets the viewport after SSR).
  useEffect(() => {
    if (!nodesInitialized) return;
    void fitView({ padding: 0.18, duration: 0 });
  }, [nodesInitialized, fitView]);

  // Keep the graph centred when the canvas resizes (breakpoint crossings).
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const first = { w: 0, h: 0 };
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (first.w === w && first.h === h) return;
      first.w = w;
      first.h = h;
      void fitView({ padding: 0.18, duration: 0 });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [fitView]);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={label}
      className={cn("mindmap-canvas absolute inset-0", className)}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={(_, node) => setHoveredId(node.id)}
        onNodeMouseLeave={() => setHoveredId(null)}
        onPaneClick={() => onSelect(null)}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.45}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: false }}
        className="!bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.3}
          color="var(--color-border-strong)"
        />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
