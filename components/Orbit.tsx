"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import logo from "@/assets/logo.png";
import { GAMES, gameUrl } from "@/lib/games";
import { EASE_OUT } from "@/lib/site";

/** Tilt of both orbit planes, radians. */
const TILT = -0.16;
/** Ring radii as fractions of the stage width; ry/rx gives the 3D squash. */
const RINGS = [
  { rx: 0.29, ry: 0.1 },
  { rx: 0.46, ry: 0.165 },
];
/** Which ring each game rides, plus its starting phase and relative speed. */
const RIDERS = [
  { ring: 1, phase: 0.3, speed: 1 },
  { ring: 0, phase: 2.2, speed: 1.45 },
  { ring: 1, phase: 2.4, speed: 1 },
  { ring: 0, phase: 5.3, speed: 1.45 },
  { ring: 1, phase: 4.5, speed: 1 },
];

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/**
 * Hero centrepiece: the OleTide hat with the portfolio's game icons orbiting it on two tilted rings.
 * Icons are positioned per frame with transform/opacity only; front-half icons pass over the hat,
 * back-half icons behind it. Hover pauses the orbit; reduced motion freezes it in a spread pose.
 */
export function Orbit({ playing, play }: { playing: number | null; play: boolean }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const icons = useRef<(HTMLAnchorElement | null)[]>([]);
  const width = useRef(0);
  const angle = useRef(0);
  const paused = useRef(false);
  const onScreen = useRef(true);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => (width.current = e.contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (onScreen.current = e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (!onScreen.current || !width.current) return;
    if (!reduce && !paused.current) angle.current += delta * 0.00016;
    const cos = Math.cos(TILT);
    const sin = Math.sin(TILT);
    RIDERS.forEach((r, i) => {
      const el = icons.current[i];
      if (!el) return;
      const ring = RINGS[r.ring];
      const th = angle.current * r.speed + r.phase;
      const ox = Math.cos(th) * ring.rx * width.current;
      const oy = Math.sin(th) * ring.ry * width.current;
      const x = ox * cos - oy * sin;
      const y = ox * sin + oy * cos;
      const depth = (Math.sin(th) + 1) / 2; // 0 = far side, 1 = near side
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.62 + depth * 0.48).toFixed(3)})`;
      el.style.opacity = (0.45 + depth * 0.55).toFixed(3);
      el.style.zIndex = depth > 0.5 ? "3" : "1";
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86 }}
      animate={play ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.8, delay: 0.45, ease: EASE_OUT }}
      className="relative mx-auto w-full max-w-[620px]"
    >
      <div ref={stage} className="relative aspect-square w-full">
        {/* warm core glow */}
        <div
          aria-hidden
          className="absolute inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(224,137,47,0.34),rgba(224,137,47,0.08)_55%,transparent)]"
        />

        {/* rings */}
        <svg aria-hidden viewBox="-50 -50 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="orbit-ring" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e0892f" stopOpacity="0.05" />
              <stop offset="0.5" stopColor="#f4ad56" stopOpacity="0.55" />
              <stop offset="1" stopColor="#e0892f" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <g transform={`rotate(${(TILT * 180) / Math.PI})`}>
            {RINGS.map((r, i) => (
              <ellipse
                key={i}
                rx={r.rx * 100}
                ry={r.ry * 100}
                fill="none"
                stroke="url(#orbit-ring)"
                strokeWidth={0.22}
                strokeDasharray={i ? "0.6 1.4" : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </svg>

        {/* the hat */}
        <div className="absolute inset-[27%] z-[2]">
          <motion.div
            animate={reduce ? undefined : { y: ["-2%", "2%", "-2%"], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            className="relative h-full w-full"
          >
            <Image
              src={logo}
              alt="OleTide"
              fill
              preload
              sizes="(max-width: 768px) 46vw, 300px"
              className="object-contain drop-shadow-[0_30px_40px_rgba(10,7,5,0.7)]"
            />
          </motion.div>
        </div>

        {/* riders */}
        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {GAMES.map((g, i) => (
            <a
              key={g.universeId}
              ref={(el) => {
                icons.current[i] = el;
              }}
              href={gameUrl(g)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${g.name} on Roblox`}
              data-cursor="hover"
              onPointerEnter={() => (paused.current = true)}
              onPointerLeave={() => (paused.current = false)}
              onFocus={() => (paused.current = true)}
              onBlur={() => (paused.current = false)}
              className="group absolute -left-[clamp(28px,5.4vw,44px)] -top-[clamp(28px,5.4vw,44px)] block will-change-transform"
            >
              <span className="block rounded-[1.35rem] bg-cream/[0.06] p-1 ring-1 ring-cream/15 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-fluid group-hover:scale-110">
                <Image
                  src={g.icon}
                  alt=""
                  width={88}
                  height={88}
                  className="block h-[clamp(48px,9.6vw,80px)] w-[clamp(48px,9.6vw,80px)] rounded-[calc(1.35rem-0.25rem)]"
                />
              </span>
              <span className="label-caps pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/85 px-2.5 py-1 text-cream opacity-0 ring-1 ring-cream/10 transition-opacity duration-300 ease-fluid group-hover:opacity-100 group-focus-visible:opacity-100">
                {g.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {playing !== null && playing > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={play ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2, ease: EASE_OUT }}
          className="mx-auto -mt-[6%] flex w-max items-center gap-2.5 rounded-full bg-ink/70 px-4 py-2 text-[12px] font-medium tabular-nums text-cream/80 ring-1 ring-cream/10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-caramel opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-caramel" />
          </span>
          <span>
            <span className="text-cream">{compact.format(playing)}</span> players in our games right now
          </span>
        </motion.p>
      )}
    </motion.div>
  );
}
