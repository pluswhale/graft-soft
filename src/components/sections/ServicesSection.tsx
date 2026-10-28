import type { Dictionary } from "@/content/types";
import { reveal } from "@/lib/motion";
import { PointerGlow } from "@/components/motion/PointerGlow";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SwipeTrack } from "@/components/ui/SwipeTrack";
import { AgentFlow } from "@/components/visuals/AgentFlow";

function Tags({ tags, tone = "light" }: { tags: string[]; tone?: "light" | "dark" }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className={
            tone === "light"
              ? "rounded-full border border-border px-2.5 py-1 font-mono text-[0.6875rem] text-ink-secondary"
              : "rounded-full border border-white/15 px-2.5 py-1 font-mono text-[0.6875rem] text-white/70"
          }
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

type ServicesSectionProps = {
  services: Dictionary["services"];
  swipeHint: string;
};

export function ServicesSection({ services, swipeHint }: ServicesSectionProps) {
  const { featured } = services;

  return (
    <section id="services" aria-labelledby="services-title" className="section-space relative border-t border-border">
      <Container>
        <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} lead={services.lead} />

        <div className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <article
            data-pointer-field=""
            data-cursor-theme="dark"
            className="relative isolate flex flex-col overflow-hidden rounded-[32px] bg-night p-7 text-white sm:p-10 lg:sticky lg:top-8 lg:col-span-5 lg:self-start"
            {...reveal()}
          >
            <PointerGlow variant="night" />
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.75rem] text-mint">01</span>
              <span className="rounded-full bg-mint/15 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-mint">
                AI
              </span>
            </div>
            <h3 className="mt-8 text-[clamp(1.75rem,1.4rem+1vw,2.375rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
              {featured.title}
            </h3>
            <p className="mt-5 text-[0.9875rem] leading-relaxed text-white/70">{featured.text}</p>
            <div className="mt-10">
              <AgentFlow flow={featured.flow} />
            </div>
            <div className="mt-8">
              <Tags tags={featured.tags} tone="dark" />
            </div>
          </article>

          <div className="min-w-0 lg:col-span-7" {...reveal(80)}>
            <SwipeTrack as="ol" hint={swipeHint} label={services.title} className="md:block md:border-t md:border-border">
              {services.items.map((service, index) => (
                <li
                  key={service.title}
                  className="group relative flex w-[82%] shrink-0 snap-start flex-col rounded-3xl border border-border bg-surface p-6 shadow-soft sm:w-[55%] md:grid md:w-auto md:grid-cols-[3.5rem_1fr] md:gap-x-6 md:rounded-none md:border-0 md:border-b md:bg-transparent md:px-0 md:py-8 md:shadow-none"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-3 hidden w-0.5 origin-top scale-y-0 bg-primary transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-y-100 md:block"
                  />
                  <span className="font-mono text-[0.75rem] text-primary transition-colors md:text-ink-muted md:group-hover:text-primary">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <div className="mt-6 flex flex-1 flex-col gap-5 md:mt-0 md:grid md:grid-cols-[1fr_minmax(9rem,12rem)] md:gap-8">
                    <div>
                      <h3 className="text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] font-semibold leading-tight tracking-[-0.03em] transition-transform duration-500 ease-[var(--ease-expo)] md:group-hover:translate-x-1">
                        {service.title}
                      </h3>
                      <p className="mt-2.5 max-w-[34rem] text-[0.9375rem] leading-relaxed text-ink-secondary">{service.text}</p>
                    </div>
                    <div className="mt-auto md:mt-0 md:pt-1.5">
                      <Tags tags={service.tags} />
                    </div>
                  </div>
                </li>
              ))}
            </SwipeTrack>
          </div>
        </div>
      </Container>
    </section>
  );
}
