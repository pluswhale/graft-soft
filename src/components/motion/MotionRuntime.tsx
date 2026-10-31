"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type PointerField = {
  el: HTMLElement;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  active: boolean;
};

const EASE = 0.12;

function setupReveal(reduceMotion: boolean) {
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (reduceMotion) {
    elements.forEach((el) => el.classList.add("is-revealed"));
    return () => {};
  }

  const viewport = window.innerHeight;
  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewport * 0.9 && rect.bottom > 0) el.classList.add("is-revealed");
  }
  document.documentElement.classList.add("motion-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  elements.filter((el) => !el.classList.contains("is-revealed")).forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

function setupScroll(reduceMotion: boolean) {
  if (reduceMotion) return () => {};

  const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
  const tracks = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]")).map((el) => ({
    el,
    steps: Array.from(el.querySelectorAll<HTMLElement>("[data-step]")),
  }));
  let frame = 0;

  const update = () => {
    frame = 0;
    const viewport = window.innerHeight;
    const fullParallax = window.innerWidth >= 768;

    for (const layer of layers) {
      const anchor = layer.parentElement ?? layer;
      const rect = anchor.getBoundingClientRect();
      if (rect.bottom < -240 || rect.top > viewport + 240) continue;
      const speed = Number(layer.dataset.parallax) || 0;
      const factor = fullParallax ? 1 : 0.5;
      const offset = (rect.top + rect.height / 2 - viewport / 2) * -speed * factor;
      layer.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    }

    const focusLine = viewport * 0.55;
    for (const track of tracks) {
      const rect = track.el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (focusLine - rect.top) / rect.height));
      track.el.style.setProperty("--progress", progress.toFixed(4));
      const stacked = window.innerWidth < 1024;
      track.steps.forEach((step, index) => {
        const stepRect = step.getBoundingClientRect();
        step.classList.toggle("is-active", stepRect.top < focusLine);
        const next = track.steps[index + 1];
        let covered = 0;
        if (stacked && next) {
          const gap = next.getBoundingClientRect().top - stepRect.top;
          covered = Math.min(1, Math.max(0, 1 - gap / stepRect.height));
        }
        step.style.setProperty("--covered", covered.toFixed(3));
      });
    }
  };

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

function setupPointerFields(reduceMotion: boolean) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer || reduceMotion) return () => {};

  const fields: PointerField[] = Array.from(
    document.querySelectorAll<HTMLElement>("[data-pointer-field]"),
  ).map((el) => ({ el, targetX: 0.5, targetY: 0.5, x: 0.5, y: 0.5, active: false }));
  let frame = 0;

  const tick = () => {
    frame = 0;
    let moving = false;
    for (const field of fields) {
      const dx = field.targetX - field.x;
      const dy = field.targetY - field.y;
      if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) continue;
      moving = true;
      field.x += dx * EASE;
      field.y += dy * EASE;
      const style = field.el.style;
      style.setProperty("--px", `${(field.x * 100).toFixed(2)}%`);
      style.setProperty("--py", `${(field.y * 100).toFixed(2)}%`);
      style.setProperty("--nx", ((field.x - 0.5) * 2).toFixed(3));
      style.setProperty("--ny", ((field.y - 0.5) * 2).toFixed(3));
    }
    if (moving) frame = requestAnimationFrame(tick);
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (event.buttons !== 0) {
      for (const field of fields) {
        field.targetX = field.x;
        field.targetY = field.y;
      }
      return;
    }
    for (const field of fields) {
      const rect = field.el.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside) {
        field.targetX = (event.clientX - rect.left) / rect.width;
        field.targetY = (event.clientY - rect.top) / rect.height;
      } else if (field.active) {
        field.targetX = 0.5;
        field.targetY = 0.5;
      }
      if (inside !== field.active) {
        field.active = inside;
        field.el.dataset.pointerActive = String(inside);
      }
    }
    if (!frame) frame = requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onMove);
  };
}

export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [setupReveal(reduceMotion), setupScroll(reduceMotion), setupPointerFields(reduceMotion)];
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname]);

  return null;
}
