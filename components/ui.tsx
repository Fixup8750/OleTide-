"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { motion, useMotionValue, useSpring } from "motion/react";
import { type ReactNode, useSyncExternalStore } from "react";
import { EASE_OUT } from "@/lib/site";

const DESKTOP_QUERY = "(min-width: 768px)";

/** True at md+ (768px). Server snapshot is desktop; tilts/overlaps are dropped on mobile after hydration. */
export function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(DESKTOP_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
}

/** Heavy fade-up on viewport entry. Transform + opacity only. */
export function Reveal({
  children,
  delay = 0,
  y = 64,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Line-mask reveal: text rises out of an invisible box. */
export function MaskLine({
  children,
  delay = 0,
  className,
  play,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Controlled play (hero). Omit to trigger on viewport entry. */
  play?: boolean;
}) {
  // Observe the unclipped wrapper: the inner line starts fully clipped by `overflow-hidden`,
  // so an IntersectionObserver on it may never report intersection.
  const trigger =
    play === undefined
      ? { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } }
      : { animate: play ? "shown" : "hidden" };
  return (
    // Generous padding (offset by equal negative margins, so layout is unchanged) keeps descenders,
    // tall serif ascenders and italic overhangs inside the clipping box once the line has risen.
    <motion.span
      initial="hidden"
      {...trigger}
      className={`-mx-[0.12em] -mb-[0.24em] -mt-[0.12em] block overflow-hidden px-[0.12em] pb-[0.24em] pt-[0.12em] ${className ?? ""}`}
    >
      <motion.span
        className="block will-change-transform"
        variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
        transition={{ duration: 1.25, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`label-caps inline-flex items-center gap-2 rounded-full bg-cream/[0.04] px-3 py-1 text-cream/70 ring-1 ring-cream/10 ${className ?? ""}`}
    >
      <span className="h-1 w-1 rounded-full bg-caramel" />
      {children}
    </span>
  );
}

/** Double-bezel enclosure: machined outer tray + inset core. */
export function Bezel({
  children,
  className,
  coreClassName,
}: {
  children: ReactNode;
  className?: string;
  coreClassName?: string;
}) {
  return (
    <div className={`rounded-[2rem] bg-cream/[0.035] p-2 ring-1 ring-cream/[0.08] ${className ?? ""}`}>
      <div
        className={`relative h-full overflow-hidden rounded-[calc(2rem-0.5rem)] bg-ink-2 shadow-[inset_0_1px_1px_rgba(255,236,210,0.09)] ${coreClassName ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

/** Island pill CTA with nested trailing icon and magnetic pull. */
export function CtaButton({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const solid = variant === "solid";
  return (
    <motion.a
      href={href}
      data-cursor="hover"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) * 0.22);
        my.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={`group relative inline-flex items-center gap-4 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-medium tracking-tight transition-[scale,background-color,color] duration-500 ease-fluid active:scale-[0.97] ${
        solid
          ? "bg-caramel text-ink shadow-[0_18px_50px_-18px_rgba(224,137,47,0.65),inset_0_1px_0_rgba(255,230,190,0.55)] hover:bg-caramel-hi"
          : "bg-cream/[0.04] text-cream ring-1 ring-cream/15 hover:bg-cream/[0.08]"
      } ${className ?? ""}`}
    >
      <span>{children}</span>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 ease-fluid group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105 ${
          solid ? "bg-ink/90 text-caramel" : "bg-cream/10 text-cream"
        }`}
      >
        <ArrowUpRightIcon weight="light" size={18} />
      </span>
    </motion.a>
  );
}
