"use client";

import { Check, Clock, CornerDownRight, TriangleAlert } from "lucide-react";
import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import type { CaseConcept, Dictionary, StatusTone } from "@/content/types";
import { cn } from "@/lib/cn";
import { PointerGlow } from "@/components/motion/PointerGlow";

type Mode = "now" | "after";

type CaseScenarioProps = {
  scenario: CaseConcept["scenario"];
  labels: Dictionary["cases"]["labels"];
};

const SWAP_MS = 200;

const tones: Record<StatusTone, { className: string; icon: ReactNode }> = {
  ok: { className: "bg-mint/30 text-mint-ink", icon: <Check className="size-3.5" strokeWidth={2.5} /> },
  warn: { className: "bg-lime/40 text-amber-ink", icon: <TriangleAlert className="size-3.5" strokeWidth={2.25} /> },
  info: { className: "bg-primary-soft text-primary-hover", icon: <CornerDownRight className="size-3.5" strokeWidth={2.25} /> },
  muted: { className: "bg-surface-muted text-ink-secondary", icon: <Clock className="size-3.5" strokeWidth={2.25} /> },
};

export function CaseScenario({ scenario, labels }: CaseScenarioProps) {
  const [mode, setMode] = useState<Mode>("after");
  const [swapping, setSwapping] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const switchTo = (next: Mode) => {
    if (next === mode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode(next);
      return;
    }
    setSwapping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setMode(next);
      setSwapping(false);
    }, SWAP_MS);
  };

  const onBoardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("button")) return;
    switchTo(mode === "now" ? "after" : "now");
  };

  const state = scenario[mode];

  return (
    <div
      data-pointer-field=""
      data-cursor="view"
      data-cursor-label={labels.cursor}
      onClick={onBoardClick}
      className="relative isolate overflow-hidden rounded-[28px] border border-border bg-surface/90 p-5 shadow-float sm:p-7"
    >
      <PointerGlow />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">{labels.illustrative}</p>
          <p className="mt-1.5 text-[1rem] font-semibold tracking-[-0.015em] text-ink">{scenario.title}</p>
        </div>
        <div role="group" aria-label={labels.compare} className="flex rounded-full border border-border bg-surface-muted p-1">
          {(["now", "after"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              onClick={() => switchTo(option)}
              data-cursor="link"
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-300",
                mode === option ? "bg-ink text-white" : "text-ink-secondary hover:text-ink",
              )}
            >
              {labels[option]}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="scenario-swap mt-6" data-swapping={swapping}>
        <p className="scenario-row flex items-center gap-2 font-mono text-[0.75rem] text-ink-secondary">
          <span className={cn("size-1.5 rounded-full", mode === "after" ? "bg-mint-ink" : "bg-amber-ink")} />
          {state.caption}
        </p>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {state.rows.map((row, index) => {
            const tone = tones[row.tone];
            return (
              <li
                key={`${row.time}-${index}`}
                className="scenario-row grid grid-cols-[4.25rem_1fr] gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[4.75rem_1fr_auto] sm:items-center"
                style={{ "--i": index }}
              >
                <span className="font-mono text-[0.75rem] text-ink-muted">{row.time}</span>
                <span className="text-[0.875rem] leading-snug text-ink">{row.text}</span>
                <span
                  className={cn(
                    "col-start-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-medium leading-tight sm:col-start-3 sm:max-w-[15rem]",
                    tone.className,
                  )}
                >
                  <span aria-hidden className="shrink-0">
                    {tone.icon}
                  </span>
                  {row.status}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="scenario-row mt-4 border-l-2 border-primary pl-3 text-[0.875rem] leading-relaxed text-ink-secondary" style={{ "--i": state.rows.length }}>
          {state.summary}
        </p>
      </div>
    </div>
  );
}
