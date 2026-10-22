"use client";

import { ArrowUpRightIcon, CheckIcon, CopyIcon, DiscordLogoIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_FLUID, site } from "@/lib/site";

/** Discord contact card: the only way to reach OleTide. Copy the username or open the profile. */
export function DiscordCard() {
  const { username, url } = site.discord;
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(username);
    } catch {
      // Clipboard API blocked (insecure context / permissions): fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = username;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div id="contact" className="scroll-mt-32 rounded-[2.25rem] bg-cream/[0.04] p-2 ring-1 ring-cream/10">
      <div className="relative flex flex-col items-center overflow-hidden rounded-[calc(2.25rem-0.5rem)] bg-ink-2/90 px-6 py-10 text-center shadow-[inset_0_1px_1px_rgba(255,236,210,0.09),0_50px_100px_-45px_rgba(0,0,0,0.9)] md:px-12 md:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(224,137,47,0.22),transparent)]"
        />

        <div className="label-caps relative mb-8 flex w-full items-center justify-between border-b border-dashed border-cream/15 pb-5 text-cream/45">
          <span className="flex items-center gap-2 text-cream/75">
            <span className="h-1 w-1 rounded-full bg-caramel" />
            Contact
          </span>
          <span>Discord</span>
        </div>

        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-caramel/12 text-caramel ring-1 ring-caramel/30">
          <DiscordLogoIcon weight="light" size={34} />
        </span>

        <p className="relative mt-6 font-display text-[clamp(2rem,5vw,2.75rem)] font-black leading-none tracking-tight text-cream">
          @{username}
        </p>
        <p className="relative mt-4 max-w-[34ch] text-[15px] leading-relaxed text-cream/60">
          The best way to reach us is on Discord.
        </p>

        <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={copy}
            data-cursor="hover"
            className="group relative inline-flex items-center gap-4 rounded-full bg-caramel py-1.5 pl-6 pr-1.5 text-sm font-medium tracking-tight text-ink shadow-[0_18px_50px_-18px_rgba(224,137,47,0.65),inset_0_1px_0_rgba(255,230,190,0.55)] transition-[scale,background-color] duration-500 ease-fluid hover:bg-caramel-hi active:scale-[0.97]"
          >
            <span className="relative block h-5 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={copied ? "done" : "idle"}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-110%" }}
                  transition={{ duration: 0.45, ease: EASE_FLUID }}
                  className="block leading-5"
                >
                  {copied ? "Copied to clipboard" : "Copy username"}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/90 text-caramel transition-transform duration-500 ease-fluid group-hover:scale-105">
              {copied ? <CheckIcon weight="light" size={18} /> : <CopyIcon weight="light" size={18} />}
            </span>
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group inline-flex items-center gap-4 rounded-full bg-cream/[0.04] py-1.5 pl-6 pr-1.5 text-sm font-medium tracking-tight text-cream ring-1 ring-cream/15 transition-[scale,background-color] duration-500 ease-fluid hover:bg-cream/[0.08] active:scale-[0.97]"
          >
            Open in Discord
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-transform duration-500 ease-fluid group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105">
              <ArrowUpRightIcon weight="light" size={18} />
            </span>
          </a>
        </div>

        <span role="status" aria-live="polite" className="sr-only">
          {copied ? `Copied ${username} to clipboard` : ""}
        </span>
      </div>
    </div>
  );
}
