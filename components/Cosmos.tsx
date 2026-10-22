"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide space backdrop: twinkling stars, four-point sparkles, drifting asteroids,
 * debris and the occasional meteor. One fixed canvas; all glow/rock shapes are pre-rendered
 * to sprites so each frame is just drawImage calls. Layers parallax against window.scrollY
 * (read inside rAF, no scroll listener). Reduced motion: one static frame.
 */

const CARAMEL = "244,173,86";
const CREAM = "255,236,210";

type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number; depth: number };
type Sparkle = { x: number; y: number; s: number; tw: number; ph: number; depth: number; warm: boolean };
type Rock = {
  x: number;
  y: number;
  size: number;
  rot: number;
  vr: number;
  vx: number;
  vy: number;
  depth: number;
  sprite: HTMLCanvasElement;
};
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function sparkleSprite(rgb: string) {
  const S = 96;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const m = S / 2;
  const halo = g.createRadialGradient(m, m, 0, m, m, m);
  halo.addColorStop(0, `rgba(${rgb},0.55)`);
  halo.addColorStop(0.18, `rgba(${rgb},0.16)`);
  halo.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = halo;
  g.fillRect(0, 0, S, S);
  // four-point star: two thin tapered diamonds
  g.fillStyle = `rgba(${rgb},0.95)`;
  for (const [w, h] of [
    [3.2, m * 0.95],
    [m * 0.95, 3.2],
  ]) {
    g.beginPath();
    g.moveTo(m, m - h);
    g.quadraticCurveTo(m + w * 0.25, m - w * 0.25, m + w, m);
    g.quadraticCurveTo(m + w * 0.25, m + w * 0.25, m, m + h);
    g.quadraticCurveTo(m - w * 0.25, m + w * 0.25, m - w, m);
    g.quadraticCurveTo(m - w * 0.25, m - w * 0.25, m, m - h);
    g.fill();
  }
  g.fillStyle = "rgba(255,248,236,1)";
  g.beginPath();
  g.arc(m, m, 2.2, 0, Math.PI * 2);
  g.fill();
  return c;
}

function rockSprite(size: number) {
  const pad = Math.ceil(size * 0.3);
  const S = Math.ceil(size + pad * 2);
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const m = S / 2;
  const n = 11 + Math.floor(Math.random() * 5);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = (size / 2) * rand(0.72, 1);
    pts.push([m + Math.cos(a) * r, m + Math.sin(a) * r * rand(0.78, 0.95)]);
  }
  const path = new Path2D();
  pts.forEach(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % n];
    if (i === 0) path.moveTo((x + nx) / 2, (y + ny) / 2);
    else path.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
  });
  const [x0, y0] = pts[0];
  path.quadraticCurveTo(x0, y0, (x0 + pts[1][0]) / 2, (y0 + pts[1][1]) / 2);
  path.closePath();

  // body: warm stone, lit from upper right so the rock reads against the dark sky
  const body = g.createLinearGradient(m + size / 2, m - size / 2, m - size / 2, m + size / 2);
  body.addColorStop(0, "#8a5a32");
  body.addColorStop(0.35, "#4a2f1c");
  body.addColorStop(0.75, "#24170f");
  body.addColorStop(1, "#140d09");
  g.save();
  g.shadowColor = `rgba(${CARAMEL},0.35)`;
  g.shadowBlur = size * 0.25;
  g.fillStyle = body;
  g.fill(path);
  g.restore();

  // craters
  g.save();
  g.clip(path);
  for (let i = 0; i < 4 + Math.random() * 4; i++) {
    const cx = m + rand(-0.32, 0.32) * size;
    const cy = m + rand(-0.32, 0.32) * size;
    const cr = rand(0.04, 0.12) * size;
    g.fillStyle = "rgba(0,0,0,0.38)";
    g.beginPath();
    g.arc(cx, cy, cr, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = `rgba(${CARAMEL},0.10)`;
    g.lineWidth = 1;
    g.beginPath();
    g.arc(cx + cr * 0.15, cy - cr * 0.15, cr, -Math.PI * 0.6, Math.PI * 0.1);
    g.stroke();
  }
  g.restore();

  // rim light on the lit edge
  g.save();
  g.clip(path);
  g.strokeStyle = `rgba(${CARAMEL},0.9)`;
  g.lineWidth = Math.max(2.5, size * 0.035);
  g.shadowColor = `rgba(${CARAMEL},1)`;
  g.shadowBlur = 10;
  g.translate(-size * 0.03, size * 0.03);
  g.stroke(path);
  g.restore();
  return c;
}

export function Cosmos() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const warmSprite = sparkleSprite(CARAMEL);
    const coolSprite = sparkleSprite(CREAM);

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let sparkles: Sparkle[] = [];
    let rocks: Rock[] = [];
    let debris: Star[] = [];
    const meteors: Meteor[] = [];

    const populate = () => {
      const small = w < 768;
      const area = (w * h) / (1440 * 900);
      stars = Array.from({ length: Math.round((small ? 160 : 340) * Math.max(area, 0.5)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.12 ? rand(1.6, 2.4) : rand(0.6, 1.5),
        a: rand(0.35, 1),
        tw: rand(0.4, 1.6),
        ph: Math.random() * Math.PI * 2,
        depth: rand(0.02, 0.08),
      }));
      sparkles = Array.from({ length: small ? 12 : 26 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() < 0.3 ? rand(60, 96) : rand(26, 52),
        tw: rand(0.35, 0.9),
        ph: Math.random() * Math.PI * 2,
        depth: rand(0.06, 0.16),
        warm: Math.random() < 0.6,
      }));
      rocks = Array.from({ length: small ? 5 : 9 }, (_, i) => {
        const size = i < 2 ? rand(150, 230) : i < 5 ? rand(70, 120) : rand(30, 60);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          rot: Math.random() * Math.PI * 2,
          vr: rand(-0.05, 0.05),
          vx: rand(-4, -1.5),
          vy: rand(1, 3.5),
          // big rocks sit closer and move more on scroll
          depth: size > 140 ? rand(0.35, 0.5) : rand(0.14, 0.3),
          sprite: rockSprite(size),
        };
      });
      debris = Array.from({ length: small ? 40 : 90 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.8, 2.2),
        a: rand(0.3, 0.7),
        tw: rand(-6, -2), // reused as horizontal drift px/s
        ph: rand(2, 7), // vertical drift px/s
        depth: rand(0.2, 0.35),
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
    };
    resize();

    // wrap a parallaxed coordinate into [-m, size+m)
    const wrap = (v: number, size: number, m: number) =>
      ((((v + m) % (size + 2 * m)) + size + 2 * m) % (size + 2 * m)) - m;

    let nextMeteor = 0.6;
    const spawnMeteor = () => {
      const speed = rand(900, 1400);
      const ang = rand(Math.PI * 0.72, Math.PI * 0.8); // down-left
      meteors.push({
        x: rand(w * 0.35, w * 1.1),
        y: rand(-h * 0.1, h * 0.35),
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life: 0,
        max: rand(0.7, 1.1),
        len: rand(220, 420),
      });
    };

    let last = performance.now();
    let elapsed = 0;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      const t = elapsed;
      const sy = window.scrollY;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const y = wrap(s.y - sy * s.depth, h, 4);
        ctx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(t * s.tw + s.ph));
        ctx.fillStyle = `rgb(${CREAM})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of sparkles) {
        const y = wrap(s.y - sy * s.depth, h, 40);
        const k = 0.5 + 0.5 * Math.sin(t * s.tw + s.ph);
        const size = s.s * (0.7 + 0.35 * k);
        ctx.globalAlpha = 0.45 + 0.55 * k;
        ctx.drawImage(s.warm ? warmSprite : coolSprite, s.x - size / 2, y - size / 2, size, size);
      }

      for (const d of debris) {
        d.x += d.tw * dt;
        d.y += d.ph * dt;
        const x = wrap(d.x, w, 4);
        const y = wrap(d.y - sy * d.depth, h, 4);
        ctx.globalAlpha = d.a;
        ctx.fillStyle = `rgb(${CARAMEL})`;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      for (const r of rocks) {
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.rot += r.vr * dt;
        const m = r.size;
        const x = wrap(r.x, w, m);
        const y = wrap(r.y - sy * r.depth, h, m);
        const S = r.sprite.width;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(r.rot);
        ctx.drawImage(r.sprite, -S / 2, -S / 2);
        ctx.restore();
      }

      if (!still) {
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          spawnMeteor();
          nextMeteor = rand(1.4, 3.6);
        }
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const mt = meteors[i];
        mt.life += dt;
        mt.x += mt.vx * dt;
        mt.y += mt.vy * dt;
        const p = mt.life / mt.max;
        if (p >= 1) {
          meteors.splice(i, 1);
          continue;
        }
        const fade = Math.sin(p * Math.PI);
        const mag = Math.hypot(mt.vx, mt.vy);
        const tx = mt.x - (mt.vx / mag) * mt.len;
        const ty = mt.y - (mt.vy / mag) * mt.len;
        const tail = ctx.createLinearGradient(mt.x, mt.y, tx, ty);
        tail.addColorStop(0, `rgba(255,244,228,${0.95 * fade})`);
        tail.addColorStop(0.15, `rgba(${CARAMEL},${0.6 * fade})`);
        tail.addColorStop(1, `rgba(${CARAMEL},0)`);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = tail;
        ctx.lineWidth = 2.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(mt.x, mt.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.globalAlpha = fade;
        ctx.drawImage(warmSprite, mt.x - 26, mt.y - 26, 52, 52);
      }
      ctx.globalAlpha = 1;

      if (!still) raf = requestAnimationFrame(frame);
    };

    let raf = requestAnimationFrame(frame);
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onResize = () => {
      resize();
      if (still) requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="nebula pointer-events-none fixed inset-0 -z-10" />
      <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
    </>
  );
}
