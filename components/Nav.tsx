"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { EASE_FLUID, EASE_OUT, pitchHref, site } from "@/lib/site";
import { useIntro } from "./IntroProvider";
import { getLenis } from "./SmoothScroll";
import { CtaButton } from "./ui";

export function Nav() {
  const { ready } = useIntro();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const next = y > prev && y > 240;
    if (next !== hidden) setHidden(next);
  });

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else if (ready) lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, ready]);

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={ready ? { y: hidden && !open ? -120 : 0, opacity: 1 } : { y: -120, opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE_FLUID, delay: ready && !hidden ? 0.35 : 0 }}
        className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-5"
      >
        <nav className="flex w-full max-w-max items-center gap-2 rounded-full bg-ink/60 p-1.5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,236,210,0.07)] ring-1 ring-cream/10 backdrop-blur-xl max-md:w-full max-md:max-w-none max-md:justify-between">
          <a href="#top" data-cursor="hover" className="flex items-center gap-2.5 rounded-full py-1 pl-1.5 pr-4">
            <Image src={logo} alt="" width={30} height={30} className="h-[30px] w-[30px]" />
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.04em]">
              Ole<span className="text-caramel">Tide</span>
            </span>
          </a>

          <ul className="hidden items-center md:flex">
            {site.nav.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor="hover"
                  className="rounded-full px-4 py-2 text-[13px] text-cream/65 transition-colors duration-500 ease-fluid hover:text-cream"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <CtaButton href={pitchHref} className="!py-1 !pl-5 !pr-1 !text-[13px]">
              Pitch your game
            </CtaButton>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative mr-1 flex h-10 w-10 items-center justify-center rounded-full bg-cream/[0.06] ring-1 ring-cream/10 md:hidden"
          >
            <span
              className={`absolute h-[1.5px] w-4 rounded-full bg-cream transition-transform duration-700 ease-fluid ${
                open ? "translate-y-0 rotate-45" : "-translate-y-[3.5px]"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-4 rounded-full bg-cream transition-transform duration-700 ease-fluid ${
                open ? "translate-y-0 -rotate-45" : "translate-y-[3.5px]"
              }`}
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.25, ease: EASE_FLUID } }}
            transition={{ duration: 0.6, ease: EASE_FLUID }}
            className="fixed inset-0 z-[35] flex flex-col justify-between bg-ink/85 px-6 pb-10 pt-32 backdrop-blur-3xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {site.nav.map((l, i) => (
                <li key={l.href} className="-my-[0.1em] overflow-hidden py-[0.1em]">
                  <motion.a
                    href={l.href}
                    onClick={(e) => {
                      // Lenis is stopped while the menu is open; resume it, then travel.
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(false);
                      const lenis = getLenis();
                      lenis?.start();
                      if (lenis) lenis.scrollTo(l.href, { duration: 1.6 });
                      else document.querySelector(l.href)?.scrollIntoView();
                    }}
                    initial={{ y: 48, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0, transition: { duration: 0.35, ease: EASE_FLUID } }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: EASE_OUT }}
                    className="flex items-baseline gap-4 font-display text-6xl font-black uppercase leading-[1.02] tracking-tight"
                  >
                    <span className="label-caps text-caramel">0{i + 1}</span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE_OUT }}
            >
              <CtaButton href={pitchHref}>Pitch your game</CtaButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
