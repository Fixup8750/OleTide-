"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/site";
import { Eyebrow, MaskLine, Reveal } from "./ui";

const TERMS = [
  { t: "You keep ownership.", d: "The game, the group and the IP stay yours." },
  { t: "We run the work.", d: "LiveOps, development and growth handled by our team." },
  { t: "We're paid in revenue share.", d: "No retainer, no hourly invoices." },
  { t: "Terms set per game.", d: "Agreed up front and put in writing before we start." },
];

export function Terms() {
  return (
    <section id="terms" className="relative px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <Eyebrow>Chapter 006 · The handshake</Eyebrow>
          </Reveal>
          <h2 className="mt-7 font-display text-[clamp(3.25rem,7vw,7rem)] font-black uppercase leading-[0.84] tracking-[-0.01em]">
            <MaskLine>No retainer.</MaskLine>
            <MaskLine delay={0.1}>
              <span className="font-serif font-light normal-case italic text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
                We eat
              </span>
            </MaskLine>
            <MaskLine delay={0.2}>
              <span className="font-serif font-light normal-case italic text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
                when you eat.
              </span>
            </MaskLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[40ch] text-base leading-relaxed text-cream/60">
              Our incentives line up with yours by design. If the game doesn&apos;t grow, we don&apos;t get paid.
            </p>
          </Reveal>
        </div>

        {/* Contract card — the one cream "paper" surface on the page */}
        <Reveal delay={0.1} y={90} className="md:col-span-6 md:col-start-7">
          <div className="rounded-[2.25rem] bg-cream/[0.06] p-2.5 ring-1 ring-cream/10 md:rotate-[1.5deg]">
            <div className="relative overflow-hidden rounded-[calc(2.25rem-0.625rem)] bg-[#efe0c4] p-8 text-ink shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_50px_100px_-40px_rgba(0,0,0,0.85)] md:p-12">
              <div className="label-caps flex items-center justify-between border-b border-dashed border-ink/25 pb-5 text-ink/55">
                <span>Deed of partnership</span>
                <span>OleTide × Your game</span>
              </div>

              <ol className="mt-6 flex flex-col">
                {TERMS.map((term, i) => (
                  <motion.li
                    key={term.t}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.1, ease: EASE_OUT }}
                    className="grid grid-cols-[2.5rem_1fr] gap-2 py-4"
                  >
                    <span className="label-caps text-burnt">0{i + 1}</span>
                    <div>
                      <p className="font-display text-2xl font-extrabold uppercase leading-none tracking-tight md:text-3xl">
                        {term.t}
                      </p>
                      <p className="mt-1.5 text-sm text-ink/60">{term.d}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-8 grid grid-cols-2 gap-8 border-t border-dashed border-ink/25 pt-8">
                <div>
                  <div className="h-14 border-b border-ink/40" />
                  <p className="label-caps mt-2 text-ink/50">Game owner</p>
                </div>
                <div>
                  <svg viewBox="0 0 220 56" className="h-14 w-full overflow-visible text-ink" aria-hidden>
                    <motion.path
                      d="M6 40c14-24 26-30 30-22 5 10-14 26-6 26 10 0 18-30 30-30 8 0-4 26 4 26 6 0 10-14 16-14s2 14 8 14c8 0 12-22 22-22 6 0 0 20 8 20 10 0 16-16 26-16 6 0 2 14 10 14 12 0 26-12 46-14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2.2, delay: 0.8, ease: [0.65, 0, 0.35, 1] }}
                    />
                  </svg>
                  <div className="border-b border-ink/40" />
                  <p className="label-caps mt-2 text-ink/50">OleTide</p>
                </div>
              </div>

              {/* Stamp */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 2.2, rotate: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -14 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 2.4 }}
                className="absolute bottom-20 right-[38%] flex h-28 w-28 items-center justify-center rounded-full border-2 border-burnt/70 text-center font-display text-lg font-black uppercase leading-[0.9] text-burnt/80 md:h-32 md:w-32"
              >
                <span className="absolute inset-1.5 rounded-full border border-burnt/50" />
                Shake
                <br />
                on it
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
