"use client";

import { useEffect, useRef, type JSX } from "react";

// Accent palette matching the site theme.
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

interface Ripple {
  x: number;
  y: number;
  radius: number;
  speed: number;
  life: number;
  color: string;
}

// Custom cursor: 1:1 dot + canvas trail/sparks/ripples (ported from "My site"), disabled on touch.
export function CustomCursor(): JSX.Element | null {
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }

    const pointer = { x: -100, y: -100, speed: 0, visible: false };

    let sparks: Spark[] = [];
    let trail: TrailPoint[] = [];
    let ripples: Ripple[] = [];
    let frame = 0;
    let lastTime = performance.now();
    let lastMoveAt = -1000;
    let devicePixel = Math.min(2, window.devicePixelRatio || 1);

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
      const spread = gentle ? 3 + Math.random() * 5 : 6 + Math.random() * 14;
      const velocity = gentle ? 0.02 + Math.random() * 0.06 : Math.min(2.6, speed * 0.14 + 0.4);
      // Idle sparks drift evenly in all directions so the ring stays centered on the dot.
      const vx = gentle
        ? Math.cos(angle) * velocity
        : Math.cos(angle) * velocity * 0.6 + (Math.random() - 0.5) * 0.6;
      const vy = gentle
        ? Math.sin(angle) * velocity
        : Math.sin(angle) * velocity * 0.6 - 0.35 - Math.random() * 0.4;
      sparks.push({
        x: x + Math.cos(angle) * spread,
        y: y + Math.sin(angle) * spread,
        vx,
        vy,
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
      const dt = Math.min(32, now - lastTime) / 16.67;
      lastTime = now;

      // Dot glued to the pointer 1:1.
      if (dotRef.current != null) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
        dotRef.current.style.opacity = pointer.visible ? "1" : "0";
      }

      if (context != null && canvas != null) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (pointer.visible) {
          // Speed is treated as 0 shortly after the pointer stops (mousemove stops firing, so it must not freeze).
          const movedRecently = now - lastMoveAt < 50;
          const spawnSpeed = movedRecently ? pointer.speed : 0;

          if (spawnSpeed > 5) {
            const count = Math.min(3, Math.floor(spawnSpeed / 9) + 1);
            for (let i = 0; i < count; i += 1) spawnSpark(pointer.x, pointer.y, spawnSpeed);
          } else if (Math.random() < 0.05) {
            spawnSpark(pointer.x, pointer.y, 0, true);
          }

          if (spawnSpeed > 4) {
            trail.push({
              x: pointer.x,
              y: pointer.y,
              life: 1,
              decay: 0.075,
              size: 1.6 + Math.min(1.4, spawnSpeed / 18),
              color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)] ?? "34,211,238",
            });
            if (trail.length > 42) trail = trail.slice(-42);
          }
        }

        context.globalCompositeOperation = "source-over";

        trail = trail.filter((point) => (point.life -= point.decay * dt) > 0);
        for (const point of trail) {
          drawGlow(point.x, point.y, point.size, point.color, point.life * 0.32);
        }

        sparks = sparks.filter((spark) => (spark.life -= spark.decay * dt) > 0);
        for (const spark of sparks) {
          spark.x += spark.vx * dt;
          spark.y += spark.vy * dt;
          spark.vx *= 0.97;
          spark.vy = spark.vy * 0.97 - 0.012 * dt;
          const twinkle = 0.62 + 0.38 * Math.sin(spark.phase + (now * spark.flicker) / 1000);
          drawGlow(spark.x, spark.y, spark.size, spark.color, Math.max(0, spark.life * twinkle));
        }

        ripples = ripples.filter((ripple) => (ripple.life -= 0.07 * dt) > 0);
        for (const ripple of ripples) {
          ripple.radius += ripple.speed * dt;
          context.strokeStyle = `rgba(${ripple.color},${(ripple.life * 0.55).toFixed(3)})`;
          context.lineWidth = 1.5 * devicePixel;
          context.beginPath();
          context.arc(
            ripple.x * devicePixel,
            ripple.y * devicePixel,
            ripple.radius * devicePixel,
            0,
            Math.PI * 2,
          );
          context.stroke();
        }

        context.globalCompositeOperation = "source-over";
      }
    }
    frame = requestAnimationFrame(loop);

    const onMove = (event: MouseEvent): void => {
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (pointer.visible) {
        pointer.speed = pointer.speed * 0.75 + Math.min(60, Math.hypot(dx, dy)) * 0.25;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.visible = true;
      lastMoveAt = performance.now();
    };

    const onDown = (event: MouseEvent): void => {
      ripples.push({
        x: event.clientX,
        y: event.clientY,
        radius: 14,
        speed: 2.4,
        life: 1,
        color: "129,140,248",
      });
    };

    const onLeave = (): void => {
      pointer.visible = false;
    };

    const onResize = (): void => resizeCanvas();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      sparks = [];
      trail = [];
      ripples = [];
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[98] h-full w-full" aria-hidden />
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[101]" style={{ opacity: 0 }} aria-hidden>
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_9px_rgba(0,0,0,0.85)]" />
      </div>
    </>
  );
}
