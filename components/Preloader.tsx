"use client";

import Image from "next/image";
import { AnimatePresence, animate, motion, type MotionValue, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { EASE_FLUID, EASE_OUT } from "@/lib/site";
import { useIntro } from "./IntroProvider";

const LETTERS = "OLETIDE".split("");

/**
 * Opening title card. The hat lands inside a caramel ring that draws with the counter,
 * then the card splits horizontally at the horizon and the two halves slide apart,
 * revealing the hero (and the starfield behind it) through the seam.
 */
export function Preloader() {
  const { setReady } = useIntro();
  const [visible, setVisible] = useState(true);
  const count = useMotionValue(0);
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const ring = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(count, 100, {
      duration: reduce ? 0.2 : 1.6,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        setVisible(false);
        // hero choreography starts as the seam opens, not after
        setReady(true);
      },
    });
    return () => controls.stop();
  }, [count, setReady]);

  const half = "absolute inset-x-0 overflow-hidden bg-ink";
  const seam = { duration: 1.15, ease: EASE_FLUID };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div key="preloader" className="fixed inset-0 z-[70]" aria-hidden>
          {/* two halves of one card; each renders the full content clipped to its half, so the seam cuts through it */}
          {(["top", "bottom"] as const).map((side) => (
            <motion.div
              key={side}
              className={`${half} ${side === "top" ? "top-0 h-1/2" : "bottom-0 h-1/2"}`}
              exit={{ y: side === "top" ? "-100%" : "100%" }}
              transition={seam}
            >
              <div className={`absolute inset-x-0 h-[100dvh] ${side === "top" ? "top-0" : "bottom-0"}`}>
                <Card label={label} ring={ring} />
              </div>
            </motion.div>
          ))}
          {/* seam flare: a caramel horizon line that flashes as the card opens */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-caramel to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.8 }}
            exit={{ scaleX: 1.4, opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Card({ label, ring }: { label: MotionValue<string>; ring: MotionValue<number> }) {
  return (
    <div className="relative flex h-full flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(224,137,47,0.14),transparent_70%)]" />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-7">
        <div className="relative h-36 w-36 md:h-44 md:w-44">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,236,210,0.08)" strokeWidth="0.6" />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#e0892f"
              strokeWidth="0.9"
              strokeLinecap="round"
              style={{ pathLength: ring }}
            />
          </svg>
          <motion.div
            className="absolute inset-[16%]"
            initial={{ opacity: 0, y: -40, rotate: -14, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <Image src={logo} alt="" fill sizes="120px" preload className="object-contain" />
          </motion.div>
        </div>
        <div className="-my-[0.15em] flex overflow-hidden py-[0.15em] font-display text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.85] tracking-[0.02em]">
          {LETTERS.map((l, i) => (
            <motion.span
              key={i}
              initial={{ y: "130%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.05, ease: EASE_OUT }}
              className={i >= 3 ? "text-caramel" : "text-cream"}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="relative flex items-end justify-between px-6 pb-8 md:px-12 md:pb-10">
        <p className="label-caps max-w-[24ch] text-cream/45">LiveOps for Roblox games</p>
        <motion.span className="label-caps tabular-nums text-cream/70">{label}</motion.span>
      </div>
    </div>
  );
}
