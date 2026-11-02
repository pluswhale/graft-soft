"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Clock, MoveRight } from "lucide-react";
import { ACCENTS } from "@/components/visuals/mindmap/accents";
import { MapIcon } from "@/components/visuals/mindmap/MapIcon";
import { cn } from "@/lib/cn";
import type { Stage } from "@/content/types";

interface AccordionStepProps {
  stage: Stage;
  position: number;
  isActive: boolean;
  onToggle: () => void;
  stageLabel: string;
}

const spring = { layout: { type: "spring", stiffness: 240, damping: 28 } } as const;
const instant = { layout: { duration: 0 } } as const;

function pad(position: number): string {
  return String(position + 1).padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/* Collapsed rail — compact vertical card                              */
/* ------------------------------------------------------------------ */

function CollapsedRail({ stage, position }: { stage: Stage; position: number }) {
  const accent = ACCENTS[stage.accent];

  return (
    <div className="flex h-full w-full items-center gap-3 overflow-hidden px-3 md:flex-col md:items-stretch md:justify-between md:px-0 md:py-4">
      <span className="mt-0 shrink-0 rounded-full border border-border bg-canvas px-2 py-1 font-mono text-[10px] text-ink-muted md:border-transparent md:bg-transparent md:px-0 md:py-0">
        {pad(position)}
      </span>

      {/* Horizontal label (mobile / column layout) */}
      <span className="truncate text-sm font-semibold text-ink md:hidden">{stage.title}</span>

      {/* Vertical label (desktop rail) */}
      <span className="hidden flex-1 md:flex md:items-center md:justify-center">
        <span className="rotate-180 text-sm font-semibold uppercase tracking-[0.25em] text-ink-secondary [writing-mode:vertical-rl] group-hover:text-ink">
          {stage.title}
        </span>
      </span>

      <MapIcon
        name={stage.icon}
        className={cn("hidden h-4 w-4 shrink-0 md:block", accent.text)}
        strokeWidth={1.8}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Expanded panel — full-width detail view                             */
/* ------------------------------------------------------------------ */

function StageMedia({ stage, position }: { stage: Stage; position: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const media = stage.media;
  const showImage = media?.url != null && !imageFailed;

  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-border lg:min-h-0">
      {/* Gradient underlay (always present; acts as the fallback) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${media?.gradientFrom ?? "#315efb"}, ${media?.gradientTo ?? "#0d1426"})`,
        }}
      />
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-60" />
      {showImage && media?.url ? (
        <img
          src={media.url}
          alt={media.alt}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {/* Scrim + giant stage number */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
      <span aria-hidden className="absolute bottom-3 right-4 text-7xl font-bold text-white/20">
        {pad(position)}
      </span>
    </div>
  );
}

function ExpandedPanel({ stage, position, stageLabel }: { stage: Stage; position: number; stageLabel: string }) {
  const accent = ACCENTS[stage.accent];

  return (
    <div className="grid h-full grid-cols-1 gap-6 overflow-y-auto p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:overflow-hidden">
      {/* Text column */}
      <div className="flex min-w-0 flex-col justify-center py-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl border", accent.chip)}>
            <MapIcon name={stage.icon} className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
              {stageLabel} {pad(position)}
            </p>
            <h3 className="text-2xl font-bold text-ink sm:text-3xl">{stage.title}</h3>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-canvas px-3 py-1.5 text-[11px] font-medium text-ink-secondary">
            <Clock className="h-3 w-3" />
            {stage.duration}
          </span>
        </div>

        <p className={cn("mt-4 text-sm font-semibold", accent.text)}>{stage.tagline}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">{stage.description}</p>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {stage.bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-2.5 text-sm text-ink-secondary">
              <Check className={cn("mt-0.5 h-4 w-4 shrink-0", accent.text)} strokeWidth={2.4} />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {stage.deliverables.map((deliverable) => (
            <span
              key={deliverable}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-canvas px-3 py-1.5 text-xs font-medium text-ink-secondary"
            >
              <MoveRight className="h-3.5 w-3.5 text-ink-muted" />
              {deliverable}
            </span>
          ))}
        </div>
      </div>

      {/* Media column */}
      <div className="h-[220px] lg:h-full">
        <StageMedia stage={stage} position={position} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step card — layout-animated shell                                   */
/* ------------------------------------------------------------------ */

export function AccordionStep({ stage, position, isActive, onToggle, stageLabel }: AccordionStepProps) {
  const accent = ACCENTS[stage.accent];
  const reduceMotion = useReducedMotion();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <motion.div
      layout
      transition={reduceMotion ? instant : spring}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${stage.title} — ${stageLabel.toLowerCase()} ${pad(position)}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative min-h-0 min-w-0 overflow-hidden rounded-2xl border outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary/50",
        isActive
          ? "flex-1 cursor-default border-border-strong bg-surface shadow-float"
          : "h-16 w-full shrink-0 cursor-pointer border-border bg-surface/60 hover:border-border-strong hover:bg-surface md:h-full md:w-20",
      )}
    >
      {/* Accent bar */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r transition-opacity duration-300",
          accent.bar,
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70",
        )}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isActive ? (
          <motion.div
            key="panel"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.16, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <ExpandedPanel stage={stage} position={position} stageLabel={stageLabel} />
          </motion.div>
        ) : (
          <motion.div
            key="rail"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <CollapsedRail stage={stage} position={position} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
