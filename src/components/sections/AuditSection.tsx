import type { Dictionary } from "@/content/types";
import { reveal } from "@/lib/motion";
import { site } from "@/lib/site";
import { PointerGlow } from "@/components/motion/PointerGlow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuditSheets } from "@/components/visuals/AuditSheets";

type AuditSectionProps = {
  audit: Dictionary["audit"];
  newTabLabel: string;
};

export function AuditSection({ audit, newTabLabel }: AuditSectionProps) {
  return (
    <section
      id="audit"
      aria-labelledby="audit-title"
      data-pointer-field=""
      className="section-space relative isolate overflow-hidden bg-surface-muted"
    >
      <PointerGlow />
      <Container>
        <SectionHeading id="audit-title" eyebrow={audit.eyebrow} title={audit.title} lead={audit.lead} />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:sticky lg:top-12 lg:self-start">
            <h3 className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted" {...reveal()}>
              {audit.examineTitle}
            </h3>
            <ol className="mt-6">
              {audit.examine.map((item, index) => (
                <li
                  key={item}
                  className="grid grid-cols-[3rem_1fr] items-baseline border-t border-border-strong/70 py-4 last:border-b"
                  {...reveal(index * 60)}
                >
                  <span className="font-mono text-[0.75rem] text-primary">A.{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] text-ink">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <div {...reveal(100)}>
              <AuditSheets sheets={audit.sheets} />
            </div>
            <h3 className="mt-14 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted" {...reveal()}>
              {audit.deliverablesTitle}
            </h3>
            <ul className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {audit.deliverables.map((item, index) => (
                <li key={item.title} className="border-l-2 border-primary/30 pl-4" {...reveal(index * 60)}>
                  <h4 className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">{item.title}</h4>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-secondary">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <figure className="mt-20 rounded-[28px] border border-border bg-surface p-6 shadow-soft sm:p-9 lg:mt-24" {...reveal()}>
          <figcaption className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">
            {audit.example.label}
          </figcaption>
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            {audit.example.factors.map((factor, index) => (
              <div key={factor} className="flex items-center gap-3 lg:gap-4">
                {index > 0 ? (
                  <span aria-hidden className="font-mono text-[1.25rem] text-ink-muted">
                    ×
                  </span>
                ) : null}
                <span className="rounded-2xl border border-border bg-canvas px-4 py-3 text-[1rem] font-medium text-ink">
                  {factor}
                </span>
              </div>
            ))}
            <span aria-hidden className="font-mono text-[1.25rem] text-ink-muted">
              =
            </span>
            <span className="w-fit rounded-2xl bg-ink px-5 py-3 text-[1.125rem] font-semibold tracking-[-0.02em] text-white">
              ≈ {audit.example.result}
            </span>
          </div>
          <p className="mt-6 max-w-[48rem] text-[0.875rem] leading-relaxed text-ink-secondary">{audit.example.note}</p>
        </figure>

        <div
          className="mt-14 flex flex-col gap-8 border-t border-border-strong/70 pt-10 md:flex-row md:items-center md:justify-between"
          {...reveal()}
        >
          <p className="max-w-[36rem] text-[0.9375rem] leading-relaxed text-ink-secondary">{audit.disclaimer}</p>
          <Button href={site.telegram} external newTabLabel={newTabLabel} className="shrink-0">
            {audit.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
