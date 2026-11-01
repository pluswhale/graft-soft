import { Plus } from "lucide-react";
import type { Dictionary, EngagementModel } from "@/content/types";
import { cn } from "@/lib/cn";
import { reveal } from "@/lib/motion";
import { site } from "@/lib/site";
import { PointerGlow } from "@/components/motion/PointerGlow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SwipeTrack } from "@/components/ui/SwipeTrack";

type EngagementSectionProps = {
  engagement: Dictionary["engagement"];
  newTabLabel: string;
  swipeHint: string;
};

function ModelCard({ model, index, dark }: { model: EngagementModel; index: number; dark: boolean }) {
  return (
    <article
      data-pointer-field={dark ? "" : undefined}
      suppressHydrationWarning
      data-cursor-theme={dark ? "dark" : undefined}
      className={cn(
        "relative isolate flex w-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] p-6 sm:w-[62%] sm:p-10 md:w-auto md:rounded-[32px]",
        dark ? "bg-night text-white" : "border border-border bg-surface shadow-soft",
      )}
    >
      {dark ? <PointerGlow variant="night" /> : null}
      <div className="flex items-center justify-between">
        <span className={cn("font-mono text-[0.75rem] uppercase tracking-[0.12em]", dark ? "text-mint" : "text-primary")}>
          {model.kicker}
        </span>
        <span className={cn("font-mono text-[0.75rem]", dark ? "text-white/45" : "text-ink-muted")}>
          {String(index + 1).padStart(2, "0")} / 02
        </span>
      </div>
      <h3 className="mt-8 text-[clamp(1.75rem,1.35rem+1.3vw,2.625rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
        {model.title}
      </h3>
      <p className={cn("mt-4 text-[1.0625rem] leading-relaxed", dark ? "text-white/70" : "text-ink-secondary")}>{model.text}</p>
      <ul className={cn("mt-8 flex-1 border-t", dark ? "border-white/15" : "border-border")}>
        {model.items.map((item) => (
          <li
            key={item}
            className={cn(
              "flex items-center gap-4 border-b py-3.5 text-[0.9875rem]",
              dark ? "border-white/15 text-white/90" : "border-border text-ink",
            )}
          >
            <Plus aria-hidden className={cn("size-4 shrink-0", dark ? "text-mint" : "text-primary")} strokeWidth={2} />
            {item}
          </li>
        ))}
      </ul>
      <p className={cn("mt-8 text-[0.875rem] leading-relaxed", dark ? "text-white/60" : "text-ink-secondary")}>{model.fit}</p>
    </article>
  );
}

export function EngagementSection({ engagement, newTabLabel, swipeHint }: EngagementSectionProps) {
  return (
    <section id="engagement" aria-labelledby="engagement-title" className="section-space relative bg-surface-muted">
      <Container>
        <SectionHeading id="engagement-title" eyebrow={engagement.eyebrow} title={engagement.title} lead={engagement.lead} />

        <p
          className="mt-12 flex max-w-[44rem] items-start gap-4 text-statement font-medium text-ink lg:mt-16"
          {...reveal()}
        >
          <span aria-hidden className="mt-[0.55em] h-px w-10 shrink-0 bg-primary" />
          {engagement.pilot}
        </p>

        <div className="mt-12 lg:mt-14" {...reveal(80)}>
          <SwipeTrack hint={swipeHint} label={engagement.title} className="md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
            {engagement.models.map((model, index) => (
              <ModelCard key={model.title} model={model} index={index} dark={index === 1} />
            ))}
          </SwipeTrack>
        </div>

        <div
          className="mt-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between"
          {...reveal()}
        >
          <p className="max-w-[32rem] text-[0.9375rem] leading-relaxed text-ink-secondary">{engagement.note}</p>
          <Button href={site.telegram} external newTabLabel={newTabLabel} className="shrink-0">
            {engagement.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
