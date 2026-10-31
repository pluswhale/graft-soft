import type { Dictionary } from "@/content/types";
import { site } from "@/lib/site";
import { PointerGlow } from "@/components/motion/PointerGlow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroMap } from "@/components/visuals/HeroMap";

type HeroSectionProps = {
  hero: Dictionary["hero"];
  newTabLabel: string;
};

export function HeroSection({ hero, newTabLabel }: HeroSectionProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-pointer-field=""
      suppressHydrationWarning
      className="relative isolate overflow-hidden pb-16 pt-[calc(var(--mobile-bar-h)+3rem)] lg:pb-20 lg:pt-16"
    >
      <PointerGlow />
      <div
        aria-hidden
        className="hairline-grid absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(70%_60%_at_70%_35%,#000_10%,transparent_75%)]"
      />

      <Container>
        <div className="hero-fade flex items-center justify-between gap-6" style={{ "--delay": "0ms" }}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </div>

        <h1 id="hero-title" className="mt-10 text-display font-semibold lg:mt-14">
          {hero.title.map((line, index) => (
            <span key={line} className="hero-line" style={{ "--i": index }}>
              <span className={index === 1 ? "text-primary" : undefined}>
                {index === 2 ? <HighlightLast text={line} /> : line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-14 lg:mt-16 xl:grid-cols-12 xl:items-end xl:gap-10">
          <div className="hero-fade xl:col-span-5 xl:pb-6" style={{ "--delay": "520ms" }}>
            <p className="max-w-[34rem] text-lead text-ink-secondary">{hero.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={site.telegram} external newTabLabel={newTabLabel}>
                {hero.primaryCta}
              </Button>
              <Button href="#process" variant="secondary" icon="down">
                {hero.secondaryCta}
              </Button>
            </div>
          </div>
          <div className="hero-fade xl:col-span-7" style={{ "--delay": "680ms" }}>
            <div className="md:ml-auto md:max-w-[46rem] xl:max-w-none">
              <HeroMap map={hero.map} />
            </div>
          </div>
        </div>

        <div className="hero-fade mt-20 border-t border-border pt-6 lg:mt-24" style={{ "--delay": "820ms" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
            <p className="shrink-0 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">{hero.systemsLabel}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {hero.systems.map((system) => (
                <li key={system} className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                  <span aria-hidden className="size-1 rounded-full bg-primary" />
                  {system}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HighlightLast({ text }: { text: string }) {
  const splitAt = text.lastIndexOf(" ");
  const head = text.slice(0, splitAt + 1);
  const tail = text.slice(splitAt + 1);
  return (
    <>
      {head}
      <span className="relative isolate inline-block">
        <span
          aria-hidden
          className="absolute inset-x-[-0.04em] bottom-[0.1em] -z-10 h-[0.26em] rounded-sm bg-lime/80"
        />
        {tail}
      </span>
    </>
  );
}
