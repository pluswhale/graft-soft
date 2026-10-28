import { UsersRound } from "lucide-react";
import type { Dictionary } from "@/content/types";

type Approach = Dictionary["studio"]["approach"];

function Connector() {
  return (
    <div aria-hidden className="relative mx-auto h-8 w-px bg-border-strong">
      <span className="layer-packet absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-primary" />
    </div>
  );
}

export function LayerDiagram({ approach }: { approach: Approach }) {
  return (
    <div aria-hidden>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border-strong px-4 py-3.5">
        <span className="flex items-center gap-3 text-[0.9375rem] font-semibold text-ink">
          <UsersRound className="size-4 text-ink-secondary" strokeWidth={1.75} />
          {approach.team}
        </span>
        <span className="text-right font-mono text-[0.6875rem] text-ink-muted">{approach.teamNote}</span>
      </div>
      <Connector />
      <div className="relative isolate overflow-hidden rounded-2xl bg-primary px-4 py-4 text-white shadow-[0_18px_40px_-20px_rgb(49_94_251/0.9)]">
        <span className="layer-sheen absolute inset-y-0 -left-1/3 -z-10 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.22),transparent)]" />
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.9375rem] font-semibold">{approach.layer}</span>
          <span className="flex gap-1">
            <span className="size-1.5 rounded-full bg-mint" />
            <span className="size-1.5 rounded-full bg-white/60" />
            <span className="size-1.5 rounded-full bg-white/30" />
          </span>
        </div>
        <p className="mt-1 font-mono text-[0.6875rem] text-white/70">{approach.layerNote}</p>
      </div>
      <Connector />
      <div className="rounded-2xl border border-border bg-surface-muted p-3">
        <p className="px-1 pb-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">{approach.systems}</p>
        <div className="grid grid-cols-2 gap-2">
          {approach.systemItems.map((item) => (
            <span key={item} className="rounded-xl border border-border bg-surface px-3 py-2 text-[0.875rem] font-medium text-ink">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
