import type { Dictionary } from "@/content/types";
import { reveal } from "@/lib/motion";
import { site } from "@/lib/site";
import { PointerGlow } from "@/components/motion/PointerGlow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type ContactSectionProps = {
  contact: Dictionary["contact"];
  newTabLabel: string;
};

export function ContactSection({ contact, newTabLabel }: ContactSectionProps) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-space relative">
      <Container>
        <div
          data-pointer-field=""
          className="relative isolate overflow-hidden rounded-[36px] border border-border bg-surface px-6 py-14 shadow-float sm:px-12 sm:py-20 lg:px-16 lg:py-24"
        >
          <PointerGlow variant="strong" />
          <div
            aria-hidden
            className="hairline-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(80%_80%_at_80%_20%,#000_10%,transparent_70%)]"
          />

          <div {...reveal()}>
            <Eyebrow>{contact.eyebrow}</Eyebrow>
            <h2
              id="contact-title"
              className="mt-8 max-w-[62rem] text-[clamp(2.25rem,1.1rem+4.2vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
            >
              {contact.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6" {...reveal(120)}>
              <p className="max-w-[34rem] text-lead text-ink-secondary">{contact.lead}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href={site.telegram} external newTabLabel={newTabLabel}>
                  {contact.primaryCta}
                </Button>
                <Button href={site.telegram} external newTabLabel={newTabLabel} variant="secondary" icon="telegram">
                  {contact.secondaryCta}
                </Button>
              </div>
              <p className="mt-6 font-mono text-[0.75rem] leading-relaxed tracking-[0.02em] text-ink-muted">{contact.ctaNote}</p>
            </div>

            <div className="lg:col-span-5 lg:col-start-8" {...reveal(200)}>
              <h3 className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">{contact.prepareTitle}</h3>
              <ol className="mt-5">
                {contact.prepare.map((item, index) => (
                  <li key={item} className="grid grid-cols-[2.5rem_1fr] items-baseline border-t border-border py-4 last:border-b">
                    <span className="font-mono text-[0.75rem] text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[1.0625rem] font-medium leading-snug text-ink">{item}</span>
                  </li>
                ))}
              </ol>
              <a
                href={site.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-baseline gap-3 text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] font-semibold tracking-[-0.03em] text-ink"
              >
                <span className="bg-[linear-gradient(var(--color-primary),var(--color-primary))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size,color] duration-500 group-hover:bg-[length:100%_2px] group-hover:text-primary">
                  {site.telegramHandle}
                </span>
                <span aria-hidden className="text-primary transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
                <span className="sr-only">({newTabLabel})</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
