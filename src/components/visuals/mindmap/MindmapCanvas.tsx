"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
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
import type { MindmapFlowData, MindmapFlowNode } from "./types";

const NODE_TYPES = { mind: MindmapNodeView } as const;

// ---------------------------------------------------------------------------
// Auto-reset viewport tuning — the knobs live right here.
//
//   AUTO_RESET_DELAY_MS — defined at MindmapCanvas.tsx line 51:
//
//       const AUTO_RESET_DELAY_MS = 3000;
//
//   After the pointer leaves the interactive nodes (and nothing is focused),
//   the canvas waits AUTO_RESET_DELAY_MS and then glides the viewport back to
//   the default fitView framing over AUTO_RESET_DURATION_MS.
//
//   PAN_RELEASE_GRACE_MS is the dead-zone right after a pan gesture during
//   which hovering can never arm the reset — it prevents the viewport jump
//   that used to fire the moment the left mouse button (LKM) was released
//   after panning.
//
//   HOVER_CLEAR_DELAY_MS debounces the hover-focus clear so residual
//   enter/leave events at a node boundary can never chatter the graph.
// ---------------------------------------------------------------------------
const AUTO_RESET_DELAY_MS = 3000;
const AUTO_RESET_DURATION_MS = 700;
const PAN_RELEASE_GRACE_MS = 250;
const HOVER_CLEAR_DELAY_MS = 80;

/**
 * Identity-stable style payloads. Hover focus changes must swap a reference
 * per node/edge — never rebuild every style object — or React Flow re-applies
 * inline styles to the whole graph and the dim transitions restart on every
 * enter/leave event (the historical flicker loop).
 */
const NODE_STYLE_ACTIVE: CSSProperties = {
  opacity: 1,
  transition: "opacity 200ms var(--ease-out-quart)",
};
const NODE_STYLE_DIMMED: CSSProperties = {
  opacity: 0.35,
  transition: "opacity 200ms var(--ease-out-quart)",
};
const EDGE_STYLE_BASE: CSSProperties = {
  strokeWidth: 1.4,
  stroke: "var(--color-border-strong)",
  opacity: 1,
};
const EDGE_STYLE_DIMMED: CSSProperties = {
  strokeWidth: 1.4,
  stroke: "var(--color-border-strong)",
  opacity: 0.3,
};

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

  /**
   * Mirror of `focusId` for deferred callbacks. Only read AFTER the passive
   * effects have run (e.g. inside the AUTO_RESET_DELAY_MS timeout), never
   * synchronously inside an interaction handler — this ref deliberately does
   * not gate arming the reset, because during a leave handler it would still
   * hold the just-left node id and permanently block the reset.
   */
  const focusIdRef = useRef<string | null>(null);
  useEffect(() => {
    focusIdRef.current = focusId;
  }, [focusId]);

  /** Pending auto-reset timer id (empty while no reset is armed). */
  const autoResetTimerRef = useRef<number | null>(null);
  /** Pending hover-focus clear timer id (hover hysteresis). */
  const hoverClearTimerRef = useRef<number | null>(null);
  /** True while a left-button pan gesture is in progress on the pane. */
  const isPanningRef = useRef(false);
  /** Timestamp of the last pan release, used for the PAN_RELEASE_GRACE_MS dead-zone. */
  const lastPanReleaseRef = useRef(0);
  /** Guards the one-shot initial fitView so readiness jitters cannot refit. */
  const didInitialFitRef = useRef(false);

  const cancelAutoReset = useCallback(() => {
    if (autoResetTimerRef.current != null) {
      window.clearTimeout(autoResetTimerRef.current);
      autoResetTimerRef.current = null;
    }
  }, []);

  const clearHoverTimer = useCallback(() => {
    if (hoverClearTimerRef.current != null) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
  }, []);

  /**
   * Debounced viewport reset. The delay lives in AUTO_RESET_DELAY_MS
   * (constants block at the top of this file).
   *
   * Arming conditions (decided at the call site, where `selectedId` is fresh):
   * pointer left the nodes/canvas AND no node is selected.
   * Fire-time guards make it inert if anything changed meanwhile: an active
   * drag, or a re-focus (enter handler cancelled it, this is belt & braces).
   * The pan grace window keeps the reset from ever firing on the enter/leave
   * churn browsers dispatch right after a mouse release.
   */
  const scheduleAutoReset = useCallback(() => {
    if (autoResetTimerRef.current != null) return;
    if (isPanningRef.current) return; // never re-fit while a drag is held
    if (performance.now() - lastPanReleaseRef.current < PAN_RELEASE_GRACE_MS) return;
    autoResetTimerRef.current = window.setTimeout(() => {
      autoResetTimerRef.current = null;
      if (isPanningRef.current) return;
      if (focusIdRef.current !== null) return; // re-focused since armed
      void fitView({ padding: 0.18, duration: AUTO_RESET_DURATION_MS });
    }, AUTO_RESET_DELAY_MS);
  }, [fitView]);

  // Disarm both timers on unmount so no stray callback fires after unmounting.
  useEffect(
    () => () => {
      cancelAutoReset();
      clearHoverTimer();
    },
    [cancelAutoReset, clearHoverTimer],
  );

  /**
   * Pan (drag) bookkeeping for the cursor + auto-reset fixes:
   * - a left-button press (LKM) that starts on the open pane marks a pending
   *   pan and cancels any armed reset — panning must never trigger a refit;
   * - the global pointerup/pointercancel/blur listeners release the flag even
   *   when the button comes up outside the canvas, so no stale press can keep
   *   the pane cursor or block the reset forever.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return; // panning is a left-button gesture (LKM)
      const { target } = event;
      if (!(target instanceof Element)) return;
      // Only a drag starting on the open pane (not nodes/controls) is a pan.
      if (target.closest(".react-flow__pane") == null) return;
      isPanningRef.current = true;
      cancelAutoReset();
    };

    container.addEventListener("pointerdown", onPointerDown);
    return () => container.removeEventListener("pointerdown", onPointerDown);
  }, [cancelAutoReset]);

  useEffect(() => {
    const endPan = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        lastPanReleaseRef.current = performance.now();
      }
    };
    window.addEventListener("pointerup", endPan, { passive: true });
    window.addEventListener("pointercancel", endPan, { passive: true });
    window.addEventListener("blur", endPan);
    return () => {
      window.removeEventListener("pointerup", endPan);
      window.removeEventListener("pointercancel", endPan);
      window.removeEventListener("blur", endPan);
    };
  }, []);

  /** Per-node React Flow `data`, built once per `nodes` change so hover
   *  focus changes never recreate node data objects. */
  const nodeDataById = useMemo(() => {
    const map = new Map<string, MindmapFlowData>();
    for (const node of nodes) {
      map.set(node.id, {
        ...node.content,
        variant: node.variant,
        accent: node.accent,
        icon: node.icon,
      });
    }
    return map;
  }, [nodes]);

  const focusAccent = useMemo(() => {
    const node = focusId == null ? null : nodes.find((item) => item.id === focusId);
    return ACCENTS[node?.accent ?? "primary"];
  }, [focusId, nodes]);

  /** Style for the edges bound to the focused node — rebuilt only when the
   *  focused node's accent actually changes. */
  const connectedEdgeStyle = useMemo<CSSProperties>(
    () => ({ strokeWidth: 2, stroke: focusAccent.hex }),
    [focusAccent],
  );

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
        data: nodeDataById.get(node.id) ?? {
          ...node.content,
          variant: node.variant,
          accent: node.accent,
          icon: node.icon,
        },
        ariaLabel: node.content.title,
        draggable: false,
        selected: node.id === selectedId,
        style: connected ? NODE_STYLE_ACTIVE : NODE_STYLE_DIMMED,
      };
    });
  }, [nodes, nodeDataById, focusId, selectedId, adjacency]);

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
        // Every edge flows by default — the focus state only re-styles them.
        animated: true,
        style: connected ? connectedEdgeStyle : dimmed ? EDGE_STYLE_DIMMED : EDGE_STYLE_BASE,
      };
    });
  }, [edges, focusId, connectedEdgeStyle]);

  const handleNodeClick = useCallback(
    (_: MouseEvent, node: MindmapFlowNode) => {
      onSelect(node.id === selectedId ? null : node.id);
    },
    [selectedId, onSelect],
  );

  /**
   * Back on a node — keep the viewport exactly where it is and cancel both
   * the pending hover clear and the armed viewport reset. React bails out on
   * same-value setState, so repeated enter events cost nothing.
   */
  const handleNodeMouseEnter = useCallback(
    (_: MouseEvent, node: MindmapFlowNode) => {
      clearHoverTimer(); // a fresh enter always beats a pending leave
      setHoveredId(node.id);
      cancelAutoReset();
    },
    [clearHoverTimer, cancelAutoReset],
  );

  /**
   * Left a node — clear the hover focus after HOVER_CLEAR_DELAY_MS so the
   * enter/leave chatter at a node boundary collapses into a single state
   * change. If nothing is selected, arm the debounced viewport reset here.
   */
  const handleNodeMouseLeave = useCallback(() => {
    clearHoverTimer();
    hoverClearTimerRef.current = window.setTimeout(() => {
      hoverClearTimerRef.current = null;
      setHoveredId(null);
      if (selectedId === null) scheduleAutoReset();
    }, HOVER_CLEAR_DELAY_MS);
  }, [clearHoverTimer, selectedId, scheduleAutoReset]);

  /** Pointer left the whole canvas — arm the reset when nothing is focused. */
  const handleCanvasMouseLeave = useCallback(() => {
    if (selectedId === null) scheduleAutoReset();
  }, [selectedId, scheduleAutoReset]);

  // fitView once nodes are measured (hydration resets the viewport after SSR).
  useEffect(() => {
    if (!nodesInitialized || didInitialFitRef.current) return;
    didInitialFitRef.current = true;
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
      onMouseLeave={handleCanvasMouseLeave}
      className={cn("mindmap-canvas absolute inset-0", className)}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
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
        panOnDrag
        proOptions={{ hideAttribution: true }}
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
