"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Eyebrow, Reveal } from "./ui";

// `*word*` marks serif-italic caramel accents.
const COPY =
  "Most Roblox games don't stall because the idea was wrong. They stall because the updates stop, the events dry up, and nobody is minding the store. We *ride* *in,* take the reins on LiveOps, and turn a quiet server into a *busy* *town.*";

const WORDS = COPY.split(" ");

function Word({ word, index, progress }: { word: string; index: number; progress: MotionValue<number> }) {
  const start = index / WORDS.length;
  const end = start + 1 / WORDS.length;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const accent = word.startsWith("*");
  const text = accent ? word.slice(1, -1) : word;
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.24em] inline-block ${
        accent
          ? "font-serif font-light italic tracking-[-0.02em] text-caramel [font-variation-settings:'SOFT'_100]"
          : ""
      }`}
    >
      {text}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section id="manifesto" className="relative px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-32">
            <Reveal>
              <Eyebrow>Chapter 001 · The problem</Eyebrow>
              <p className="mt-6 max-w-[28ch] text-sm leading-relaxed text-cream/50">
                Great games go quiet all the time. We look for the ones worth waking up.
              </p>
            </Reveal>
          </div>
        </div>
        <p
          ref={ref}
          className="font-display text-[clamp(2.1rem,4.6vw,4.6rem)] font-bold uppercase leading-[0.98] tracking-[-0.01em] text-cream md:col-span-9"
        >
          {WORDS.map((w, i) => (
            <Word key={i} word={w} index={i} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}
