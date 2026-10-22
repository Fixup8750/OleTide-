"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE_OUT, pitchHref } from "@/lib/site";
import { Dust } from "./Dust";
import { useIntro } from "./IntroProvider";
import { Landscape } from "./Landscape";
import { Orbit } from "./Orbit";
import { CtaButton, Eyebrow, MaskLine } from "./ui";

export function Hero({ playing }: { playing: number | null }) {
  const { ready } = useIntro();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const far = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const mid = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const near = useTransform(scrollYProgress, [0, 1], ["0%", "4%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const orbitY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      {/* Sky: warm dusk glow; transparent edges let the global starfield through */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(120%_70%_at_70%_78%,rgba(59,28,9,0.92)_0%,rgba(26,13,6,0.55)_45%,rgba(10,7,5,0)_80%)]"
      />

      <Dust className="-z-10" />

      <Landscape far={far} mid={mid} near={near} className="-z-10 h-[38vh] min-h-[220px]" />

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-10 px-4 pb-28 pt-32 md:grid-cols-12 md:gap-6 md:px-10 md:pb-36">
        <motion.div style={{ y: titleY, opacity: fade }} className="relative z-[1] md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE_OUT }}
          >
            <Eyebrow>LiveOps partner for Roblox games</Eyebrow>
          </motion.div>

          <h1 className="mt-7 font-display font-black uppercase leading-[0.8] tracking-[-0.015em] text-cream">
            <MaskLine play={ready} delay={0.3} className="text-[clamp(4.25rem,11vw,11rem)]">
              We see
            </MaskLine>
            <MaskLine play={ready} delay={0.42} className="text-[clamp(4.25rem,11vw,11rem)]">
              <span className="flex items-baseline gap-[0.18em]">
                the
                <span className="font-serif text-[0.92em] font-light normal-case italic tracking-[-0.04em] text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
                  vision.
                </span>
              </span>
            </MaskLine>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.75, ease: EASE_OUT }}
            className="mt-10 flex max-w-xl flex-col gap-8"
          >
            <p className="max-w-[44ch] text-base leading-relaxed text-cream/65 md:text-lg">
              We partner with Roblox game owners, take over LiveOps, growth and development, and get paid through a
              revenue share. Your game grows, or we don&apos;t eat.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <CtaButton href={pitchHref}>Pitch us your game</CtaButton>
              <CtaButton href="#deal" variant="ghost">
                How the deal works
              </CtaButton>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: orbitY }} className="md:col-span-5">
          <Orbit playing={playing} play={ready} />
        </motion.div>
      </div>

      <motion.a
        href="#manifesto"
        data-cursor="hover"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.3 }}
        className="label-caps absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-cream/55"
      >
        Scroll to ride in
        <span className="relative block h-10 w-px overflow-hidden bg-cream/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-caramel"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          />
        </span>
      </motion.a>
    </section>
  );
}
