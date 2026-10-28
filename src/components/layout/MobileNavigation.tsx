"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Wordmark } from "@/components/visuals/Logo";
import { MenuIcon } from "./MenuIcon";
import { useActiveSection } from "./useActiveSection";

type MobileNavigationProps = {
  locale: Locale;
  nav: Dictionary["nav"];
  common: Dictionary["common"];
};

const DRAWER_ID = "mobile-nav-drawer";

export function MobileNavigation({ locale, nav, common }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(nav.items);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      wasOpen.current = true;
      root.style.overflow = "hidden";
      closeButtonRef.current?.focus();
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        root.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      openButtonRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--mobile-bar-h)] border-b border-border bg-canvas/85 backdrop-blur-md">
        <div className="container-shell flex h-full items-center justify-between">
          <Link href={`/${locale}`} aria-label={common.home} className="rounded-lg">
            <Wordmark />
          </Link>
          <button
            ref={openButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls={DRAWER_ID}
            className="flex h-11 items-center gap-3 rounded-full border border-border-strong bg-surface pl-4 pr-3.5 text-ink"
          >
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em]">{common.menu}</span>
            <MenuIcon open={false} />
            <span className="sr-only">{common.openMenu}</span>
          </button>
        </div>
      </header>

      <div
        id={DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-label={common.primaryNav}
        data-open={open}
        inert={!open}
        className="drawer fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-surface"
      >
        <div className="container-shell flex h-[var(--mobile-bar-h)] shrink-0 items-center justify-between border-b border-border">
          <Wordmark />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={common.closeMenu}
            className="flex size-11 items-center justify-center rounded-full border border-border-strong text-ink"
          >
            <MenuIcon open />
          </button>
        </div>

        <nav aria-label={common.primaryNav} className="container-shell flex flex-1 flex-col py-8">
          <ol>
            {nav.items.map((item, index) => {
              const isActive = item.id === active;
              return (
                <li key={item.id} className="nav-panel-item border-b border-border" style={{ "--i": index }}>
                  <a
                    href={`#${item.id}`}
                    onClick={close}
                    aria-current={isActive ? "location" : undefined}
                    className="grid grid-cols-[2.5rem_1fr] items-baseline py-4"
                  >
                    <span className={cn("font-mono text-[0.75rem]", isActive ? "text-primary" : "text-ink-muted")}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[1.75rem] font-semibold leading-tight tracking-[-0.035em]",
                        isActive ? "text-primary" : "text-ink",
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>

          <div className="nav-panel-item mt-auto pt-10" style={{ "--i": nav.items.length }}>
            <Button href={site.telegram} external newTabLabel={common.newTab} icon="telegram" className="w-full" onClick={close}>
              {nav.cta}
            </Button>
            <div className="mt-6 flex items-center justify-between">
              <LanguageSwitcher current={locale} label={common.language} onNavigate={close} />
              <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-ink-muted">{site.domain}</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
