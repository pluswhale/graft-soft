"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
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

/** Delay before hover/selection is cleared and the full map is restored. */

const AUTO_RESET_DELAY_MS = 3000;

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
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserMovingRef = useRef(false);
  const hasInitialFitRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);
  // React Flow reports readiness separately from commit, so fit only once nodes are measured.
  const nodesInitialized = useStore((state) => state.nodesInitialized);

  const initialFlowNodes = useMemo<MindmapFlowNode[]>(
    () =>
      nodes.map((node) => ({
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
      })),
    [nodes],
  );

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<MindmapFlowNode>(initialFlowNodes);

  useEffect(() => {
    setRfNodes((prev) => {
      const measuredById = new Map(prev.map((n) => [n.id, n.measured]));
      return initialFlowNodes.map((n) => ({
        ...n,
        measured: measuredById.get(n.id) ?? n.measured,
      }));
    });
  }, [initialFlowNodes, setRfNodes]);

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

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const focusNodeBranch = useCallback(
    (nodeId: string) => {
      if (!nodesInitialized) return;
      if (nodeId === "root") {
        void fitView({
          nodes: [{ id: "root" }],
          padding: 0.9,
          maxZoom: 0.85,
          duration: 500,
        });
        return;
      }
      const neighborIds = adjacency.get(nodeId);
      const targetIds = new Set<string>([nodeId, ...(neighborIds ?? [])]);
      void fitView({
        nodes: Array.from(targetIds, (id) => ({ id })),
        padding: 0.28,
        maxZoom: 0.95,
        duration: 500,
      });
    },
    [adjacency, fitView, nodesInitialized],
  );

  const scheduleReset = useCallback(() => {
    clearResetTimer();
    if (isUserMovingRef.current) return;
    resetTimerRef.current = setTimeout(() => {
      resetTimerRef.current = null;
      setHoveredId(null);
      onSelectRef.current(null);
      void fitView({ padding: 0.18, duration: 1000 });
    }, AUTO_RESET_DELAY_MS);
  }, [clearResetTimer, fitView]);

  useEffect(() => clearResetTimer, [clearResetTimer]);

  const focusId = selectedId ?? hoveredId;
  const focusAccent = useMemo(() => {
    const node = focusId == null ? null : nodes.find((item) => item.id === focusId);
    return ACCENTS[node?.accent ?? "primary"];
  }, [focusId, nodes]);

  const flowNodes = useMemo(() => {
    return rfNodes.map((node) => {
      const connected =
        focusId == null ||
        node.id === focusId ||
        adjacency.get(focusId)?.has(node.id) === true;

      return {
        ...node,
        selected: node.id === selectedId,
        style: {
          ...node.style,
          opacity: connected ? 1 : 0.35,
          transition: "opacity 200ms var(--ease-out-quart)",
        },
      };
    });
  }, [rfNodes, focusId, selectedId, adjacency]);

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
        // Keep every edge flowing; focus only changes its colour and emphasis.
        animated: true,
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
      clearResetTimer();
      const nextId = node.id === selectedId ? null : node.id;
      onSelect(nextId);
      if (nextId !== null) {
        focusNodeBranch(nextId);
      } else {
        void fitView({ padding: 0.18, duration: 1000 });
      }
    },
    [selectedId, onSelect, clearResetTimer, focusNodeBranch, fitView],
  );

  // fitView once nodes are measured (hydration resets the viewport after SSR).
  useEffect(() => {
    if (!nodesInitialized || hasInitialFitRef.current) return;
    hasInitialFitRef.current = true;
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
      onMouseEnter={clearResetTimer}
      onMouseLeave={scheduleReset}
      className={cn("mindmap-canvas absolute inset-0", className)}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        nodeTypes={NODE_TYPES}
        onNodeClick={handleNodeClick}
        onMoveStart={(event) => {
          isUserMovingRef.current = event !== null;
          clearResetTimer();
        }}
        onMoveEnd={() => {
          isUserMovingRef.current = false;
        }}
        onNodeMouseEnter={(_, node) => {
          clearResetTimer();
          if (isUserMovingRef.current) return;
          // Hover only highlights; camera moves are reserved for explicit clicks.
          // This keeps the viewport stationary when mouse-up occurs over a node.
          setHoveredId(node.id);
        }}
        onNodeMouseLeave={() => {
          scheduleReset();
        }}
        onPaneClick={() => {
          clearResetTimer();
          setHoveredId(null);
          onSelect(null);
          void fitView({ padding: 0.18, duration: 1000 });
        }}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.45}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={true}
        panOnDrag={true}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.3}
          color="var(--color-border-strong)"
          className="pointer-events-none"
        />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
