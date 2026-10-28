import { FileText, Globe, MessageCircle, Phone } from "lucide-react";
import type { Dictionary } from "@/content/types";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";

type HeroVisual = Dictionary["hero"]["visual"];

const W = 720;
const H = 380;
const CORE = { x: 360, y: 190 };
const SOURCE_X = 100;
const SOURCE_YS = [70, 150, 230, 310];
const TARGET_X = 630;
const TARGET_YS = [100, 190, 280];
const SOURCE_ICONS = [MessageCircle, Phone, FileText, Globe];

const sourcePath = (y: number) => `M150 ${y} C 222 ${y}, 228 ${CORE.y}, 290 ${CORE.y}`;
const targetPath = (y: number) => `M430 ${CORE.y} C 494 ${CORE.y}, 512 ${y}, 588 ${y}`;
const left = (x: number) => `${(x / W) * 100}%`;
const top = (y: number) => `${(y / H) * 100}%`;

export function HeroComposition({ visual }: { visual: HeroVisual }) {
  return (
    <div className="relative">
      <div className="relative hidden md:block" role="img" aria-label={visual.label}>
        <ParallaxLayer speed={0.04} depth={-6}>
          <div className="relative aspect-[720/380] overflow-hidden rounded-[28px] border border-border bg-surface/85 shadow-float [container-type:inline-size]">
            <div
              aria-hidden
              className="hairline-grid absolute inset-0 [mask-image:radial-gradient(75%_70%_at_50%_50%,#000_30%,transparent_100%)]"
            />

            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden fill="none">
              {SOURCE_YS.map((y) => (
                <g key={`s-${y}`}>
                  <path d={sourcePath(y)} stroke="var(--color-border-strong)" strokeWidth="1.25" />
                  <path d={sourcePath(y)} className="flow-path" stroke="var(--color-primary)" strokeOpacity="0.55" strokeWidth="1.25" />
                </g>
              ))}
              {TARGET_YS.map((y) => (
                <g key={`t-${y}`}>
                  <path d={targetPath(y)} stroke="var(--color-border-strong)" strokeWidth="1.25" />
                  <path d={targetPath(y)} className="flow-path" stroke="var(--color-violet)" strokeOpacity="0.6" strokeWidth="1.25" />
                </g>
              ))}
              {SOURCE_YS.map((y, index) => (
                <circle key={`ps-${y}`} r="3.5" fill="var(--color-primary)" className="motion-packet">
                  <animateMotion dur="2.8s" begin={`${index * 0.65}s`} repeatCount="indefinite" path={sourcePath(y)} />
                </circle>
              ))}
              {TARGET_YS.map((y, index) => (
                <circle key={`pt-${y}`} r="3.5" fill="var(--color-mint)" stroke="var(--color-mint-ink)" strokeWidth="1" className="motion-packet">
                  <animateMotion dur="2.4s" begin={`${1.1 + index * 0.7}s`} repeatCount="indefinite" path={targetPath(y)} />
                </circle>
              ))}
            </svg>

            {visual.sources.map((source, index) => {
              const Icon = SOURCE_ICONS[index % SOURCE_ICONS.length];
              return (
                <div
                  key={source}
                  aria-hidden
                  className="absolute flex w-[18.5cqw] -translate-x-1/2 -translate-y-1/2 items-center gap-[1cqw] rounded-[1.4cqw] border border-border bg-surface px-[1.4cqw] py-[1.05cqw] text-[length:max(10px,1.72cqw)] font-medium text-ink shadow-soft"
                  style={{ left: left(SOURCE_X), top: top(SOURCE_YS[index]) }}
                >
                  <Icon className="size-[2cqw] shrink-0 text-ink-secondary" strokeWidth={1.75} />
                  <span className="truncate">{source}</span>
                </div>
              );
            })}

            <div
              aria-hidden
              className="absolute w-[19.5cqw] -translate-x-1/2 -translate-y-1/2"
              style={{ left: left(CORE.x), top: top(CORE.y) }}
            >
              <div className="pulse-ring absolute inset-0 rounded-[2.4cqw] border border-primary" />
              <div className="relative rounded-[2.4cqw] bg-ink px-[2cqw] py-[1.9cqw] text-white shadow-float">
                <div className="flex items-center justify-between">
                  <span className="text-[length:max(11px,2.3cqw)] font-semibold tracking-[-0.02em]">{visual.core}</span>
                  <span className="relative flex size-[1.3cqw]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-60 motion-reduce:animate-none" />
                    <span className="relative size-full rounded-full bg-mint" />
                  </span>
                </div>
                <p className="mt-[0.9cqw] font-mono text-[length:max(9px,1.45cqw)] leading-snug tracking-[0.02em] text-white/60">
                  {visual.coreCaption}
                </p>
              </div>
            </div>

            {visual.targets.map((target, index) => (
              <div
                key={target}
                aria-hidden
                className="absolute flex w-[11.5cqw] -translate-x-1/2 -translate-y-1/2 items-center justify-between rounded-[1.4cqw] border border-primary/25 bg-primary-soft px-[1.4cqw] py-[1.05cqw] text-[length:max(10px,1.72cqw)] font-semibold text-ink"
                style={{ left: left(TARGET_X), top: top(TARGET_YS[index]) }}
              >
                <span>{target}</span>
                <span className="size-[1cqw] rounded-full bg-primary" />
              </div>
            ))}
          </div>
        </ParallaxLayer>

        <ParallaxLayer speed={-0.07} depth={16} className="absolute -right-4 -top-24 hidden w-[19rem] xl:block">
          <div aria-hidden className="space-y-2">
            <div className="ml-auto w-fit max-w-[18rem] rounded-2xl rounded-br-md border border-border bg-surface px-4 py-3 text-[0.8125rem] leading-snug text-ink shadow-float">
              {visual.chatIn}
            </div>
            <div className="w-fit max-w-[14rem] rounded-2xl rounded-bl-md bg-primary px-4 py-3 text-[0.8125rem] leading-snug text-white shadow-float">
              {visual.chatOut}
            </div>
          </div>
        </ParallaxLayer>

        <ParallaxLayer speed={-0.12} depth={24} className="absolute -bottom-16 left-[27%] hidden w-[15.5rem] xl:block">
          <div aria-hidden className="rounded-2xl border border-border bg-surface p-4 shadow-float">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-mint" />
              <span className="text-[0.8125rem] font-semibold text-ink">{visual.record.title}</span>
            </div>
            <p className="mt-0.5 pl-4 font-mono text-[0.6875rem] text-ink-muted">{visual.record.meta}</p>
            <dl className="mt-3 space-y-1.5 border-t border-border pt-3">
              {visual.record.rows.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-3 text-[0.75rem]">
                  <dt className="text-ink-muted">{term}</dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </ParallaxLayer>

        <ParallaxLayer speed={-0.03} depth={9} className="absolute -top-4 left-8 hidden xl:block">
          <p
            aria-hidden
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 font-mono text-[0.6875rem] text-ink-secondary shadow-soft"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {visual.log}
          </p>
        </ParallaxLayer>
      </div>

      <HeroFlowCompact visual={visual} />
    </div>
  );
}

function CompactConnector({ delay }: { delay: string }) {
  return (
    <div aria-hidden className="relative ml-6 h-8 w-px bg-[linear-gradient(to_bottom,var(--color-border-strong),var(--color-primary))]">
      <span className="layer-packet absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-primary" style={{ animationDelay: delay }} />
    </div>
  );
}

function HeroFlowCompact({ visual }: { visual: HeroVisual }) {
  return (
    <div
      role="img"
      aria-label={visual.label}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface/85 p-5 shadow-soft md:hidden"
    >
      <ParallaxLayer speed={0.05}>
        <div aria-hidden className="flex flex-wrap gap-2">
          {visual.sources.map((source, index) => (
            <span
              key={source}
              className="hero-chip rounded-full border border-border bg-surface px-3 py-1.5 text-[0.8125rem] text-ink"
              style={{ "--i": index }}
            >
              {source}
            </span>
          ))}
        </div>
      </ParallaxLayer>
      <CompactConnector delay="0s" />
      <div aria-hidden className="relative isolate flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-ink px-4 py-3.5 text-white">
        <span className="layer-sheen absolute inset-y-0 -left-1/3 -z-10 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.14),transparent)]" />
        <span className="flex items-center gap-2 whitespace-nowrap font-semibold">
          <span className="size-1.5 rounded-full bg-mint" />
          {visual.core}
        </span>
        <span className="text-right font-mono text-[0.6875rem] leading-snug text-white/60">{visual.coreCaption}</span>
      </div>
      <CompactConnector delay="0.9s" />
      <ParallaxLayer speed={-0.05}>
        <div aria-hidden className="flex flex-wrap gap-2">
          {visual.targets.map((target, index) => (
            <span
              key={target}
              className="hero-chip rounded-full border border-primary/25 bg-primary-soft px-3 py-1.5 text-[0.8125rem] font-semibold text-ink"
              style={{ "--i": index + 5 }}
            >
              {target}
            </span>
          ))}
        </div>
      </ParallaxLayer>
    </div>
  );
}
