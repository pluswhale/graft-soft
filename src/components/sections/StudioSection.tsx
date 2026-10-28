import type { Dictionary } from "@/content/types";
import { reveal } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LayerDiagram } from "@/components/visuals/LayerDiagram";

export function StudioSection({ studio }: { studio: Dictionary["studio"] }) {
  return (
    <section id="studio" aria-labelledby="studio-title" className="section-space relative">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div {...reveal()}>
              <Eyebrow>{studio.eyebrow}</Eyebrow>
              <h2 id="studio-title" className="mt-6 text-heading font-semibold">
                {studio.title}
              </h2>
            </div>
            <p className="mt-10 max-w-[44rem] text-statement font-medium text-ink" {...reveal(120)}>
              {studio.statement}
            </p>
          </div>

          <aside className="lg:col-span-5 lg:col-start-8" {...reveal(200)}>
            <div className="relative overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-soft sm:p-8">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-primary">{studio.approach.label}</p>
              <h3 className="mt-3 text-[1.5rem] font-semibold leading-tight tracking-[-0.03em]">{studio.approach.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-secondary">{studio.approach.text}</p>
              <div className="mt-7">
                <LayerDiagram approach={studio.approach} />
              </div>
            </div>
          </aside>
        </div>

        <ol className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-10 lg:mt-28 lg:grid-cols-4">
          {studio.principles.map((principle, index) => (
            <li key={principle.title} className="border-t border-ink pt-6" {...reveal(index * 90)}>
              <span className="font-mono text-[0.75rem] text-primary">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-[1.0625rem] font-semibold tracking-[-0.025em] sm:text-[1.25rem]">{principle.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-secondary">{principle.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
