import type { Dictionary } from "@/content/types";
import { reveal } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ProcessSection({ process }: { process: Dictionary["process"] }) {
  return (
    <section id="process" aria-labelledby="process-title" className="section-space relative">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24" {...reveal()}>
              <Eyebrow>{process.eyebrow}</Eyebrow>
              <h2 id="process-title" className="mt-6 text-heading font-semibold">
                {process.title}
              </h2>
              <p className="mt-6 max-w-md text-lead text-ink-secondary lg:mt-8">{process.lead}</p>
            </div>
          </div>

          <ol
            data-progress=""
            suppressHydrationWarning
            className="relative space-y-4 lg:col-span-7 lg:space-y-0"
          >
            <span aria-hidden className="absolute bottom-6 left-[0.6875rem] top-6 hidden w-px bg-border-strong lg:block" />
            <span aria-hidden className="process-fill absolute bottom-6 left-[0.6875rem] top-6 hidden w-px bg-primary lg:block" />
            {process.steps.map((step, index) => (
              <li
                key={step.title}
                data-step=""
                suppressHydrationWarning
                className="process-card sticky rounded-3xl border border-border bg-surface p-6 shadow-float lg:static lg:grid lg:grid-cols-[1.5rem_1fr] lg:gap-x-10 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pb-14 lg:shadow-none lg:last:pb-0"
                style={{ "--stack": index }}
              >
                <span
                  aria-hidden
                  className="step-node relative z-10 mt-[0.4rem] hidden size-[1.375rem] items-center justify-center rounded-full border border-primary bg-primary shadow-[0_0_0_6px_var(--color-canvas)] after:size-1.5 after:rounded-full after:bg-white after:content-[''] lg:flex"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.75rem] text-primary lg:text-ink-muted">
                      {String(index + 1).padStart(2, "0")}
                      <span className="text-ink-muted lg:hidden"> / {String(process.steps.length).padStart(2, "0")}</span>
                    </span>
                  </div>
                  <h3 className="step-title mt-3 text-[clamp(1.375rem,1.2rem+1.1vw,2.25rem)] font-semibold leading-tight tracking-[-0.035em] text-ink lg:mt-2">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[34rem] text-[1rem] leading-relaxed text-ink-secondary lg:mt-4">{step.text}</p>
                  <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-border bg-canvas px-3.5 py-1.5 text-[0.8125rem] lg:bg-surface">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">{process.outputLabel}</span>
                    <span className="font-semibold text-ink">{step.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
