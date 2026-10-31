"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/cn";
import { ACCENTS } from "./accents";
import { MapIcon } from "./MapIcon";
import type { MindmapFlowNode } from "./types";

/** Every node exposes all four ports so edge handles always resolve. */
const SIDES = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const;

function MindmapNodeComponent({ data, selected }: NodeProps<MindmapFlowNode>) {
  const accent = ACCENTS[data.accent];
  const isRoot = data.variant === "root";

  return (
    <div
      data-variant={data.variant}
      className={cn(
        "group relative rounded-2xl border transition-[box-shadow,border-color,opacity] duration-200",
        isRoot
          ? "w-[12.5rem] bg-ink px-3.5 py-3 text-white shadow-float"
          : "w-[9.25rem] bg-surface/95 px-3 py-2.5 text-ink shadow-soft backdrop-blur",
        selected
          ? cn("border-transparent ring-2", accent.ring)
          : isRoot
            ? "border-ink hover:shadow-[0_1px_2px_rgb(19_27_46/0.05),0_26px_50px_-24px_rgb(19_27_46/0.4)]"
            // Hover feedback must never move the element: a hover translate shifts
        // the node out from under the pointer near its edges, firing
        // mouseleave -> unhover -> mouseenter in an infinite loop.
        // Border colour + shadow don't affect hit-testing, so they are safe.
        : "border-border hover:border-border-strong hover:shadow-float",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-xl border",
            isRoot ? "border-white/15 bg-white/10 text-mint" : accent.chip,
          )}
        >
          <MapIcon name={data.icon} className="size-4" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate leading-tight",
              isRoot ? "text-[13.5px] font-semibold" : "text-[12.5px] font-semibold",
            )}
          >
            {data.title}
          </p>
          {data.subtitle ? (
            <p
              className={cn(
                "mt-0.5 truncate text-[10px] leading-tight",
                isRoot ? "text-white/55" : "text-ink-muted",
              )}
            >
              {data.subtitle}
            </p>
          ) : null}
        </div>
        {isRoot ? (
          <span className="relative flex size-1.5 shrink-0" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-70 motion-reduce:animate-none" />
            <span className="relative size-full rounded-full bg-mint" />
          </span>
        ) : null}
      </div>

      {/* Accent hairline */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-3 -top-px h-px rounded-full bg-gradient-to-r opacity-70",
          isRoot ? "from-mint via-white/40 to-transparent" : accent.bar,
        )}
      />

      {/* Ports — hidden visually, referenced by edge handles in the layout. */}
      {SIDES.map((side) => (
        <Handle
          key={`s-${side.id}`}
          type="source"
          id={side.id}
          position={side.position}
          isConnectable={false}
        />
      ))}
      {SIDES.map((side) => (
        <Handle
          key={`t-${side.id}`}
          type="target"
          id={side.id}
          position={side.position}
          isConnectable={false}
        />
      ))}
    </div>
  );
}

export const MindmapNodeView = memo(MindmapNodeComponent);
