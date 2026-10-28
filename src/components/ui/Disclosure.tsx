"use client";

import { Plus } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/cn";

type DisclosureProps = {
  children: ReactNode;
  showLabel: string;
  hideLabel: string;
};

export function Disclosure({ children, showLabel, hideLabel }: DisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 text-left text-[0.9375rem] font-semibold text-ink shadow-soft lg:hidden"
      >
        {open ? hideLabel : showLabel}
        <Plus
          aria-hidden
          className={cn("size-4 text-primary transition-transform duration-500 ease-[var(--ease-expo)]", open && "rotate-45")}
        />
      </button>
      <div id={panelId} data-open={open} className="disclosure-panel">
        <div>{children}</div>
      </div>
    </div>
  );
}
