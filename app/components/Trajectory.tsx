"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { milestones, yearTicks } from "@/lib/trajectory";

const W = 1000;
const H = 210;
const BASE = 148;
const X0 = 30;
const X1 = 900; // solid curve ends here; dotted future beyond
const N = 300;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const toPx = (frac: number) => X0 + frac * (X1 - X0);

function buildCurve() {
  const rand = mulberry32(20230801);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const x = X0 + (i / (N - 1)) * (X1 - X0);
    let y = BASE + (rand() - 0.5) * 5;
    // brightening events: gaussian flares at each milestone
    for (const m of milestones) {
      const mx = toPx(m.x);
      const w = 16 + m.h * 0.35;
      y -= m.h * Math.exp(-((x - mx) ** 2) / (2 * w * w));
    }
    pts.push([x, y]);
  }
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export default function Trajectory() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const path = useMemo(buildCurve, []);

  const activeMilestone = milestones.find((m) => m.id === active);

  return (
    <section id="trajectory" className="py-section-sm" aria-label="Research trajectory">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="section-title">
            Tra<span className="gradient-text">jectory</span>
          </h2>
          <p className="section-subtitle">
            Each research milestone, plotted as a brightening event.
          </p>
        </motion.div>

        {/* Desktop: the trajectory light curve */}
        <motion.div
          className="relative hidden md:block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* tooltip */}
          <div
            className="pointer-events-none absolute z-10 transition-all duration-200"
            style={{
              left: `${activeMilestone ? (toPx(activeMilestone.x) / W) * 100 : 50}%`,
              top: 0,
              transform: "translateX(-50%)",
              opacity: activeMilestone ? 1 : 0,
            }}
          >
            {activeMilestone && (
              <div
                className="w-max max-w-[280px] rounded-lg border bg-surface/95 backdrop-blur-sm px-3.5 py-2.5 text-left shadow-xl"
                style={{ borderColor: `${activeMilestone.color}40` }}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-text-muted">
                    {activeMilestone.date}
                  </span>
                  {activeMilestone.tag && (
                    <span
                      className="text-[9px] font-mono px-1.5 py-px rounded-full"
                      style={{
                        color: activeMilestone.color,
                        backgroundColor: `${activeMilestone.color}18`,
                      }}
                    >
                      {activeMilestone.tag}
                    </span>
                  )}
                </div>
                <div
                  className="text-sm font-heading font-semibold"
                  style={{ color: activeMilestone.color }}
                >
                  {activeMilestone.title}
                </div>
                <div className="text-xs text-text-secondary leading-snug mt-0.5">
                  {activeMilestone.blurb}
                </div>
              </div>
            )}
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-20" fill="none">
            <defs>
              <linearGradient id="traj-stroke" x1={X0} y1="0" x2={X1} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* baseline axis */}
            <line
              x1={X0}
              y1={BASE + 22}
              x2={W - 10}
              y2={BASE + 22}
              stroke="#333333"
              strokeWidth="1"
            />
            {yearTicks.map((t) => (
              <g key={t.label}>
                <line
                  x1={toPx(t.x)}
                  y1={BASE + 18}
                  x2={toPx(t.x)}
                  y2={BASE + 26}
                  stroke="#666666"
                  strokeWidth="1"
                />
                <text
                  x={toPx(t.x)}
                  y={BASE + 42}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="var(--font-fira-code), monospace"
                  fill="#666666"
                >
                  {t.label}
                </text>
              </g>
            ))}

            {/* the curve draws itself */}
            <motion.path
              d={path}
              stroke="url(#traj-stroke)"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2.6, ease: "easeInOut" }}
            />

            {/* dotted future */}
            <motion.line
              x1={X1}
              y1={BASE}
              x2={W - 14}
              y2={BASE - 14}
              stroke="#facc15"
              strokeWidth="1.4"
              strokeDasharray="3 5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ delay: prefersReducedMotion ? 0.3 : 2.7, duration: 0.8 }}
            />
            <motion.text
              x={W - 12}
              y={BASE - 24}
              textAnchor="end"
              fontSize="12"
              fontFamily="var(--font-fira-code), monospace"
              fill="#facc15"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.95 }}
              viewport={{ once: true }}
              transition={{ delay: prefersReducedMotion ? 0.4 : 3.1, duration: 0.8 }}
            >
              PhD — ?
            </motion.text>

            {/* milestone markers */}
            {milestones.map((m, i) => {
              const mx = toPx(m.x);
              const my = BASE - m.h - 4;
              const isActive = active === m.id;
              return (
                <g key={m.id}>
                  {/* generous invisible hit area */}
                  <rect
                    x={mx - 26}
                    y={my - 26}
                    width="52"
                    height={BASE + 20 - my}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActive(m.id)}
                    onMouseLeave={() => setActive(null)}
                  />
                  <motion.circle
                    cx={mx}
                    cy={my}
                    r={isActive ? 5.5 : 3.5}
                    fill={m.color}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: prefersReducedMotion ? 0.2 : 0.5 + (m.x * 2.2),
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    style={{
                      transformOrigin: `${mx}px ${my}px`,
                      transition: "r 0.2s",
                      filter: isActive ? `drop-shadow(0 0 6px ${m.color})` : undefined,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          <p className="text-center text-[11px] font-mono text-text-muted/70 mt-2">
            hover a flare to resolve the event
          </p>
        </motion.div>

        {/* Mobile: compact vertical list */}
        <div className="md:hidden space-y-4">
          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                  style={{ backgroundColor: m.color }}
                />
                {i < milestones.length - 1 && (
                  <span className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="pb-2">
                <div className="text-[10px] font-mono text-text-muted">{m.date}</div>
                <div className="text-sm font-heading font-semibold" style={{ color: m.color }}>
                  {m.title}
                </div>
                <div className="text-xs text-text-secondary leading-snug">{m.blurb}</div>
              </div>
            </motion.div>
          ))}
          <div className="flex gap-3 items-center pl-0.5">
            <span className="text-accent-yellow text-xs font-mono">⋯</span>
            <span className="text-accent-yellow text-xs font-mono">PhD — ?</span>
          </div>
        </div>
      </div>
    </section>
  );
}
