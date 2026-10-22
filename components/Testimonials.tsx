"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Eyebrow, MaskLine, Reveal, useIsDesktop } from "./ui";

const QUOTES = [
  {
    lead: "Working with Oletide has been a great and productive experience.",
    body: "Their team has helped me manage LiveOps for my roblox game, providing support with development, updates and overall management of the game. Having a dedicated team involved has allowed me to focus on the bigger picture, knowing that my game is in capable hands. I'm excited to see what we can achieve working together moving forward.",
    who: "Game owner",
    role: "LiveOps client",
    layout: "md:col-span-7 md:col-start-1",
    rotate: -1.5,
    speed: 40,
  },
  {
    lead: "Fast, efficient, and great to work with.",
    body: "This crew gets things done, works at an impressive pace, and communicates well. No fuss, just good people doing great work. Highly recommend!",
    who: "Game owner",
    role: "LiveOps client",
    layout: "md:col-span-5 md:col-start-8 md:mt-56",
    rotate: 2.5,
    speed: 130,
  },
];

function Quote({ q, index, progress }: { q: (typeof QUOTES)[number]; index: number; progress: MotionValue<number> }) {
  const desktop = useIsDesktop();
  const y = useTransform(progress, [0, 1], [q.speed, -q.speed]);
  return (
    <motion.figure style={desktop ? { y, rotate: q.rotate } : undefined} className={q.layout}>
      <Reveal delay={index * 0.12} y={80}>
        <div className="rounded-[2.25rem] bg-cream/[0.04] p-2 ring-1 ring-cream/10">
          <div className="relative overflow-hidden rounded-[calc(2.25rem-0.5rem)] bg-ink-2 p-8 shadow-[inset_0_1px_1px_rgba(255,236,210,0.09),0_50px_100px_-45px_rgba(0,0,0,0.9)] md:p-12">
            {/* warm corner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(224,137,47,0.16),transparent)]"
            />
            <div className="label-caps relative flex items-center justify-between border-b border-dashed border-cream/15 pb-5 text-cream/45">
              <span>Testimony {String(index + 1).padStart(2, "0")}</span>
              <span>Unedited</span>
            </div>

            <span
              aria-hidden
              className="pointer-events-none absolute right-8 top-14 select-none font-serif text-[9rem] leading-none text-caramel/15 md:text-[12rem]"
            >
              &rdquo;
            </span>

            <blockquote className="relative mt-8">
              <p className="font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] font-light italic leading-[1.12] text-cream [font-variation-settings:'SOFT'_100,'WONK'_1]">
                &ldquo;{q.lead}
              </p>
              <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-cream/65">{q.body}&rdquo;</p>
            </blockquote>

            <figcaption className="relative mt-10 flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-caramel/15 font-display text-lg font-black uppercase text-caramel ring-1 ring-caramel/30">
                {["I", "II"][index]}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-xl font-extrabold uppercase leading-none tracking-tight">
                  {q.who}
                </span>
                <span className="label-caps mt-1.5 text-cream/45">{q.role}</span>
              </span>
            </figcaption>
          </div>
        </div>
      </Reveal>
    </motion.figure>
  );
}

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section id="word" className="relative px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <Eyebrow>Chapter 005 · Word around town</Eyebrow>
            </Reveal>
            <h2 className="mt-7 font-display text-[clamp(3.25rem,7.5vw,7.5rem)] font-black uppercase leading-[0.84] tracking-[-0.01em]">
              <MaskLine>Don&apos;t take</MaskLine>
              <MaskLine delay={0.1}>
                <span className="font-serif font-light normal-case italic text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
                  our word for it.
                </span>
              </MaskLine>
            </h2>
          </div>
          <Reveal delay={0.2} className="md:col-span-4 md:col-start-9">
            <p className="max-w-[38ch] text-base leading-relaxed text-cream/60">
              The owners we ride with, in their own words.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-20 grid grid-cols-1 gap-8 md:mt-28 md:grid-cols-12 md:gap-6">
          {QUOTES.map((q, i) => (
            <Quote key={i} q={q} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
