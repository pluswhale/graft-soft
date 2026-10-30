"use client";

import { useEffect, useRef, type JSX } from "react";

/** Accent palette of the site — particles pick from these in order to match the theme.
 *  No near-white entries: on a light canvas a pale spark would read as a white
 *  dot with a tinted rim instead of a colored glow. */
const SPARK_COLORS: ReadonlyArray<string> = ["129,140,248", "34,211,238", "167,139,250"];

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  phase: number;
  flicker: number;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  decay: number;
  size: number;
  color: string;
}

/**
 * Site-wide custom cursor migrated 1:1 from the reference project ("My site"):
 *
 *  - a glowing dot that follows the pointer 1:1 (instant, no drift);
 *  - a canvas layer with motion-reactive effects: a fading trail while moving
 *    and twinkling accent sparks (rate scales with speed, occasional idle flicker).
 *
 * No outline ring and no click ripples — just the dot and the particle effects.
 * Disabled on touch devices.
 *
 * Hydration safety: the returned markup is 100% static (no `window`, no
 * `Math.random()`, no `Date.now()` during render). Every browser API call,
 * including `Math.random()` for the particles, happens inside this component's
 * `useEffect`, which runs only on the client after hydration — so the server
 * HTML and the first client render match exactly. The dot starts hidden via a
 * static `opacity: 0` and is only revealed by the rAF loop once the pointer
 * moves, which also keeps it invisible on touch devices. */
export function CustomCursor(): JSX.Element | null {
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }

    // Mutable pointer state — never triggers React re-renders.
    const pointer = {
      x: -100,
      y: -100,
      speed: 0,
      visible: false,
    };

    let sparks: Spark[] = [];
    let trail: TrailPoint[] = [];
    let frame = 0;
    let lastTime = performance.now();
    let devicePixel = Math.min(2, window.devicePixelRatio || 1);

    // Global styles already hide the native pointer while this class is present.
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d") ?? null;

    const resizeCanvas = (): void => {
      if (!canvas) return;
      devicePixel = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * devicePixel);
      canvas.height = Math.floor(window.innerHeight * devicePixel);
    };
    resizeCanvas();

    function drawGlow(x: number, y: number, radius: number, color: string, alpha: number): void {
      if (context == null) return;
      context.fillStyle = `rgba(${color},${(alpha * 0.25).toFixed(3)})`;
      context.beginPath();
      context.arc(x * devicePixel, y * devicePixel, radius * 2.2 * devicePixel, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
      context.beginPath();
      context.arc(x * devicePixel, y * devicePixel, radius * devicePixel, 0, Math.PI * 2);
      context.fill();
    }

    function spawnSpark(x: number, y: number, speed: number, gentle = false): void {
      const angle = Math.random() * Math.PI * 2;
      const spread = gentle ? 18 + Math.random() * 10 : 6 + Math.random() * 14;
      const velocity = gentle ? 0.25 + Math.random() * 0.3 : Math.min(2.6, speed * 0.14 + 0.4);
      sparks.push({
        x: x + Math.cos(angle) * spread,
        y: y + Math.sin(angle) * spread,
        vx: Math.cos(angle) * velocity * 0.6 + (Math.random() - 0.5) * 0.6,
        vy: Math.sin(angle) * velocity * 0.6 - 0.35 - Math.random() * 0.4,
        life: 1,
        decay: 0.022 + Math.random() * 0.03,
        size: gentle ? 0.7 + Math.random() * 1.1 : 0.9 + Math.random() * 1.9,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)] ?? "129,140,248",
        phase: Math.random() * Math.PI * 2,
        flicker: 9 + Math.random() * 12,
      });
    }

    function loop(now: number): void {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(32, now - lastTime) / 16.67; // normalized to 60fps frames
      lastTime = now;

      // ---- cursor element: glued to the pointer, no drift ----
      if (dotRef.current != null) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
        dotRef.current.style.opacity = pointer.visible ? "1" : "0";
      }

      // ---- canvas effects ----
      if (context != null && canvas != null) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Sparkle spawn: rate scales with movement speed; idle → rare gentle twinkle.
        if (pointer.visible) {
          if (pointer.speed > 5) {
            const count = Math.min(3, Math.floor(pointer.speed / 9) + 1);
            for (let i = 0; i < count; i += 1) spawnSpark(pointer.x, pointer.y, pointer.speed);
          } else if (Math.random() < 0.05) {
            spawnSpark(pointer.x, pointer.y, 0, true);
          }

          // Fading trail while moving.
          if (pointer.speed > 4) {
            trail.push({
              x: pointer.x,
              y: pointer.y,
              life: 1,
              decay: 0.075,
              size: 1.6 + Math.min(1.4, pointer.speed / 18),
              color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)] ?? "34,211,238",
            });
            if (trail.length > 42) trail = trail.slice(-42);
          }
        }

        // Trail: soft fading dots behind the cursor.
        // Normal compositing on purpose: the reference used `lighter` blending
        // for its dark theme, but on this light canvas additive blending
        // saturates spark cores to white with a tinted halo rim (a "white
        // circle with a blue outline"). source-over keeps them soft, colored
        // glows on any background.
        trail = trail.filter((point) => (point.life -= point.decay * dt) > 0);
        for (const point of trail) {
          drawGlow(point.x, point.y, point.size, point.color, point.life * 0.32);
        }

        // Sparks: drift upward, twinkle, fade.
        sparks = sparks.filter((spark) => (spark.life -= spark.decay * dt) > 0);
        for (const spark of sparks) {
          spark.x += spark.vx * dt;
          spark.y += spark.vy * dt;
          spark.vx *= 0.97;
          spark.vy = spark.vy * 0.97 - 0.012 * dt;
          const twinkle = 0.62 + 0.38 * Math.sin(spark.phase + (now * spark.flicker) / 1000);
          drawGlow(spark.x, spark.y, spark.size, spark.color, Math.max(0, spark.life * twinkle));
        }
      }
    }
    frame = requestAnimationFrame(loop);

    // ---- listeners ----
    const onMove = (event: MouseEvent): void => {
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      // Ignore the first event after entering the page (huge delta jump).
      if (pointer.visible) {
        pointer.speed = pointer.speed * 0.75 + Math.min(60, Math.hypot(dx, dy)) * 0.25;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.visible = true;
    };

    const onLeave = (): void => {
      pointer.visible = false;
    };

    const onResize = (): void => resizeCanvas();

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      html.classList.remove("has-cursor");
      sparks = [];
      trail = [];
    };
  }, []);

  return (
    <>
      {/* Canvas: trail + sparks */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[98] h-full w-full" aria-hidden />

      {/* Exact dot: glowing core, glued to the pointer.
          Strictly black core with a matching soft glow. No mix-blend trick —
          black under `difference` blending would cancel itself out.
          Starts hidden (deterministic SSR markup); the rAF loop takes over. */}
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[101]" style={{ opacity: 0 }} aria-hidden>
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_9px_rgba(0,0,0,0.85)]" />
      </div>
    </>
  );
}
