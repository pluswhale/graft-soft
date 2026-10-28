import type { Dictionary } from "@/content/types";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";

type Sheets = Dictionary["audit"]["sheets"];

const DOTS = [
  { x: 22, y: 26, start: true },
  { x: 34, y: 38, start: true },
  { x: 70, y: 22, start: false },
  { x: 62, y: 66, start: false },
  { x: 28, y: 72, start: false },
  { x: 82, y: 58, start: false },
];

const BARS = [
  { offset: 0, width: 34 },
  { offset: 26, width: 46 },
  { offset: 60, width: 40 },
];

function SheetTitle({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span className="text-[0.8125rem] font-semibold text-ink">{children}</span>
      <span className="font-mono text-[0.6875rem] text-ink-muted">{index}</span>
    </div>
  );
}

export function AuditSheets({ sheets }: { sheets: Sheets }) {
  return (
    <div aria-hidden className="relative h-[25rem] sm:h-[27rem]">
      <ParallaxLayer speed={0.05} depth={-8} className="absolute right-0 top-0 w-[72%] sm:w-[60%]">
        <div className="rotate-[3deg] rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <SheetTitle index="03">{sheets.roadmap}</SheetTitle>
          <div className="mt-4 space-y-3">
            {sheets.roadmapRows.map((row, index) => (
              <div key={row} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
                <span className="truncate font-mono text-[0.6875rem] text-ink-secondary">{row}</span>
                <span className="relative h-2.5 rounded-full bg-surface-muted">
                  <span
                    className="absolute inset-y-0 rounded-full bg-violet/70"
                    style={{ left: `${BARS[index]?.offset ?? 0}%`, width: `${BARS[index]?.width ?? 30}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.01} depth={6} className="absolute left-0 top-[18%] w-[70%] sm:w-[54%]">
        <div className="-rotate-[2.5deg] rounded-2xl border border-border bg-surface p-5 shadow-float">
          <SheetTitle index="02">{sheets.priorities}</SheetTitle>
          <div className="relative mt-4 aspect-[4/3] rounded-lg border border-border">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
            <div className="absolute left-0 top-0 h-1/2 w-1/2 rounded-tl-lg bg-mint/25" />
            <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[0.625rem] text-white">
              {sheets.startHere}
            </span>
            {DOTS.map((dot) => (
              <span
                key={`${dot.x}-${dot.y}`}
                className={dot.start ? "absolute size-3 rounded-full bg-primary ring-4 ring-primary/15" : "absolute size-2.5 rounded-full bg-border-strong"}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[0.625rem] text-ink-muted">
            <span>↑ {sheets.impact}</span>
            <span>{sheets.effort} →</span>
          </div>
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={-0.06} depth={18} className="absolute bottom-0 right-0 w-full sm:right-[2%] sm:w-[68%]">
        <div className="rotate-[1deg] rounded-2xl border border-border bg-surface p-5 shadow-float">
          <SheetTitle index="01">{sheets.map}</SheetTitle>
          <div className="mt-5 flex items-center">
            {sheets.mapNodes.map((node, index) => (
              <div key={node} className="flex flex-1 items-center last:flex-none">
                <span
                  className={
                    index === 1
                      ? "rounded-md border border-dashed border-amber-ink/60 bg-lime/30 px-1.5 py-1 font-mono text-[0.625rem] text-ink sm:px-2"
                      : "rounded-md border border-border bg-surface-muted px-1.5 py-1 font-mono text-[0.625rem] text-ink sm:px-2"
                  }
                >
                  {node}
                </span>
                {index < sheets.mapNodes.length - 1 ? <span className="mx-0.5 h-px min-w-1.5 flex-1 bg-border-strong sm:mx-1" /> : null}
              </div>
            ))}
          </div>
        </div>
      </ParallaxLayer>
    </div>
  );
}
