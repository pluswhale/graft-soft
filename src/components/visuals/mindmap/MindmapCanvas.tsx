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
import type { MindmapCopy, MindmapEdge, MindmapNode } from "@/content/types";
import { ACCENTS } from "./accents";
import { MindmapNodeView } from "./MindmapNode";
import { DetailsPanel } from "./DetailsPanel";
import { LiveDot } from "./LiveDot";
import type { MindmapFlowData, MindmapFlowNode } from "./types";

const NODE_TYPES = { mind: MindmapNodeView } as const;

// ---------------------------------------------------------------------------
// Two-stage auto reset — the knobs live right here.
//
//   GRID_RESET_DELAY_MS — defined in the constants block at the bottom of
//   this header:
//
//       const GRID_RESET_DELAY_MS = 1000;
//
//   CARD_RESET_DELAY_MS — ditto, right below it:
//
//       const CARD_RESET_DELAY_MS = 1000;
//
//   The canvas and the details panel are intentionally DECOUPLED:
//
//     mapFocusId = selectedId ?? hoveredId — drives node/edge highlights
//     and dimming. "setMapFocusId(null)" is implemented by clearing BOTH
//     source states (setHoveredId(null) + setSelectedId(null)).
//
//     panelFocusId — a standalone state that drives only the details panel.
//     Hovering and clicking a node BOTH record it, so the panel keeps
//     showing the text of the last hovered/clicked node.
//
//   GRID RESET (1s): armed when the pointer leaves the left canvas wrapper
//   (moving onto the panel, the strip, or out of the card all count).
//   Fire: the viewport glides home over VIEWPORT_RESET_DURATION_MS — the
//   camera is the ONLY thing that moves: the node highlight (mapFocusId)
//   and panelFocusId are deliberately untouched, so the node remains
//   highlighted and the panel keeps its text.
//
//   CARD RESET (1s): armed when the pointer leaves the whole card (chrome
//   strip + canvas + panel). Fire: BOTH layers clear — panelFocusId falls
//   back to its empty state AND the map highlights clear (both source
//   states, hoveredId + selectedId, are cleared together). The viewport
//   is deliberately untouched here.
//
//   Aborts: re-entering the canvas wrapper cancels the GRID timer;
//   re-entering the whole card cancels the CARD timer; the panel 'X'
//   cancels ALL timers and resets everything instantly; a left-button pan
//   press inside the canvas also cancels both (with the
//   PAN_RELEASE_GRACE_MS dead-zone, stamped by real drags only).
//
//   HOVER_CLEAR_DELAY_MS debounces clearing the hover focus while the
//   pointer stays INSIDE the canvas (node -> pane transitions); crossing
//   the canvas edge cancels that clear so the highlight survives the move
//   to the panel.
// ---------------------------------------------------------------------------
const GRID_RESET_DELAY_MS = 1000;
const CARD_RESET_DELAY_MS = 1000;
const VIEWPORT_RESET_DURATION_MS = 700;
const PAN_RELEASE_GRACE_MS = 250;
const PAN_DRAG_THRESHOLD_PX = 4;
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
  /** Copy/strings for the card chrome and the details panel. */
  map: MindmapCopy;
  /** Non-root directions rendered by the panel empty state. */
  directions: MindmapNode[];
  label: string;
  className?: string;
};

export function MindmapCanvas({ nodes, edges, map, directions, label, className }: MindmapCanvasProps) {
  return (
    <ReactFlowProvider>
      <MindmapCanvasInner
        nodes={nodes}
        edges={edges}
        map={map}
        directions={directions}
        label={label}
        className={className}
      />
    </ReactFlowProvider>
  );
}

function MindmapCanvasInner({ nodes, edges, map, directions, label, className }: MindmapCanvasProps) {
  const { fitView } = useReactFlow();

  /**
   * THE TWO DECOUPLED STATE LAYERS.
   * - Canvas layer: `selectedId` (durable click focus) + `hoveredId`
   *   (transient hover focus with hysteresis) — together they form
   *   `mapFocusId`, which drives highlights/edges/camera.
   * - Panel layer: `panelFocusId` — what the details panel shows. Written
   *   by hover AND click; survives canvas resets; cleared by the card
   *   reset and the manual 'X' only.
   */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [panelFocusId, setPanelFocusId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  // React Flow reports readiness separately from commit, so fit only once nodes are measured.
  const nodesInitialized = useStore((state) => state.nodesInitialized);

  /** Canvas visual focus: highlights/edges/camera (panel never reads this). */
  const mapFocusId = selectedId ?? hoveredId;

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

  /** The node the details panel shows — panel layer reads ONLY panelFocusId. */
  const panelNode = useMemo(
    () => (panelFocusId == null ? null : nodes.find((node) => node.id === panelFocusId) ?? null),
    [nodes, panelFocusId],
  );

  /** Pending GRID reset timer id (empty while no countdown is armed). */
  const gridResetTimerRef = useRef<number | null>(null);
  /** Pending CARD reset timer id (empty while no countdown is armed). */
  const cardResetTimerRef = useRef<number | null>(null);
  /** Pending hover-focus clear timer id (hover hysteresis inside the canvas). */
  const hoverClearTimerRef = useRef<number | null>(null);
  /** True while a left-button pan gesture is in progress on the pane. */
  const isPanningRef = useRef(false);
  /** Timestamp of the last real pan release, used for the PAN_RELEASE_GRACE_MS dead-zone. */
  const lastPanReleaseRef = useRef(0);
  /** Start point + moved flag of the in-flight press (real drag detection). */
  const panStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const panDraggedRef = useRef(false);
  /** Guards the one-shot initial fitView so readiness jitters cannot refit. */
  const didInitialFitRef = useRef(false);

  const cancelGridReset = useCallback(() => {
    if (gridResetTimerRef.current != null) {
      window.clearTimeout(gridResetTimerRef.current);
      gridResetTimerRef.current = null;
    }
  }, []);

  const cancelCardReset = useCallback(() => {
    if (cardResetTimerRef.current != null) {
      window.clearTimeout(cardResetTimerRef.current);
      cardResetTimerRef.current = null;
    }
  }, []);

  const clearHoverTimer = useCallback(() => {
    if (hoverClearTimerRef.current != null) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
  }, []);

  /** Shared pan guards so mouse-leaves during/near a drag never arm resets. */
  const panGuardBlocks = useCallback(() => {
    if (isPanningRef.current) return true; // never arm mid-drag
    return performance.now() - lastPanReleaseRef.current < PAN_RELEASE_GRACE_MS;
  }, []);

  /**
   * GRID RESET. The delay lives in GRID_RESET_DELAY_MS (constants block at
   * the top of this file). Arms ONLY via handleCanvasMouseLeave; cancelled
   * via handleCanvasMouseEnter (grid re-entry). Fire: the viewport glides
   * home ONLY — the node highlight (mapFocusId) and panelFocusId are BOTH
   * deliberately left intact: the node stays highlighted, the panel keeps
   * its text.
   */
  const scheduleGridReset = useCallback(() => {
    if (gridResetTimerRef.current != null) return;
    if (panGuardBlocks()) return;
    gridResetTimerRef.current = window.setTimeout(() => {
      gridResetTimerRef.current = null;
      if (isPanningRef.current) return;
      // Stage 1: camera home ONLY. Highlight and panel stay as they are.
      void fitView({ padding: 0.18, duration: VIEWPORT_RESET_DURATION_MS });
    }, GRID_RESET_DELAY_MS);
  }, [fitView, panGuardBlocks]);

  /**
   * CARD RESET. The delay lives in CARD_RESET_DELAY_MS. Arms ONLY via
   * handleCardMouseLeave; cancelled via handleCardMouseEnter (card
   * re-entry). Fire: BOTH layers clear together — the panel falls back to
   * its empty state AND the map highlights are removed (hoveredId +
   * selectedId). The viewport is deliberately untouched here.
   */
  const scheduleCardReset = useCallback(() => {
    if (cardResetTimerRef.current != null) return;
    if (panGuardBlocks()) return;
    cardResetTimerRef.current = window.setTimeout(() => {
      cardResetTimerRef.current = null;
      if (isPanningRef.current) return;
      // Stage 2: the panel closes AND the node highlight clears together.
      setPanelFocusId(null);
      setHoveredId(null);
      setSelectedId(null);
    }, CARD_RESET_DELAY_MS);
  }, [panGuardBlocks]);

  /**
   * Manual close ('X' in the details panel): cancel ALL timers, glide the
   * viewport home and clear BOTH state layers immediately — no waiting.
   */
  const handleManualClose = useCallback(() => {
    clearHoverTimer();
    cancelGridReset();
    cancelCardReset();
    setHoveredId(null);
    setSelectedId(null);
    setPanelFocusId(null);
    void fitView({ padding: 0.18, duration: VIEWPORT_RESET_DURATION_MS });
  }, [clearHoverTimer, cancelGridReset, cancelCardReset, fitView]);

  /** Panel shortcut button: record the panel layer AND the canvas focus. */
  const selectFromPanel = useCallback((id: string | null) => {
    if (id == null) return;
    setSelectedId((current) => (current === id ? null : id));
    setPanelFocusId(id);
  }, []);

  // Disarm all timers on unmount so no stray callback fires after unmounting.
  useEffect(
    () => () => {
      cancelGridReset();
      cancelCardReset();
      clearHoverTimer();
    },
    [cancelGridReset, cancelCardReset, clearHoverTimer],
  );

  /**
   * Native in-canvas interaction bookkeeping.
   * - ANY left-button press inside the canvas (node, open pane, zoom
   *   controls) cancels both armed countdowns;
   * - presses outside the canvas wrapper (details panel, card chrome) are
   *   ignored;
   * - while pressed, accumulated movement marks the gesture as a real drag
   *   (PAN_DRAG_THRESHOLD_PX). Only a real drag release starts the
   *   PAN_RELEASE_GRACE_MS dead-zone — plain clicks stamp none.
   * The global pointerup/pointercancel/blur listeners release the state even
   * when the button comes up outside the canvas, so no stale press can keep
   * the pane cursor or block the resets forever.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return; // in-canvas gestures are left-button (LKM)
      const { target } = event;
      if (!(target instanceof Element)) return;
      if (!container.contains(target)) return; // outside presses never cancel
      // With panOnDrag a drag can also start from undraggable nodes (their
      // press bubbles down to the pane), so track every in-canvas press.
      isPanningRef.current = true;
      panStartPointRef.current = { x: event.clientX, y: event.clientY };
      panDraggedRef.current = false;
      cancelGridReset();
      cancelCardReset();
    };

    const onPointerMove = (event: PointerEvent) => {
      const start = panStartPointRef.current;
      if (start == null) return;
      if (
        Math.abs(event.clientX - start.x) > PAN_DRAG_THRESHOLD_PX ||
        Math.abs(event.clientY - start.y) > PAN_DRAG_THRESHOLD_PX
      ) {
        panDraggedRef.current = true;
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [cancelGridReset, cancelCardReset]);

  useEffect(() => {
    const endPan = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        // Only a real drag gets a release grace; simple clicks stamp none.
        if (panDraggedRef.current) {
          lastPanReleaseRef.current = performance.now();
        }
      }
      panStartPointRef.current = null;
      panDraggedRef.current = false;
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
    const node = mapFocusId == null ? null : nodes.find((item) => item.id === mapFocusId);
    return ACCENTS[node?.accent ?? "primary"];
  }, [mapFocusId, nodes]);

  /** Style for the edges bound to the focused node — rebuilt only when the
   *  focused node's accent actually changes. */
  const connectedEdgeStyle = useMemo<CSSProperties>(
    () => ({ strokeWidth: 2, stroke: focusAccent.hex }),
    [focusAccent],
  );

  const flowNodes = useMemo(() => {
    return nodes.map((node) => {
      const connected =
        mapFocusId == null ||
        node.id === mapFocusId ||
        adjacency.get(mapFocusId)?.has(node.id) === true;

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
  }, [nodes, nodeDataById, mapFocusId, selectedId, adjacency]);

  const flowEdges = useMemo<Edge[]>(() => {
    return edges.map((edge) => {
      const connected =
        mapFocusId != null && (edge.source === mapFocusId || edge.target === mapFocusId);
      const dimmed = mapFocusId != null && !connected;

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
  }, [edges, mapFocusId, connectedEdgeStyle]);

  const handleNodeClick = useCallback(
    (_: MouseEvent, node: MindmapFlowNode) => {
      setSelectedId((current) => (current === node.id ? null : node.id));
      // The panel records the click too — it tracks the LAST clicked/hovered.
      setPanelFocusId(node.id);
    },
    [],
  );

  /**
   * Back on a node — cancel the pending hover clear, record the panel layer
   * (the panel follows the LAST hovered node) and, if the pointer physically
   * returned from outside, cancel both countdowns (canvas + card re-entry).
   * React bails out on same-value setState, so repeated enter events cost
   * nothing.
   */
  const handleNodeMouseEnter = useCallback(
    (_: MouseEvent, node: MindmapFlowNode) => {
      clearHoverTimer();
      setHoveredId(node.id);
      setPanelFocusId(node.id);
      cancelGridReset();
      cancelCardReset();
    },
    [clearHoverTimer, cancelGridReset, cancelCardReset],
  );

  /**
   * Left a node while still INSIDE the canvas (node -> pane): clear the hover
   * focus after HOVER_CLEAR_DELAY_MS. Neither stage timer is touched here.
   */
  const handleNodeMouseLeave = useCallback(() => {
    clearHoverTimer();
    hoverClearTimerRef.current = window.setTimeout(() => {
      hoverClearTimerRef.current = null;
      setHoveredId(null);
    }, HOVER_CLEAR_DELAY_MS);
  }, [clearHoverTimer]);

  /**
   * Pointer left the LEFT CANVAS WRAPPER (the dotted grid) — moved onto the
   * panel, the strip or out of the card. First stage arm: the grid
   * countdown starts. Also cancels a pending hover clear so the highlight
   * survives the crossing.
   */
  const handleCanvasMouseLeave = useCallback(() => {
    clearHoverTimer();
    scheduleGridReset();
  }, [clearHoverTimer, scheduleGridReset]);

  /**
   * Pointer is back on the canvas (from the panel, the strip or outside) —
   * the first-stage countdown aborts; the map stays exactly as it was.
   */
  const handleCanvasMouseEnter = useCallback(() => {
    cancelGridReset();
  }, [cancelGridReset]);

  /**
   * Pointer left the WHOLE card (chrome strip + canvas + details panel) —
   * second-stage arm.
   */
  const handleCardMouseLeave = useCallback(() => {
    scheduleCardReset();
  }, [scheduleCardReset]);

  /**
   * Pointer is back inside the whole card — the second-stage countdown
   * aborts; the panel stays exactly as it was.
   */
  const handleCardMouseEnter = useCallback(() => {
    cancelCardReset();
  }, [cancelCardReset]);

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
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-border bg-surface/90 shadow-float",
        className,
      )}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      {/* Decorative hairline wash — inert to the pointer so panOnDrag stays native. */}
      <div
        aria-hidden
        className="hairline-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(80%_80%_at_28%_18%,#000_25%,transparent_100%)]"
      />

      {/* Map chrome strip — INSIDE the card boundary; reading it never arms the card stage. */}
      <div className="relative flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <p className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
          <LiveDot />
          {map.eyebrow}
        </p>
        <p className="hidden min-w-0 truncate text-[0.6875rem] text-ink-muted xl:block">
          {map.hint}
        </p>
      </div>

      <div className="relative grid md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="relative h-[26rem] min-w-0">
          <div
            ref={containerRef}
            role="group"
            aria-label={label}
            onMouseEnter={handleCanvasMouseEnter}
            onMouseLeave={handleCanvasMouseLeave}
            className="mindmap-canvas absolute inset-0"
          >
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={NODE_TYPES}
              onNodeClick={handleNodeClick}
              onNodeMouseEnter={handleNodeMouseEnter}
              onNodeMouseLeave={handleNodeMouseLeave}
              onPaneClick={() => setSelectedId(null)}
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
        </div>
        <DetailsPanel
          node={panelNode}
          map={map}
          directions={directions}
          onSelect={selectFromPanel}
          onClose={handleManualClose}
          className="border-t md:border-t-0"
        />
      </div>
    </div>
  );
}
