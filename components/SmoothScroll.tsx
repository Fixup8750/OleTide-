"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { useIntro } from "./IntroProvider";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export function SmoothScroll() {
  const { ready } = useIntro();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, anchors: { duration: 1.6 }, autoRaf: true });
    lenisRef.current = lenis;
    lenisInstance = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
      lenisInstance = null;
    };
  }, []);

  // Lock scrolling while the preloader is up.
  useEffect(() => {
    const root = document.documentElement;
    if (ready) {
      lenisRef.current?.start();
      root.style.removeProperty("overflow");
    } else {
      lenisRef.current?.stop();
      root.style.overflow = "hidden";
    }
  }, [ready]);

  return null;
}
