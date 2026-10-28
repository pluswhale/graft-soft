"use client";

import { useEffect, useState } from "react";
import type { NavItem, SectionId } from "@/content/types";

export function useActiveSection(items: readonly NavItem[]) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const current = items.find((item) => visible.get(item.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return active;
}
