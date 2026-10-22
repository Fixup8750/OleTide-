"use client";

import { StarFourIcon } from "@phosphor-icons/react/ssr";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

const PHRASES = ["We scale games", "LiveOps", "We see the vision", "Revenue share", "Events & updates", "Growth"];

/** Scroll-velocity driven ticker. Content is duplicated so a -50% wrap is seamless. */
function Band({ speed }: { speed: number }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(base, (v) => `${((((v % 50) + 50) % 50) - 50).toFixed(3)}%`);

  useAnimationFrame((_, delta) => {
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    const move = direction.current * speed * (delta / 1000);
    base.set(base.get() + move + move * Math.abs(b));
  });

  const row = (
    <div className="flex shrink-0 items-center">
      {[...PHRASES, ...PHRASES].map((p, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`px-10 leading-none ${
              i % 2
                ? "font-serif text-[clamp(2.5rem,5.2vw,4.75rem)] font-light italic tracking-[-0.03em] text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]"
                : "font-display text-[clamp(2.5rem,5.2vw,4.75rem)] font-black uppercase tracking-tight text-cream"
            }`}
          >
            {p}
          </span>
          <StarFourIcon weight="fill" className="h-3.5 w-3.5 shrink-0 text-caramel/70 md:h-4 md:w-4" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden py-8 md:py-10">
      <motion.div style={{ x }} className="flex w-max will-change-transform">
        {row}
        {row}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="What we do" className="relative py-24 md:py-32">
      <div className="rule" />
      <Band speed={-2} />
      <div className="rule" />
    </section>
  );
}
