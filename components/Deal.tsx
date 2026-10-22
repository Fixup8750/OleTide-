"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useState } from "react";
import airport from "@/assets/games/airport-tycoon-2.png";
import phone from "@/assets/games/phone-empire-1.png";
import ropair from "@/assets/games/ropair-1.png";
import trading from "@/assets/games/trading-tycoon-1.png";
import { EASE_FLUID } from "@/lib/site";
import { Eyebrow, MaskLine, Reveal } from "./ui";

type Chapter = { numeral: string; kicker: string; title: string; body: string; still: StaticImageData };

const CHAPTERS: Chapter[] = [
  {
    numeral: "I",
    kicker: "The ride-in",
    title: "We find you.",
    body: "We look for games with real bones: a strong core loop, loyal players, growth that stalled. Then we bring you a concrete plan for your game.",
    still: ropair,
  },
  {
    numeral: "II",
    kicker: "The reins",
    title: "We take over LiveOps.",
    body: "Updates, events, economy tuning and the development backlog move to our team. You keep ownership of the game.",
    still: airport,
  },
  {
    numeral: "III",
    kicker: "The boost",
    title: "We grow it.",
    body: "Live events, fresh content, sharper thumbnails and smarter monetization, shipped on a steady cadence that keeps players coming back.",
    still: phone,
  },
  {
    numeral: "IV",
    kicker: "The split",
    title: "We share the upside.",
    body: "No retainer, no invoices. We're paid through a revenue share, so we only win when your game earns more.",
    still: trading,
  },
];

/** Two laps of the chapters so the wheel shows three cards on each side of the focused one. */
const WHEEL = [...CHAPTERS, ...CHAPTERS];
const N = WHEEL.length;
const VISIBLE = 3;

/** Signed shortest distance from the focused slot, in (-N/2, N/2]. */
const offsetOf = (i: number, active: number) => {
  const d = (((i - active) % N) + N) % N;
  return d > N / 2 ? d - N : d;
};

/** Horizontal spread in % of card width: neighbours peek out, outer cards stack tighter. */
const spread = (o: number) => {
  const a = Math.abs(o);
  const x = a === 0 ? 0 : 62 + (a - 1) * 34;
  return Math.sign(o) * x;
};

function Card({ c, offset, onSelect }: { c: Chapter; offset: number; onSelect: () => void }) {
  const a = Math.abs(offset);
  const focused = a === 0;
  const hidden = a > VISIBLE;
  return (
    <motion.article
      aria-hidden={!focused}
      initial={false}
      animate={{
        x: `${spread(offset)}%`,
        scale: focused ? 1 : 1 - Math.min(a, VISIBLE) * 0.12,
        rotateY: Math.sign(offset) * -14,
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: 0.9, ease: EASE_FLUID }}
      style={{ zIndex: 10 - a }}
      onClick={focused ? undefined : onSelect}
      data-cursor={focused ? undefined : "hover"}
      className={`absolute inset-0 rounded-[1.75rem] bg-cream/[0.04] p-1.5 ring-1 ring-cream/10 ${
        focused ? "" : "cursor-pointer"
      } ${hidden ? "pointer-events-none" : ""}`}
    >
      <div className="relative h-full overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-ink-2 shadow-[inset_0_1px_1px_rgba(255,236,210,0.1),0_40px_80px_-30px_rgba(0,0,0,0.85)]">
        <Image
          src={c.still}
          alt=""
          fill
          sizes="(max-width: 768px) 80vw, 400px"
          placeholder="blur"
          draggable={false}
          className="duotone object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink-2/10 via-ink-2/55 via-45% to-ink-2" />
        <span className="text-outline-caramel absolute right-5 top-3 font-display text-[5.5rem] font-black leading-[0.9] opacity-80">
          {c.numeral}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
          <p className="label-caps text-caramel">{c.kicker}</p>
          <h3 className="mt-3 font-display text-[2.1rem] font-extrabold uppercase leading-[0.92] tracking-tight text-cream md:text-[2.5rem]">
            {c.title}
          </h3>
          <p className="mt-4 text-[14px] leading-relaxed text-cream/65">{c.body}</p>
        </div>
        {/* dim veil: side cards fall back into the dark */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: focused ? 0 : Math.min(0.35 + a * 0.18, 0.85) }}
          transition={{ duration: 0.9, ease: EASE_FLUID }}
          className="pointer-events-none absolute inset-0 bg-ink"
        />
      </div>
    </motion.article>
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const Icon = dir === "prev" ? CaretLeftIcon : CaretRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous step" : "Next step"}
      data-cursor="hover"
      className="group flex h-12 w-12 items-center justify-center rounded-full bg-ink/70 text-cream ring-1 ring-cream/15 transition-transform duration-500 ease-fluid hover:scale-105 active:scale-95"
    >
      <Icon
        size={18}
        weight="light"
        className={`transition-transform duration-500 ease-fluid ${dir === "prev" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`}
      />
    </button>
  );
}

export function Deal() {
  const [active, setActive] = useState(0);
  const go = useCallback((step: number) => setActive((a) => (((a + step) % N) + N) % N), []);
  const chapter = active % CHAPTERS.length;

  return (
    <section id="deal" className="relative overflow-hidden px-4 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow>Chapter 002 · The deal</Eyebrow>
          </Reveal>
          <h2 className="mt-7 font-display text-[clamp(3.25rem,7.5vw,7.5rem)] font-black uppercase leading-[0.84] tracking-[-0.01em]">
            <MaskLine>Four moves.</MaskLine>
            <MaskLine delay={0.1}>
              <span className="font-serif font-light normal-case italic text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
                One handshake.
              </span>
            </MaskLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-[42ch] text-base leading-relaxed text-cream/60">
              From first message to shared revenue. Swipe or use the arrows to walk the trail.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={80}>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="The four steps of an OleTide partnership"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") go(-1);
              if (e.key === "ArrowRight") go(1);
            }}
            className="relative mt-20 rounded-[2rem] outline-none focus-visible:ring-1 focus-visible:ring-caramel/50 md:mt-24"
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -400) go(1);
                else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
              }}
              className="relative mx-auto aspect-[3/4.3] w-[min(74vw,380px)] touch-pan-y select-none [perspective:1600px]"
            >
              {WHEEL.map((c, i) => (
                <Card key={i} c={c} offset={offsetOf(i, active)} onSelect={() => setActive(i)} />
              ))}
            </motion.div>

            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex w-[min(74vw,380px)] -translate-x-1/2 items-center justify-between max-md:hidden">
              <div className="pointer-events-auto -translate-x-1/2">
                <Arrow dir="prev" onClick={() => go(-1)} />
              </div>
              <div className="pointer-events-auto translate-x-1/2">
                <Arrow dir="next" onClick={() => go(1)} />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex items-center justify-center gap-6">
          <div className="md:hidden">
            <Arrow dir="prev" onClick={() => go(-1)} />
          </div>
          <div className="flex items-center gap-3" aria-live="polite">
            <span className="sr-only">
              Step {chapter + 1} of {CHAPTERS.length}: {CHAPTERS[chapter].title}
            </span>
            {CHAPTERS.map((c, i) => (
              <button
                key={c.numeral}
                type="button"
                aria-label={`Go to step ${i + 1}: ${c.title}`}
                aria-current={i === chapter}
                onClick={() => setActive((a) => a - (a % CHAPTERS.length) + i)}
                data-cursor="hover"
                className="relative h-1.5 w-10 overflow-hidden rounded-full bg-cream/15"
              >
                <motion.span
                  initial={false}
                  animate={{ scaleX: i === chapter ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: EASE_FLUID }}
                  className="absolute inset-0 origin-left bg-caramel"
                />
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <Arrow dir="next" onClick={() => go(1)} />
          </div>
        </div>
      </div>
    </section>
  );
}
