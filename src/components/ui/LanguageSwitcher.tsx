"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { type Locale, localeMeta, locales } from "@/lib/i18n";

function sectionInView() {
  const line = window.innerHeight * 0.4;
  for (const section of document.querySelectorAll<HTMLElement>("main section[id]")) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= line && rect.bottom > line) return section.id === "top" ? "" : section.id;
  }
  return "";
}

type LanguageSwitcherProps = {
  current: Locale;
  label: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  onNavigate?: () => void;
};

export function LanguageSwitcher({
  current,
  label,
  orientation = "horizontal",
  className,
  onNavigate,
}: LanguageSwitcherProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, locale: Locale) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate?.();
    if (locale === current) return;
    const section = sectionInView();
    router.push(section ? `/${locale}#${section}` : `/${locale}`, { scroll: Boolean(section) });
  };

  return (
    <ul
      aria-label={label}
      className={cn(
        "flex items-center gap-1 font-mono text-[0.75rem] tracking-[0.08em]",
        orientation === "vertical" && "flex-col",
        className,
      )}
    >
      {locales.map((locale) => {
        const isCurrent = locale === current;
        return (
          <li key={locale}>
            <a
              href={`/${locale}`}
              hrefLang={locale}
              lang={locale}
              aria-current={isCurrent ? "true" : undefined}
              onClick={(event) => handleClick(event, locale)}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full transition-colors duration-300",
                isCurrent ? "bg-ink text-white" : "text-ink-secondary hover:bg-surface-muted hover:text-ink",
              )}
            >
              <span aria-hidden>{localeMeta[locale].short}</span>
              <span className="sr-only">{localeMeta[locale].name}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
