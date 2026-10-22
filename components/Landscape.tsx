"use client";

import { motion, type MotionValue } from "motion/react";

function Saguaro({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="0" width="12" height="64" rx="6" />
      <rect x="-14" y="18" width="8" height="26" rx="4" />
      <rect x="-14" y="36" width="20" height="8" rx="4" />
      <rect x="18" y="10" width="8" height="24" rx="4" />
      <rect x="6" y="26" width="20" height="8" rx="4" />
    </g>
  );
}

/** Layered mesa horizon. Each layer accepts its own parallax offset. */
export function Landscape({
  far,
  mid,
  near,
  className,
}: {
  far?: MotionValue<string>;
  mid?: MotionValue<string>;
  near?: MotionValue<string>;
  className?: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 ${className ?? ""}`}>
      <motion.svg
        style={{ y: far }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 h-full w-full"
      >
        <path
          fill="#2a170b"
          d="M0 320V210l60-5 30-25h120l25 22 95 3 30-55 20-10h90l20 12 30 50 120 10 60-20 20-20h140l20 22 80 15 80-5 30-40 20-10h130l20 17 30 40 170 5v110z"
        />
      </motion.svg>
      <motion.svg
        style={{ y: mid }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 h-full w-full"
      >
        <path
          fill="#170d07"
          d="M0 320v-70l120-5 30-20 20-10h130l20 15 40 22 200 8 60-18 30-18h110l20 18 60 17 220 5 60-24 20-11h120l30 17 150 10v70z"
        />
      </motion.svg>
      <motion.svg
        style={{ y: near }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 h-full w-full"
      >
        <g fill="#0a0705">
          <path d="M0 320v-35c200-10 380 7 560 1 200-7 380 10 560 2 140-6 240 2 320-2v34z" />
          <Saguaro x={1180} y={226} />
          <Saguaro x={250} y={244} s={0.7} />
        </g>
      </motion.svg>
    </div>
  );
}
