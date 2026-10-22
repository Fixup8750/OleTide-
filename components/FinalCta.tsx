"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { DiscordCard } from "./DiscordCard";
import { Dust } from "./Dust";
import { Landscape } from "./Landscape";
import { Eyebrow, MaskLine, Reveal } from "./ui";

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const far = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const mid = useTransform(scrollYProgress, [0, 1], ["16%", "0%"]);

  return (
    <section id="pitch" ref={ref} className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(110%_70%_at_50%_85%,rgba(74,34,10,0.92)_0%,rgba(29,14,6,0.55)_45%,rgba(10,7,5,0)_80%)]"
      />
      <Dust density={50} className="-z-10" />
      <Landscape far={far} mid={mid} className="-z-10 h-[34vh] min-h-[200px]" />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-4 py-32 text-center md:px-10">
        <Reveal>
          <Eyebrow>Chapter 007 · Saddle up</Eyebrow>
        </Reveal>
        <h2 className="mt-8 font-display text-[clamp(4.5rem,15vw,15rem)] font-black uppercase leading-[0.8] tracking-[-0.015em]">
          <MaskLine>We scale</MaskLine>
          <MaskLine delay={0.12}>
            <span className="font-serif font-light normal-case italic text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
              games.
            </span>
          </MaskLine>
        </h2>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-10 max-w-[44ch] text-base leading-relaxed text-cream/70 md:text-lg">
            Own a Roblox game with more in it than it&apos;s showing? Send us the link on Discord. We&apos;ll tell you
            what we see.
          </p>
        </Reveal>
        <Reveal delay={0.35} y={70} className="mt-14 w-full max-w-[560px]">
          <DiscordCard />
        </Reveal>
      </div>
    </section>
  );
}
