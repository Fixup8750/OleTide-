"use client";

import { motion } from "motion/react";
import type { ComponentType, SVGProps } from "react";
import { EASE_OUT } from "@/lib/site";
import { MisfitsWordmark } from "./logos/Misfits";

type Partner = {
  name: string;
  href: string;
  Logo: ComponentType<SVGProps<SVGSVGElement>>;
  /** Rendered logo height; tune per mark so optical sizes match. */
  height: string;
};

const PARTNERS: Partner[] = [
  { name: "Misfits Gaming", href: "https://studio.misfitsgaming.gg/", Logo: MisfitsWordmark, height: "h-9 md:h-11" },
];

/** "Partnered with" strip: centred label on a hairline, partner logos below. */
export function Partners() {
  return (
    <section id="partners" aria-label="Partnered with" className="relative px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-6">
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="h-px flex-1 origin-right bg-linear-to-r from-transparent to-cream/20"
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
            className="label-caps text-cream/55"
          >
            Partnered with
          </motion.p>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="h-px flex-1 origin-left bg-linear-to-l from-transparent to-cream/20"
          />
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-8 md:mt-12 md:gap-x-20">
          {PARTNERS.map(({ name, href, Logo, height }, i) => (
            <motion.li
              key={href}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.45 + i * 0.08, ease: EASE_OUT }}
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                aria-label={name}
                className="block text-cream/75 transition-[color,scale] duration-500 ease-fluid hover:scale-[1.04] hover:text-cream"
              >
                <Logo className={`${height} w-auto`} />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
