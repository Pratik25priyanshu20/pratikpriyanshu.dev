"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Deterministic PRNG so SSR and client render identical paths (no hydration mismatch)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WIDTH = 1200;
const HEIGHT = 110;
const BASELINE = 42;
const N_POINTS = 220;
const DIP_CENTER = 0.62; // fraction of width
const DIP_HALF = 42; // px half-width of transit
const DIP_DEPTH = 30;
const INGRESS = 14; // px ingress/egress ramp

function generateCurve() {
  const rand = mulberry32(20260604);
  const step = WIDTH / (N_POINTS - 1);
  const dipX = WIDTH * DIP_CENTER;

  const pts: [number, number][] = [];
  for (let i = 0; i < N_POINTS; i++) {
    const x = i * step;
    // photometric noise
    let y = BASELINE + (rand() - 0.5) * 7 + Math.sin(i * 0.35) * 1.5;
    // transit dip (trapezoid: ingress — flat bottom — egress)
    const d = Math.abs(x - dipX);
    if (d < DIP_HALF) {
      const ramp =
        d > DIP_HALF - INGRESS ? (DIP_HALF - d) / INGRESS : 1;
      y += DIP_DEPTH * ramp;
    }
    pts.push([x, y]);
  }

  const path = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return { path, dipX };
}

export default function LightCurve() {
  const prefersReducedMotion = useReducedMotion();
  const { path, dipX } = useMemo(generateCurve, []);

  return (
    <div
      className="absolute bottom-6 inset-x-0 hidden sm:block pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-[110px] opacity-60"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="lc-stroke" x1="0" y1="0" x2={WIDTH} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="12%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="88%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* flux line — draws itself on load */}
        <motion.path
          d={path}
          stroke="url(#lc-stroke)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.2, delay: 1.2, ease: "easeInOut" }}
        />

        {/* transit annotation — appears after the line reaches the dip */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0.5 : 3.6, duration: 0.8 }}
        >
          {/* dashed window around the dip */}
          <rect
            x={dipX - DIP_HALF - 8}
            y={BASELINE - 14}
            width={(DIP_HALF + 8) * 2}
            height={DIP_DEPTH + 30}
            rx="6"
            stroke="#facc15"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x={dipX}
            y={BASELINE - 22}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-fira-code), monospace"
            fill="#facc15"
            fillOpacity="0.75"
          >
            transit
          </text>
          {/* pulsing marker at the bottom of the dip */}
          {!prefersReducedMotion && (
            <motion.circle
              cx={dipX}
              cy={BASELINE + DIP_DEPTH}
              r="3"
              fill="#facc15"
              animate={{ opacity: [0.9, 0.25, 0.9], scale: [1, 1.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${dipX}px ${BASELINE + DIP_DEPTH}px` }}
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
}
