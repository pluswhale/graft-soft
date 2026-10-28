"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { type FocusEvent, type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { LogoMark, Wordmark } from "@/components/visuals/Logo";
import { MenuIcon } from "./MenuIcon";
import { useActiveSection } from "./useActiveSection";

type VerticalNavigationProps = {
  locale: Locale;
  nav: Dictionary["nav"];
  common: Dictionary["common"];
};

const OPEN_DELAY = 70;
const CLOSE_DELAY = 220;
const PANEL_ID = "site-nav-panel";

export function VerticalNavigation({ locale, nav, common }: VerticalNavigationProps) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(nav.items);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const pointerInside = useRef(false);

  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointerInside.current = true;
    schedule(true, OPEN_DELAY);
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointerInside.current = false;
    schedule(false, CLOSE_DELAY);
  };

  const onBlur = (event: FocusEvent) => {
    const next = event.relatedTarget;
    if (next instanceof Node && navRef.current?.contains(next)) return;
    if (pointerInside.current) return;
    setOpen(false);
  };

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    window.clearTimeout(timer.current);
    const next = !open;
    setOpen(next);
    if (next && event.detail === 0) {
      requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus());
    }
  };

  const close = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <div className="hidden lg:block">
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-ink/[0.08] transition-opacity duration-500",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <nav
        ref={navRef}
        aria-label={common.primaryNav}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onBlur={onBlur}
        className="fixed inset-y-0 left-0 z-50 flex"
      >
        <div className="relative z-10 flex w-[var(--rail-w)] flex-col items-center border-r border-border bg-surface/95 py-6">
          <Link href={`/${locale}`} aria-label={common.home} className="rounded-full p-1.5 text-ink">
            <LogoMark className="size-9" />
          </Link>

          <button
            ref={buttonRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={PANEL_ID}
            aria-label={open ? common.closeMenu : common.openMenu}
            data-cursor="button"
            className="mt-8 flex flex-col items-center gap-2 rounded-2xl px-2 py-2 text-ink"
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-border-strong transition-colors duration-300 hover:border-ink">
              <MenuIcon open={open} />
            </span>
            <span aria-hidden className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-secondary">
              {common.menu}
            </span>
          </button>

          <ol aria-hidden className="mt-10 flex flex-1 flex-col items-center justify-center gap-1">
            {nav.items.map((item, index) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    tabIndex={-1}
                    className="group flex h-8 items-center gap-2 px-2 font-mono text-[0.6875rem]"
                  >
                    <span
                      className={cn(
                        "h-px transition-all duration-500 ease-[var(--ease-expo)]",
                        isActive ? "w-5 bg-primary" : "w-2.5 bg-border-strong group-hover:w-4 group-hover:bg-ink",
                      )}
                    />
                    <span className={cn("transition-colors", isActive ? "text-ink" : "text-ink-muted group-hover:text-ink")}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-col items-center gap-5">
            <span
              aria-hidden
              className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-muted [writing-mode:vertical-rl] rotate-180"
            >
              {site.domain}
            </span>
            <LanguageSwitcher current={locale} label={common.language} orientation="vertical" />
            <a
              href={site.telegram}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic=""
              data-cursor="button"
              className="flex size-11 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-primary"
            >
              <Send aria-hidden className="size-4" />
              <span className="sr-only">
                {common.telegram} ({common.newTab})
              </span>
            </a>
          </div>
        </div>

        <div
          ref={panelRef}
          id={PANEL_ID}
          data-open={open}
          inert={!open}
          className="nav-panel absolute inset-y-0 left-[var(--rail-w)] flex w-[var(--panel-w)] flex-col overflow-y-auto border-r border-border bg-surface shadow-float"
        >
          <div className="flex min-h-full flex-col px-10 py-8">
            <div className="nav-panel-item" style={{ "--i": 0 }}>
              <Wordmark />
              <p className="mt-5 max-w-[19rem] text-[0.9375rem] leading-relaxed text-ink-secondary">{nav.descriptor}</p>
            </div>

            <ol className="mt-10 border-t border-border">
              {nav.items.map((item, index) => {
                const isActive = item.id === active;
                return (
                  <li key={item.id} className="nav-panel-item border-b border-border" style={{ "--i": index + 1 }}>
                    <a
                      href={`#${item.id}`}
                      onClick={close}
                      aria-current={isActive ? "location" : undefined}
                      className="group grid grid-cols-[2.25rem_1fr] items-baseline gap-x-2 py-3.5"
                    >
                      <span className={cn("font-mono text-[0.75rem]", isActive ? "text-primary" : "text-ink-muted")}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-[1.375rem] font-semibold leading-tight tracking-[-0.03em] transition-[color,translate] duration-300 group-hover:translate-x-1 group-hover:text-primary",
                          isActive ? "text-primary" : "text-ink",
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="col-start-2 mt-0.5 text-[0.8125rem] text-ink-muted">{item.hint}</span>
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="nav-panel-item mt-auto pt-10" style={{ "--i": nav.items.length + 1 }}>
              <Button href={site.telegram} external newTabLabel={common.newTab} icon="telegram" className="w-full">
                {nav.cta}
              </Button>
              <div className="mt-6 flex items-center justify-between">
                <LanguageSwitcher current={locale} label={common.language} />
                <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-ink-muted">{site.domain}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
