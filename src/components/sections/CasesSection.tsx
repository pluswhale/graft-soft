import type { CaseConcept, Dictionary } from "@/content/types";
import { cn } from "@/lib/cn";
import { reveal } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Disclosure } from "@/components/ui/Disclosure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseScenario } from "@/components/visuals/CaseScenario";

type Labels = Dictionary["cases"]["labels"];

function DetailList({ title, items, tone = "plain" }: { title: string; items: string[]; tone?: "plain" | "hypothesis" }) {
  return (
    <div className="border-t border-border pt-5">
      <h4
        className={cn(
          "font-mono text-[0.6875rem] uppercase tracking-[0.12em]",
          tone === "hypothesis" ? "text-violet-ink" : "text-ink-muted",
        )}
      >
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-secondary">
            <span aria-hidden className={cn("mt-[0.55rem] size-1 shrink-0 rounded-full", tone === "hypothesis" ? "bg-violet" : "bg-ink")} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CaseFeature({
  item,
  index,
  labels,
  badge,
  common,
}: {
  item: CaseConcept;
  index: number;
  labels: Labels;
  badge: string;
  common: Dictionary["common"];
}) {
  const flipped = index % 2 === 1;

  return (
    <article aria-labelledby={`case-${item.id}`} className="border-t border-ink pt-8 lg:pt-14">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className={cn("lg:col-span-5", flipped && "lg:order-2 lg:col-start-8")} {...reveal()}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[0.75rem] text-ink-muted">05.{index + 1}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/[0.07] px-3 py-1 text-[0.75rem] font-semibold text-violet-ink">
              <span aria-hidden className="size-1.5 rounded-full bg-violet" />
              {badge}
            </span>
          </div>
          <p className="mt-6 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-primary">{item.industry}</p>
          <h3
            id={`case-${item.id}`}
            className="mt-3 text-[clamp(1.75rem,1.3rem+1.5vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.035em]"
          >
            {item.title}
          </h3>
          <h4 className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">{labels.problem}</h4>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-secondary">{item.problem}</p>
        </div>

        <div className={cn("lg:col-span-7", flipped && "lg:order-1 lg:col-start-1")} {...reveal(140)}>
          <CaseScenario scenario={item.scenario} labels={labels} />
        </div>
      </div>

      <div className="mt-6 lg:mt-12" {...reveal(80)}>
        <Disclosure showLabel={common.details} hideLabel={common.hideDetails}>
          <div className="grid gap-8 pt-6 sm:grid-cols-2 lg:pt-0 xl:grid-cols-4">
            <DetailList title={labels.solution} items={item.solution} />
            <DetailList title={labels.systems} items={item.systems} />
            <DetailList title={labels.expected} items={item.expected} tone="hypothesis" />
            <DetailList title={labels.validate} items={item.validate} />
          </div>
        </Disclosure>
      </div>
    </article>
  );
}

export function CasesSection({ cases, common }: { cases: Dictionary["cases"]; common: Dictionary["common"] }) {
  return (
    <section id="cases" aria-labelledby="cases-title" className="section-space relative border-t border-border">
      <Container>
        <SectionHeading id="cases-title" eyebrow={cases.eyebrow} title={cases.title} lead={cases.lead} />
        <p
          className="mt-10 flex max-w-[52rem] gap-3 rounded-2xl border border-violet/25 bg-violet/[0.05] px-5 py-4 text-[0.9375rem] leading-relaxed text-ink"
          {...reveal()}
        >
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" />
          {cases.integrityNote}
        </p>

        <div className="mt-14 space-y-16 lg:mt-24 lg:space-y-32">
          {cases.items.map((item, index) => (
            <CaseFeature key={item.id} item={item} index={index} labels={cases.labels} badge={cases.badge} common={common} />
          ))}
        </div>
      </Container>
    </section>
  );
}
