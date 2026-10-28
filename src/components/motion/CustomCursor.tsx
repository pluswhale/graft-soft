"use client";

import { useEffect, useRef } from "react";

const FOLLOW = 0.2;
const INTERACTIVE = "a, button, [role='button'], summary, label";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!cursor || !dot || !ring || !label) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");
    cursor.dataset.hidden = "true";

    let x = 0;
    let y = 0;
    let ringX = 0;
    let ringY = 0;
    let frame = 0;
    let visible = false;
    let magnet: HTMLElement | null = null;

    const render = () => {
      ringX += (x - ringX) * FOLLOW;
      ringY += (y - ringY) * FOLLOW;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = Math.abs(x - ringX) + Math.abs(y - ringY) > 0.2 ? requestAnimationFrame(render) : 0;
    };

    const releaseMagnet = () => {
      if (!magnet) return;
      magnet.style.translate = "";
      magnet = null;
    };

    const updateMagnet = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-magnetic]") : null;
      if (magnet && magnet !== target) releaseMagnet();
      if (!target) return;
      magnet = target;
      const rect = target.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      target.style.translate = `${(dx * 0.18).toFixed(1)}px ${(dy * 0.28).toFixed(1)}px`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!visible) {
        visible = true;
        ringX = x;
        ringY = y;
        cursor.dataset.hidden = "false";
      }
      updateMagnet(event);
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const context = target?.closest<HTMLElement>("[data-cursor]");
      let state = "default";
      let text = "";
      if (context) {
        state = context.dataset.cursor || "link";
        text = context.dataset.cursorLabel ?? "";
      } else if (target?.closest(INTERACTIVE)) {
        state = "link";
      }
      cursor.dataset.state = state;
      cursor.dataset.theme = target?.closest("[data-cursor-theme='dark']") ? "dark" : "light";
      label.textContent = text;
    };

    const hide = () => {
      visible = false;
      cursor.dataset.hidden = "true";
      releaseMagnet();
    };
    const press = () => {
      cursor.dataset.pressed = "true";
    };
    const releasePress = () => {
      cursor.dataset.pressed = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", releasePress, { passive: true });
    html.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", releasePress);
      html.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="cursor" data-state="default" data-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-circle" />
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
