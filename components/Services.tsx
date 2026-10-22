"use client";

import Image from "next/image";
import {
  CalendarStarIcon,
  ChartLineUpIcon,
  CodeIcon,
  CoinsIcon,
  MegaphoneIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import type { ComponentType } from "react";
import featureShot from "@/assets/games/anime-evolve-1.png";
import { Eyebrow, MaskLine, Reveal } from "./ui";

type Service = {
  no: string;
  title: string;
  body: string;
  Icon: ComponentType<{ size?: number; weight?: "light" }>;
  span: string;
  feature?: boolean;
};

const SERVICES: Service[] = [
  {
    no: "01",
    title: "LiveOps & events",
    body: "Seasonal events, limited-time drops and weekend spikes, planned as a calendar instead of a scramble.",
    Icon: CalendarStarIcon,
    span: "md:col-span-7 md:row-span-2",
    feature: true,
  },
  {
    no: "02",
    title: "Game development",
    body: "New maps, mechanics and content shipped by our own Roblox developers.",
    Icon: CodeIcon,
    span: "md:col-span-5",
  },
  {
    no: "03",
    title: "Monetization & economy",
    body: "Game passes, developer products and in-game economies tuned to reward players and revenue.",
    Icon: CoinsIcon,
    span: "md:col-span-5",
  },
  {
    no: "04",
    title: "Discovery & growth",
    body: "Thumbnails, icons, titles and promotion that pull new players in.",
    Icon: MegaphoneIcon,
    span: "md:col-span-4",
  },
  {
    no: "05",
    title: "Analytics",
    body: "Retention, session length and spend tracked closely, so every update is a decision, not a guess.",
    Icon: ChartLineUpIcon,
    span: "md:col-span-4",
  },
  {
    no: "06",
    title: "Community",
    body: "Discord, update logs and creator outreach that keep your players talking.",
    Icon: UsersThreeIcon,
    span: "md:col-span-4",
  },
];

function Card({ s, index }: { s: Service; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className={`${s.span} col-span-1`}>
      <div
        data-cursor="hover"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
        className="group h-full rounded-[2rem] bg-cream/[0.035] p-2 ring-1 ring-cream/[0.08] transition-[scale] duration-700 ease-fluid hover:scale-[1.008]"
      >
        <div className="relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[calc(2rem-0.5rem)] bg-ink-2 p-7 shadow-[inset_0_1px_1px_rgba(255,236,210,0.09)] md:p-9">
          {s.feature && (
            <>
              <Image
                src={featureShot}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                placeholder="blur"
                className="duotone object-cover opacity-45 transition-[scale,opacity] duration-[1400ms] ease-out-expo group-hover:scale-[1.04] group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink-2 via-ink-2/75 to-ink-2/20" />
            </>
          )}
          <div className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-fluid group-hover:opacity-100" />

          <div className="relative flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/[0.05] text-caramel ring-1 ring-cream/10 transition-transform duration-700 ease-fluid group-hover:-rotate-12">
              <s.Icon size={22} weight="light" />
            </span>
            <span className="label-caps text-cream/35">No. {s.no}</span>
          </div>

          <div className="relative mt-16">
            <h3
              className={`font-display font-extrabold uppercase leading-[0.9] tracking-tight ${
                s.feature ? "text-[clamp(2.75rem,5vw,4.75rem)]" : "text-3xl md:text-4xl"
              }`}
            >
              {s.title}
            </h3>
            <p
              className={`mt-4 leading-relaxed text-cream/60 ${s.feature ? "max-w-[42ch] text-base" : "max-w-[36ch] text-[15px]"}`}
            >
              {s.body}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Services() {
  return (
    <section id="services" className="relative px-4 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal>
              <Eyebrow>Chapter 003 · The outfit</Eyebrow>
            </Reveal>
            <h2 className="mt-7 font-display text-[clamp(3.25rem,7.5vw,7.5rem)] font-black uppercase leading-[0.84] tracking-[-0.01em]">
              <MaskLine>One crew.</MaskLine>
              <MaskLine delay={0.1}>
                Every{" "}
                <span className="font-serif font-light normal-case italic text-caramel [font-variation-settings:'SOFT'_100,'WONK'_1]">
                  lever.
                </span>
              </MaskLine>
            </h2>
          </div>
          <Reveal delay={0.15} className="md:col-span-4">
            <p className="max-w-[38ch] text-base leading-relaxed text-cream/60">
              Taking over LiveOps means owning the whole loop: what ships, when it ships, and how players hear about it.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-5">
          {SERVICES.map((s, i) => (
            <Card key={s.no} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
