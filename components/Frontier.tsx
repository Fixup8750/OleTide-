"use client";

import Image from "next/image";
import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { useRef } from "react";
import { GAMES, type Game, type GameStats, gameUrl } from "@/lib/games";
import { EASE_OUT } from "@/lib/site";
import { Eyebrow, MaskLine, Reveal, useIsDesktop } from "./ui";

/** Collage placement per portfolio slot (same order as GAMES). */
const LAYOUT: { layout: string; rotate: number; speed: number }[] = [
  { layout: "md:col-span-7 md:col-start-1", rotate: -2.5, speed: 60 },
  { layout: "md:col-span-4 md:col-start-9 md:mt-40", rotate: 3.5, speed: 140 },
  { layout: "md:col-span-5 md:col-start-2 md:mt-24", rotate: 2, speed: 110 },
  { layout: "md:col-span-5 md:col-start-8 md:-mt-28", rotate: -3.5, speed: 40 },
  { layout: "md:col-span-5 md:col-start-1 md:-mt-4", rotate: 1.5, speed: 90 },
  { layout: "md:col-span-6 md:col-start-7 md:mt-20", rotate: -2, speed: 70 },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function Plate({
  game,
  stats,
  index,
  progress,
}: {
  game: Game;
  stats?: GameStats;
  index: number;
  progress: MotionValue<number>;
}) {
  const desktop = useIsDesktop();
  const l = LAYOUT[index];
  const tilt = desktop ? l.rotate : 0;
  const y = useTransform(progress, [0, 1], [l.speed, -l.speed]);
  return (
    <motion.figure style={{ y: desktop ? y : 0 }} className={`col-span-1 ${l.layout}`}>
      <motion.a
        href={gameUrl(game)}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 80, rotate: tilt * 2 }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        whileHover={{ rotate: 0, scale: 1.025 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
        data-cursor="play"
        className="group relative block rounded-[2rem] bg-cream/[0.035] p-2 ring-1 ring-cream/[0.08] hover:z-[1]"
      >
        <div className="relative aspect-video overflow-hidden rounded-[calc(2rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,236,210,0.09)]">
          <Image
            src={game.shot}
            alt={`${game.name} on Roblox`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            placeholder="blur"
            className="object-cover saturate-[0.8] sepia-[0.25] transition-[filter,scale] duration-[1200ms] ease-out-expo group-hover:scale-[1.04] group-hover:saturate-100 group-hover:sepia-0"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
          {stats && stats.playing > 0 && (
            <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-[11px] font-medium tabular-nums text-cream ring-1 ring-cream/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-caramel opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-caramel" />
              </span>
              {compact.format(stats.playing)} playing now
            </span>
          )}
        </div>
        <figcaption className="flex items-center gap-4 px-3 pb-2 pt-4">
          <Image
            src={game.icon}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-xl ring-1 ring-cream/10"
          />
          <div className="min-w-0 flex-1">
            <p className="break-words font-display text-xl font-extrabold uppercase leading-tight tracking-tight text-cream">
              {game.name}
            </p>
            <p className="mt-0.5 font-serif text-[14px] italic text-cream/55 [font-variation-settings:'SOFT'_100]">
              Plate {ROMAN[index]} · {game.genre}
              {stats && ` · ${compact.format(stats.visits)} visits · ${stats.rating}% liked`}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream/[0.06] text-caramel ring-1 ring-cream/10 transition-transform duration-700 ease-fluid group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105">
            <ArrowUpRightIcon size={16} weight="light" />
          </span>
        </figcaption>
      </motion.a>
    </motion.figure>
  );
}

export function Frontier({ stats }: { stats: Record<number, GameStats> | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const totals = stats
    ? Object.values(stats).reduce((t, s) => ({ playing: t.playing + s.playing, visits: t.visits + s.visits }), {
        playing: 0,
        visits: 0,
      })
    : null;

  return (
    <section id="frontier" className="relative overflow-hidden px-4 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <Eyebrow>Chapter 004 · Our games</Eyebrow>
          </Reveal>
          <h2 className="mt-7 font-display text-[clamp(3.25rem,8vw,8rem)] font-black uppercase leading-[0.84] tracking-[-0.01em]">
            <MaskLine>Every game is</MaskLine>
            <MaskLine delay={0.1}>
              <span className="font-serif font-light normal-case italic text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
                a frontier.
              </span>
            </MaskLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-[46ch] text-base leading-relaxed text-cream/60">
              Different genres, same playbook: keep shipping, keep players coming back, keep the game growing. These are
              the games we run today.
            </p>
          </Reveal>
          {totals && (
            <Reveal delay={0.3}>
              <dl className="mx-auto mt-12 flex max-w-xl justify-center gap-12 md:gap-20">
                {[
                  [compact.format(totals.playing), "Playing right now"],
                  [compact.format(totals.visits), "Total visits"],
                  [String(GAMES.length), "Games in the herd"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="font-display text-5xl font-black tabular-nums leading-none text-cream md:text-6xl">
                      {value}
                    </dd>
                    <dd aria-hidden className="label-caps mt-3 text-cream/45">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        <div ref={ref} className="mt-24 grid grid-cols-1 gap-8 md:mt-32 md:grid-cols-12 md:gap-6">
          {GAMES.map((g, i) => (
            <Plate key={g.universeId} game={g} stats={stats?.[g.universeId]} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
