"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** Caramel dot + trailing ring. Fine pointers only; ring swells over interactive targets. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"idle" | "hover" | "view">("idle");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      setMode(target ? (target.dataset.cursor === "view" ? "view" : "hover") : "idle");
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringScale = mode === "idle" ? 1 : mode === "hover" ? 1.8 : 2.6;
  return (
    <>
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[80] -ml-1 -mt-1 h-2 w-2 rounded-full bg-caramel"
      />
      <motion.div
        aria-hidden
        style={{ x: rx, y: ry }}
        className="pointer-events-none fixed left-0 top-0 z-[80] -ml-5 -mt-5 flex h-10 w-10 items-center justify-center"
      >
        <motion.span
          animate={{ scale: ringScale, opacity: mode === "idle" ? 0.5 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className={`absolute inset-0 rounded-full ring-1 ${mode === "view" ? "bg-caramel/90 ring-caramel" : "ring-caramel/70"}`}
        />
        <motion.span
          animate={{ opacity: mode === "view" ? 1 : 0, scale: mode === "view" ? 1 : 0.6 }}
          className="label-caps relative text-[10px]! text-ink"
        >
          View
        </motion.span>
      </motion.div>
    </>
  );
}
