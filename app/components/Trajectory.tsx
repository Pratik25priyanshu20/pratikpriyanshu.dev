"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { milestones, yearTicks } from "@/lib/trajectory";

const W = 1000;
const H = 310;
const BASE = 230;
const X0 = 30;
const X1 = 880; // solid curve ends here; dotted future beyond
const N = 320;

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

/** 4-point sparkle star, sharper */
function starPath(cx: number, cy: number, o: number) {
  const i = o * 0.24;
  return [
    `M ${cx} ${cy - o}`,
    `L ${cx + i} ${cy - i}`,
    `L ${cx + o} ${cy}`,
    `L ${cx + i} ${cy + i}`,
    `L ${cx} ${cy + o}`,
    `L ${cx - i} ${cy + i}`,
    `L ${cx - o} ${cy}`,
    `L ${cx - i} ${cy - i}`,
    "Z",
  ].join(" ");
}

function buildCurve() {
  const rand = mulberry32(20230801);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const x = X0 + (i / (N - 1)) * (X1 - X0);
    let y = BASE + (rand() - 0.5) * 5;
    for (const m of milestones) {
      const mx = toPx(m.x);
      const w = 13 + m.h * 0.16;
      y -= m.h * Math.exp(-((x - mx) ** 2) / (2 * w * w));
    }
    pts.push([x, y]);
  }
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${X1},${BASE + 20} L${X0},${BASE + 20} Z`;
  // sample the actual curve height at any x so markers sit exactly on peaks
  const yAt = (x: number) => {
    const idx = Math.round(((x - X0) / (X1 - X0)) * (N - 1));
    return pts[Math.max(0, Math.min(N - 1, idx))][1];
  };
  return { line, area, yAt };
}

/** point on a quadratic bezier */
function qBezier(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number]
): [number, number] {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

export default function Trajectory() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const { line, area, yAt } = useMemo(buildCurve, []);

  const activeMilestone = milestones.find((m) => m.id === active);

  return (
    <section id="trajectory" className="py-section-sm" aria-label="Research trajectory">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h2 className="section-title">
            Tra<span className="gradient-text">jectory</span>
          </h2>
          <p className="section-subtitle">
            Each research milestone, plotted as a brightening event in the sky.
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
              left: `${activeMilestone ? Math.min(86, Math.max(14, (toPx(activeMilestone.x) / W) * 100)) : 50}%`,
              top: -6,
              transform: "translateX(-50%)",
              opacity: activeMilestone ? 1 : 0,
            }}
          >
            {activeMilestone && (
              <div
                className="w-max max-w-[300px] rounded-lg border bg-surface/95 backdrop-blur-sm px-3.5 py-2.5 text-left shadow-xl"
                style={{ borderColor: `${activeMilestone.color}45` }}
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

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-14" fill="none">
            <defs>
              <linearGradient id="traj-stroke" x1={X0} y1="0" x2={X1} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
                <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="traj-fill" x1="0" y1="50" x2="0" y2={BASE + 20} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* area under the curve */}
            <motion.path
              d={area}
              fill="url(#traj-fill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, delay: 0.6 }}
            />

            {/* baseline axis */}
            <line
              x1={X0}
              y1={BASE + 20}
              x2={W - 10}
              y2={BASE + 20}
              stroke="#333333"
              strokeWidth="1"
            />
            {yearTicks.map((t) => (
              <g key={t.label}>
                <line
                  x1={toPx(t.x)}
                  y1={BASE + 16}
                  x2={toPx(t.x)}
                  y2={BASE + 24}
                  stroke="#666666"
                  strokeWidth="1"
                />
                <text
                  x={toPx(t.x)}
                  y={BASE + 42}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="var(--font-fira-code), monospace"
                  fill="#777777"
                >
                  {t.label}
                </text>
              </g>
            ))}

            {/* stems + peak glows */}
            {milestones.map((m) => {
              const mx = toPx(m.x);
              const my = yAt(mx) - 3;
              const isActive = active === m.id;
              const big = m.h >= 90;
              return (
                <g key={`under-${m.id}`}>
                  <motion.line
                    x1={mx}
                    y1={BASE + 18}
                    x2={mx}
                    y2={my + 8}
                    stroke="#8a93a8"
                    strokeWidth="0.7"
                    strokeDasharray="2 5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: isActive ? 0.7 : 0.3 }}
                    viewport={{ once: true }}
                    transition={{ delay: prefersReducedMotion ? 0.1 : 0.4 + m.x * 2 }}
                  />
                  <circle
                    cx={mx}
                    cy={my}
                    r={big ? 26 : 18}
                    fill={big ? "#facc15" : "#9db8e8"}
                    opacity={isActive ? 0.3 : big ? 0.16 : 0.1}
                    style={{ transition: "opacity 0.25s", filter: "blur(9px)" }}
                  />
                </g>
              );
            })}

            {/* the curve draws itself */}
            <motion.path
              d={line}
              stroke="url(#traj-stroke)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2.6, ease: "easeInOut" }}
            />

            {/* dotted rise into the future — explicit dots along a curve */}
            {[0.12, 0.3, 0.48, 0.66, 0.84].map((t, k) => {
              const p0: [number, number] = [X1, yAt(X1)];
              const p1: [number, number] = [X1 + 40, yAt(X1) - 14];
              const p2: [number, number] = [X1 + 62, BASE - 50];
              const [dx, dy] = qBezier(t, p0, p1, p2);
              return (
                <motion.circle
                  key={k}
                  cx={dx}
                  cy={dy}
                  r={1.5 + t * 1.8}
                  fill="#facc15"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.4 + t * 0.55 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: prefersReducedMotion ? 0.3 : 2.6 + k * 0.16,
                    duration: 0.4,
                  }}
                />
              );
            })}

            {/* the PhD star */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: prefersReducedMotion ? 0.4 : 3.3,
                type: "spring",
                stiffness: 260,
                damping: 16,
              }}
              style={{ transformOrigin: `${X1 + 72}px ${BASE - 62}px` }}
            >
              <circle
                cx={X1 + 72}
                cy={BASE - 62}
                r="20"
                fill="#facc15"
                opacity="0.18"
                style={{ filter: "blur(8px)" }}
              />
              {!prefersReducedMotion ? (
                <motion.path
                  d={starPath(X1 + 72, BASE - 62, 11)}
                  fill="#fde68a"
                  animate={{ opacity: [1, 0.55, 1], scale: [1, 1.18, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: `${X1 + 72}px ${BASE - 62}px` }}
                />
              ) : (
                <path d={starPath(X1 + 72, BASE - 62, 11)} fill="#fde68a" />
              )}
              <text
                x={X1 + 72}
                y={BASE - 84}
                textAnchor="middle"
                fontSize="15"
                fontFamily="var(--font-space-grotesk), sans-serif"
                fontWeight="700"
                fill="#facc15"
              >
                PhD
              </text>
            </motion.g>

            {/* star markers + always-visible labels */}
            {milestones.map((m) => {
              const mx = toPx(m.x);
              const my = yAt(mx) - 3;
              const isActive = active === m.id;
              const starR = 4 + m.h * 0.04;
              return (
                <g key={m.id}>
                  <rect
                    x={mx - 30}
                    y={my - 44}
                    width="60"
                    height={BASE + 18 - my + 44}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActive(m.id)}
                    onMouseLeave={() => setActive(null)}
                  />
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: prefersReducedMotion ? 0.2 : 0.5 + m.x * 2.2,
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    style={{ transformOrigin: `${mx}px ${my}px` }}
                  >
                    {/* cross rays */}
                    <line
                      x1={mx - starR * 1.9}
                      y1={my}
                      x2={mx + starR * 1.9}
                      y2={my}
                      stroke={isActive ? "#ffffff" : "#e8e2d0"}
                      strokeOpacity={isActive ? 0.7 : 0.35}
                      strokeWidth="0.6"
                      style={{ transition: "stroke-opacity 0.2s" }}
                    />
                    <line
                      x1={mx}
                      y1={my - starR * 1.9}
                      x2={mx}
                      y2={my + starR * 1.9}
                      stroke={isActive ? "#ffffff" : "#e8e2d0"}
                      strokeOpacity={isActive ? 0.7 : 0.35}
                      strokeWidth="0.6"
                      style={{ transition: "stroke-opacity 0.2s" }}
                    />
                    {!prefersReducedMotion ? (
                      <motion.path
                        d={starPath(mx, my, starR)}
                        fill={isActive ? "#ffffff" : "#f2ead6"}
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{
                          duration: 2 + (m.x * 7) % 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: (m.x * 13) % 1.8,
                        }}
                        style={{
                          filter: isActive
                            ? "drop-shadow(0 0 8px #facc15)"
                            : "drop-shadow(0 0 4px rgba(230, 238, 255, 0.7))",
                          transition: "fill 0.2s",
                        }}
                      />
                    ) : (
                      <path d={starPath(mx, my, starR)} fill="#f2ead6" />
                    )}
                    {/* bright core */}
                    <circle
                      cx={mx}
                      cy={my}
                      r="1.1"
                      fill="#ffffff"
                      opacity={isActive ? 1 : 0.9}
                    />
                  </motion.g>
                  {/* always-visible event label */}
                  <motion.text
                    x={mx}
                    y={my - starR - 10}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontFamily="var(--font-fira-code), monospace"
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? "#ffffff" : "#c7cdd8"}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: isActive ? 1 : 0.8 }}
                    viewport={{ once: true }}
                    transition={{ delay: prefersReducedMotion ? 0.2 : 0.7 + m.x * 2.2 }}
                    style={{ cursor: "pointer", transition: "fill 0.2s" }}
                    onMouseEnter={() => setActive(m.id)}
                    onMouseLeave={() => setActive(null)}
                  >
                    {m.label}
                  </motion.text>
                </g>
              );
            })}
          </svg>

          <p className="text-center text-[11px] font-mono text-text-muted/70 mt-1">
            hover a star to resolve the event
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
            <span className="text-accent-yellow text-sm font-mono tracking-[0.3em]">·····</span>
            <span className="text-accent-yellow text-sm font-heading font-bold">✦ PhD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
