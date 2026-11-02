"use client";

import { useMemo } from "react";
import { MousePointerClick } from "lucide-react";
import { AccordionStep } from "./AccordionStep";
import { useHorizontalAccordion } from "@/lib/useHorizontalAccordion";
import { ACCENTS } from "@/components/visuals/mindmap/accents";
import { cn } from "@/lib/cn";
import type { Stage } from "@/content/types";

interface HorizontalAccordionProps {
  steps: Stage[];
  stageLabel: string;
  statusOverview: string;
  hint: string;
}

/**
 * Horizontal accordion timeline.
 *
 * Inactive steps stack as compact vertical cards on the left; clicking a step
 * expands it to the full remaining width (framer-motion `layout` animations),
 * pushing the other compact cards aside. Clicking the active step collapses
 * the accordion back to equal compact cards.
 */
export function HorizontalAccordion({ steps, stageLabel, statusOverview, hint }: HorizontalAccordionProps) {
  const stepIds = useMemo(() => steps.map((step) => step.id), [steps]);
  const { activeId, toggle } = useHorizontalAccordion(stepIds, stepIds[0]);

  const activeStep = steps.find((step) => step.id === activeId) ?? null;
  const activeAccent = activeStep ? ACCENTS[activeStep.accent] : null;

  return (
    <div>
      <div className="flex h-[640px] select-none flex-col gap-3 sm:h-[600px] md:flex-row">
        {steps.map((stage, index) => (
          <AccordionStep
            key={stage.id}
            stage={stage}
            position={index}
            isActive={stage.id === activeId}
            onToggle={() => toggle(stage.id)}
            stageLabel={stageLabel}
          />
        ))}
      </div>

      {/* Status bar */}
      <div className="mt-5 flex items-center justify-between gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-2">
          {activeStep && activeAccent ? (
            <>
              <span aria-hidden className={cn("h-2 w-2 rounded-full", activeAccent.dot)} />
              <span className="font-mono">
                {String(activeStep.index).padStart(2, "0")} · {activeStep.title}
              </span>
              <span className="hidden text-ink-secondary sm:inline">— {activeStep.duration}</span>
            </>
          ) : (
            <>
              <span aria-hidden className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="font-mono">
                {steps.length} {statusOverview}
              </span>
            </>
          )}
        </span>
        <span className="flex items-center gap-1.5">
          <MousePointerClick className="h-3.5 w-3.5" />
          {hint}
        </span>
      </div>
    </div>
  );
}
