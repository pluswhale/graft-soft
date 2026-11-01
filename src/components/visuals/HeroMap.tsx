"use client";

import { useMemo, useState } from "react";
import { MousePointerClick } from "lucide-react";
import type { MindmapCopy, MindmapNode } from "@/content/types";
import { cn } from "@/lib/cn";
import { buildMindmapNodes, findMindmapNode, MINDMAP_EDGES } from "@/lib/mindmap";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { MindmapCanvas } from "./mindmap/MindmapCanvas";
import { DetailsBody } from "./mindmap/DetailsPanel";
import { ACCENTS } from "./mindmap/accents";
import { MapIcon } from "./mindmap/MapIcon";

type MapContent = MindmapCopy;

type LiveDotProps = {
  className?: string;
};

function LiveDot({ className }: LiveDotProps) {
  return (
    <span aria-hidden className={cn("relative flex size-1.5", className)}>
      <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-70 motion-reduce:animate-none" />
      <span className="relative size-full rounded-full bg-mint-ink" />
    </span>
  );
}

/**
 * Hero visual — the interactive capability map: the canvas owns the hover
 * / click / reset behaviour, the details panel lives inside it.
 */
export function HeroMap({ map }: { map: MapContent }) {
  const nodes = useMemo(() => buildMindmapNodes(map), [map]);
  const root = nodes[0];
  const directions = useMemo(() => nodes.filter((node) => node.variant !== "root"), [nodes]);

  return (
    <div className="relative">
      <div className="hidden md:block">
        <ParallaxLayer speed={0.04} depth={-6}>
          <MindmapCanvas
            nodes={nodes}
            edges={MINDMAP_EDGES}
            map={map}
            directions={directions}
            label={map.label}
          />
        </ParallaxLayer>
      </div>

      <HeroMapCompact map={map} root={root} directions={directions} />
    </div>
  );
}

type HeroMapCompactProps = {
  map: MapContent;
  root: MindmapNode;
  directions: MindmapNode[];
};

/** Mobile fallback (< md): root card + direction grid + details, same selection state. */
function HeroMapCompact({ map, root, directions }: HeroMapCompactProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId == null ? null : findMindmapNode(directions, selectedId);

  const select = (id: string | null) => {
    setSelectedId((current) => (id === null || current === id ? null : id));
  };

  return (
    <div
      role="group"
      aria-label={map.label}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-soft md:hidden"
    >
      <p className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
        <LiveDot />
        {map.eyebrow}
      </p>

      <div className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-soft">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-mint">
          <MapIcon name={root.icon} className="size-4" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold">{root.content.title}</p>
          {root.content.subtitle ? (
            <p className="mt-0.5 truncate font-mono text-[10px] text-white/55">
              {root.content.subtitle}
            </p>
          ) : null}
        </div>
        <LiveDot />
      </div>

      <div
        aria-hidden
        className="relative ml-6 h-5 w-px bg-[linear-gradient(to_bottom,var(--color-border-strong),var(--color-primary))]"
      >
        <span className="layer-packet absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-primary" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {directions.map((direction) => {
          const accent = ACCENTS[direction.accent];
          const active = selected?.id === direction.id;

          return (
            <button
              key={direction.id}
              type="button"
              onClick={() => select(direction.id)}
              aria-pressed={active}
              className={cn(
                "flex items-start gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-border bg-surface text-ink hover:border-border-strong hover:bg-surface-muted/60",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-lg border",
                  active ? "border-white/15 bg-white/10 text-mint" : accent.chip,
                )}
              >
                <MapIcon name={direction.icon} className="size-3.5" strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-semibold">
                  {direction.content.title}
                </span>
                {direction.content.subtitle ? (
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-[10px]",
                      active ? "text-white/55" : "text-ink-muted",
                    )}
                  >
                    {direction.content.subtitle}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        {selected ? (
          <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-soft">
            <DetailsBody node={selected} map={map} onClose={() => select(null)} />
          </div>
        ) : (
          <p className="flex items-center gap-2 text-[11.5px] text-ink-muted">
            <MousePointerClick className="size-3.5 shrink-0" strokeWidth={1.8} />
            {map.hint}
          </p>
        )}
      </div>
    </div>
  );
}
