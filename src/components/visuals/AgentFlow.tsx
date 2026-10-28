import { CornerDownRight, UserRound } from "lucide-react";
import type { Dictionary } from "@/content/types";

type Flow = Dictionary["services"]["featured"]["flow"];

export function AgentFlow({ flow }: { flow: Flow }) {
  return (
    <div aria-hidden className="relative">
      <div className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-[0.875rem] text-white">
        {flow.input}
      </div>
      <ol className="relative ml-5 border-l border-dashed border-white/25 py-2 pl-6">
        {flow.steps.map((step, index) => (
          <li key={step} className="relative py-2.5">
            <span className="absolute -left-[1.85rem] top-1/2 flex size-3 -translate-y-1/2 items-center justify-center rounded-full border border-mint bg-night">
              <span className="size-1 rounded-full bg-mint" />
            </span>
            <span className="flex items-center gap-3 text-[0.875rem] text-white/85">
              <span className="font-mono text-[0.6875rem] text-white/45">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </span>
            {index === 1 ? (
              <span className="mt-2 flex w-fit items-center gap-2 rounded-full border border-dashed border-lime/60 px-3 py-1 text-[0.75rem] text-lime">
                <CornerDownRight className="size-3.5" />
                {flow.handoff}
                <UserRound className="size-3.5" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-[0.875rem] font-semibold text-white">
        {flow.output}
        <span className="size-2 rounded-full bg-mint" />
      </div>
    </div>
  );
}
