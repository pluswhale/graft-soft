import { ArrowUp, Send } from "lucide-react";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Wordmark } from "@/components/visuals/Logo";

type SiteFooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function SiteFooter({ locale, dict }: SiteFooterProps) {
  const { footer, nav, common } = dict;

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface pt-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-ink-secondary">{footer.tagline}</p>
            <a
              href={site.url}
              className="mt-6 inline-block font-mono text-[0.8125rem] tracking-[0.04em] text-ink underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-primary"
            >
              {site.domain}
            </a>
          </div>

          <nav aria-label={footer.sections} className="md:col-span-4">
            <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">{footer.sections}</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {nav.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[0.9375rem] text-ink-secondary transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">{footer.contact}</h2>
            <a
              href={site.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink transition-colors hover:text-primary"
            >
              <Send aria-hidden className="size-4" />
              {site.telegramHandle}
              <span className="sr-only">({common.newTab})</span>
            </a>
            <h2 className="mt-8 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">{footer.language}</h2>
            <LanguageSwitcher current={locale} label={common.language} className="mt-3 -ml-2" />
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-border py-6 text-[0.8125rem] text-ink-muted">
          <span>{footer.rights}</span>
          <a href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
            {common.backToTop}
            <ArrowUp aria-hidden className="size-3.5" />
          </a>
        </div>
      </Container>

      <p
        aria-hidden
        className="pointer-events-none select-none px-3 text-center text-[clamp(4.5rem,17.5vw,17rem)] font-extrabold leading-[0.72] tracking-[-0.065em] bg-[linear-gradient(to_bottom,var(--color-surface-muted)_20%,var(--color-surface))] bg-clip-text text-transparent"
      >
        Graftsoft
      </p>
    </footer>
  );
}
