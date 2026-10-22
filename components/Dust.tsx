"use client";

import { useEffect, useRef } from "react";

/** Drifting desert dust motes. Canvas pauses when off-screen; disabled for reduced motion. */
export function Dust({ density = 70, className }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const motes = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      vx: Math.random() * 0.35 + 0.08,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.5 + 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let running = false;
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy + Math.sin(t / 1400 + m.phase) * 0.08;
        if (m.x > w + 4) m.x = -4;
        if (m.y > h + 4) m.y = -4;
        if (m.y < -4) m.y = h + 4;
        ctx.globalAlpha = m.a * (0.6 + 0.4 * Math.sin(t / 900 + m.phase));
        ctx.fillStyle = "#f4ad56";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`} />
  );
}
