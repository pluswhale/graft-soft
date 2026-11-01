"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, MousePointerClick, X } from "lucide-react";
import type { MindmapCopy, MindmapNode, MindmapVariant } from "@/content/types";
import { cn } from "@/lib/cn";
import { ACCENTS } from "./accents";
import { MapIcon } from "./MapIcon";

type DetailsPanelProps = {
  node: MindmapNode | null;
  map: MindmapCopy;
  directions: MindmapNode[];
  onSelect: (id: string | null) => void;
  /** Manual close ('X'): resets the whole map state immediately. */
  onClose: () => void;
  className?: string;
};

function variantLabel(variant: MindmapVariant, map: MindmapCopy) {
  if (variant === "root") return map.panel.hub;
  if (variant === "pillar") return map.panel.pillar;
  return map.panel.leaf;
}

/** Desktop side panel: empty state with direction shortcuts, or the selected node. */
export function DetailsPanel({ node, map, directions, onSelect, onClose, className }: DetailsPanelProps) {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border-border bg-surface/80 px-4 py-4 md:border-l",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {node ? (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={enter}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          >
            <DetailsBody node={node} map={map} onClose={onClose} />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col justify-between gap-5"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 text-center">
              <span className="grid size-11 place-items-center rounded-2xl border border-border bg-surface-muted">
                <MousePointerClick className="size-4.5 text-ink-muted" strokeWidth={1.8} />
              </span>
              <p className="text-[13px] font-semibold text-ink">{map.empty.title}</p>
              <p className="max-w-[15rem] text-[11.5px] leading-relaxed text-ink-muted">
                {map.empty.description}
              </p>
            </div>

            <div className="space-y-1.5" aria-label={map.empty.title}>
              {directions.map((direction) => {
                const accent = ACCENTS[direction.accent];
                return (
                  <button
                    key={direction.id}
                    type="button"
                    onClick={() => onSelect(direction.id)}
                    className="group flex w-full items-center gap-2.5 rounded-xl border border-border bg-surface px-2.5 py-1.5 text-left transition-colors hover:border-border-strong hover:bg-surface-muted/60"
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-lg border",
                        accent.chip,
                      )}
                    >
                      <MapIcon name={direction.icon} className="size-3.5" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold text-ink">
                        {direction.content.title}
                      </span>
                      {direction.content.subtitle ? (
                        <span className="block truncate text-[10px] text-ink-muted">
                          {direction.content.subtitle}
                        </span>
                      ) : null}
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

/** Selected-node content, shared by the desktop panel and the mobile fallback. */
export function DetailsBody({
  node,
  map,
  onClose,
}: {
  node: MindmapNode;
  map: MindmapCopy;
  onClose: () => void;
}) {
  const accent = ACCENTS[node.accent];

  return (
    <>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl border",
            accent.chip,
          )}
        >
          <MapIcon name={node.icon} className="size-4.5" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-muted">
            {variantLabel(node.variant, map)}
          </p>
          <h3 className="mt-0.5 truncate text-[15px] font-semibold leading-tight text-ink">
            {node.content.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={map.panel.close}
          className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-surface text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {node.content.subtitle ? (
        <p className={cn("mt-3 text-[11.5px] font-semibold", accent.text)}>
          {node.content.subtitle}
        </p>
      ) : null}
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-secondary">
        {node.content.description}
      </p>

      <ul className="mt-3 space-y-1.5">
        {node.content.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-[12px] text-ink-secondary">
            <Check className={cn("mt-0.5 size-3.5 shrink-0", accent.text)} strokeWidth={2.4} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {node.content.metric ? (
        <div className={cn("mt-3 rounded-xl border px-3 py-2.5", accent.chip)}>
          <p className="text-[13px] font-semibold leading-snug">{node.content.metric}</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] opacity-75">
            {map.panel.metric}
          </p>
        </div>
      ) : null}

      <div className="mt-auto pt-3">
        <a
          href="#contact"
          className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-primary"
        >
          {map.panel.cta}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </>
  );
}
