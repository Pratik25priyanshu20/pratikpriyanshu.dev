"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface EffectProps {
  active: boolean;
  cardRef: RefObject<HTMLElement | null>;
}

/* ---------------- Haftung: YOLO self-detection (toned down) ---------------- */

interface DetBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  conf: string;
}

function YoloOverlay({ active, cardRef }: EffectProps) {
  const [boxes, setBoxes] = useState<DetBox[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active || !cardRef.current) {
      setBoxes([]);
      return;
    }
    const cardRect = cardRef.current.getBoundingClientRect();
    const els = cardRef.current.querySelectorAll<HTMLElement>("[data-yolo]");
    const confs = ["0.97", "0.93"];
    setBoxes(
      Array.from(els)
        .slice(0, 2)
        .map((el, i) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left - cardRect.left - 4,
            y: r.top - cardRect.top - 4,
            w: r.width + 8,
            h: r.height + 8,
            label: el.dataset.yolo ?? "object",
            conf: confs[i % confs.length],
          };
        })
    );
    // detection pass fades out — it's a scan, not a permanent overlay
    const t = setTimeout(() => setBoxes([]), 2500);
    return () => clearTimeout(t);
  }, [active, cardRef]);

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block" aria-hidden="true">
      <AnimatePresence>
        {boxes.map((b, i) => (
          <motion.div
            key={`${b.label}-${i}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.25, delay: i * 0.18 }}
            className="absolute border rounded-sm"
            style={{
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              borderColor: "rgba(74, 222, 128, 0.45)",
            }}
          >
            <span className="absolute -top-4 left-0 px-1 py-px text-[9px] font-mono rounded-sm bg-[#4ade80]/70 text-black whitespace-nowrap">
              {b.label} {b.conf}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Autobahn: LiDAR sweep + ADAS HUD ---------------- */

const PINGS = [
  { left: "22%", top: "32%", d: "8.2m", delay: 0.4 },
  { left: "68%", top: "52%", d: "23.6m", delay: 1.6 },
  { left: "42%", top: "74%", d: "14.1m", delay: 2.8 },
];

const BRACKETS = [
  "top-3 left-3 border-t-2 border-l-2 rounded-tl",
  "top-3 right-3 border-t-2 border-r-2 rounded-tr",
  "bottom-3 left-3 border-b-2 border-l-2 rounded-bl",
  "bottom-3 right-3 border-b-2 border-r-2 rounded-br",
];

function LidarHud({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();
  const [lat, setLat] = useState("0.4");

  useEffect(() => {
    if (!active) return;
    const id = setInterval(
      () => setLat((0.3 + Math.random() * 0.2).toFixed(1)),
      700
    );
    return () => clearInterval(id);
  }, [active]);

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-[5] overflow-hidden rounded-2xl hidden md:block"
          aria-hidden="true"
        >
          {/* rotating LiDAR sweep */}
          <motion.div
            className="absolute -inset-1/2"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(6,182,212,0) 0deg, rgba(6,182,212,0.10) 24deg, rgba(6,182,212,0) 48deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          />

          {/* HUD corner brackets */}
          {BRACKETS.map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              className={`absolute w-6 h-6 border-accent-cyan ${cls}`}
            />
          ))}

          {/* telemetry readout */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-background/70 backdrop-blur-sm border border-accent-cyan/25 text-[10px] font-mono text-accent-cyan/90 whitespace-nowrap"
          >
            LAT {lat}ms &middot; ASIL-B &middot; CAM &#10003; LIDAR &#10003; RADAR &#10003;
          </motion.div>

          {/* detection pings */}
          {PINGS.map((p) => (
            <div key={p.d} className="absolute" style={{ left: p.left, top: p.top }}>
              <motion.span
                className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-accent-cyan"
                animate={{ opacity: [0, 1, 1, 0.4] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  delay: p.delay,
                  times: [0, 0.05, 0.6, 1],
                }}
              />
              <motion.span
                className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full border border-accent-cyan"
                animate={{ scale: [1, 3.2], opacity: [0.7, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.1, delay: p.delay }}
              />
              <motion.span
                className="absolute left-3 -top-1 text-[10px] font-mono text-accent-cyan/80 whitespace-nowrap"
                animate={{ opacity: [0, 0.9, 0.9, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  delay: p.delay,
                  times: [0, 0.05, 0.6, 1],
                }}
              >
                obj {p.d}
              </motion.span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- HNEP: QCT superposition → collapse ---------------- */

const QCT_W = 158;
const QCT_H = 118;
const QUADS = [
  { x: 41, y: 34, label: "GENUINE" },
  { x: 117, y: 34, label: "IGNORED" },
  { x: 41, y: 86, label: "REGULARIZER" },
  { x: 117, y: 86, label: "DEAD WEIGHT" },
];
// collapse target: REGULARIZER (the surprising finding)
const COLLAPSE = QUADS[2];

function QctCollapse({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="absolute bottom-16 right-5 z-[1] pointer-events-none hidden lg:block"
      aria-hidden="true"
      style={{ opacity: active ? 0.95 : 0.3, transition: "opacity 0.5s" }}
    >
      <svg width="228" height="170" viewBox={`0 0 ${QCT_W} ${QCT_H}`} fill="none">
        {/* grid */}
        <rect x="4" y="8" width="150" height="104" rx="6" stroke="#8b5cf6" strokeOpacity="0.4" />
        <line x1="79" y1="8" x2="79" y2="112" stroke="#8b5cf6" strokeOpacity="0.3" />
        <line x1="4" y1="60" x2="154" y2="60" stroke="#8b5cf6" strokeOpacity="0.3" />

        {/* quadrant labels */}
        {QUADS.map((q) => (
          <text
            key={q.label}
            x={q.x}
            y={q.y + 16}
            textAnchor="middle"
            fontSize="6.5"
            fontFamily="var(--font-fira-code), monospace"
            fill="#8b5cf6"
            fillOpacity={active && q.label === "REGULARIZER" ? 1 : 0.55}
            fontWeight={active && q.label === "REGULARIZER" ? 700 : 400}
          >
            {q.label}
          </text>
        ))}

        {!prefersReducedMotion && (
          <>
            {active ? (
              /* collapsed state */
              <g>
                <motion.circle
                  cx={COLLAPSE.x}
                  cy={COLLAPSE.y - 4}
                  r="4"
                  fill="#8b5cf6"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55, type: "spring", stiffness: 300 }}
                  style={{ transformOrigin: `${COLLAPSE.x}px ${COLLAPSE.y - 4}px` }}
                />
                <motion.circle
                  cx={COLLAPSE.x}
                  cy={COLLAPSE.y - 4}
                  r="4"
                  stroke="#8b5cf6"
                  strokeWidth="1"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [1, 2.6, 3.4] }}
                  transition={{ delay: 0.6, duration: 0.9 }}
                  style={{ transformOrigin: `${COLLAPSE.x}px ${COLLAPSE.y - 4}px` }}
                />
                {/* ghosts converging */}
                {[QUADS[0], QUADS[3]].map((q, i) => (
                  <motion.circle
                    key={i}
                    r="3.5"
                    fill="#8b5cf6"
                    initial={{ cx: q.x, cy: q.y - 4, opacity: 0.35 }}
                    animate={{
                      cx: COLLAPSE.x,
                      cy: COLLAPSE.y - 4,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.55, ease: "easeIn" }}
                  />
                ))}
              </g>
            ) : (
              /* superposition: two ghosts oscillating between quadrants */
              <g>
                <motion.circle
                  r="3.5"
                  fill="#8b5cf6"
                  animate={{
                    cx: [QUADS[0].x, QUADS[2].x, QUADS[1].x, QUADS[0].x],
                    cy: [QUADS[0].y - 4, QUADS[2].y - 4, QUADS[1].y - 4, QUADS[0].y - 4],
                    opacity: [0.3, 0.45, 0.3, 0.3],
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  r="3.5"
                  fill="#8b5cf6"
                  animate={{
                    cx: [QUADS[3].x, QUADS[1].x, QUADS[2].x, QUADS[3].x],
                    cy: [QUADS[3].y - 4, QUADS[1].y - 4, QUADS[2].y - 4, QUADS[3].y - 4],
                    opacity: [0.25, 0.4, 0.25, 0.25],
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                />
              </g>
            )}
          </>
        )}

        {/* collapse annotation */}
        {active && (
          <motion.text
            x={QCT_W / 2}
            y={QCT_H - 1}
            textAnchor="middle"
            fontSize="7"
            fontFamily="var(--font-fira-code), monospace"
            fill="#8b5cf6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1.1 }}
          >
            measured: replaceable, yet load-bearing
          </motion.text>
        )}
      </svg>
    </div>
  );
}

/* ---------------- cMSCI: live coherence measurement ---------------- */

const CO_W = 132;
const CO_H = 128;
const CO_C = { x: 66, y: 60 };
const CO_R = 38;
const CO_VERTS = [-90, 30, 150].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CO_C.x + CO_R * Math.cos(rad), y: CO_C.y + CO_R * Math.sin(rad) };
});
const CO_MODS = [
  { label: "T", color: "#60a5fa" },
  { label: "I", color: "#a855f7" },
  { label: "A", color: "#10b981" },
];
// idle wobble offsets per node
const WOBBLE: [number, number][][] = [
  [[0, 0], [5, -4], [-4, 3], [0, 0]],
  [[0, 0], [-6, 2], [4, 5], [0, 0]],
  [[0, 0], [3, 6], [-5, -3], [0, 0]],
];

function CoherenceMeter({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();
  const [score, setScore] = useState("0.71");

  useEffect(() => {
    if (active) return;
    const id = setInterval(
      () => setScore((0.66 + Math.random() * 0.1).toFixed(2)),
      900
    );
    return () => clearInterval(id);
  }, [active]);

  return (
    <div
      className="absolute bottom-6 right-5 z-[5] pointer-events-none hidden lg:block"
      aria-hidden="true"
      style={{ opacity: active ? 1 : 0.45, transition: "opacity 0.5s" }}
    >
      <svg width="172" height="166" viewBox={`0 0 ${CO_W} ${CO_H}`} fill="none">
        {/* triangle fill — glows when coherent */}
        <motion.polygon
          points={CO_VERTS.map((v) => `${v.x},${v.y}`).join(" ")}
          stroke="#a855f7"
          strokeWidth="1"
          initial={false}
          animate={{
            strokeOpacity: active ? 0.85 : 0.3,
            fillOpacity: active ? 0.14 : 0.04,
          }}
          fill="#a855f7"
          transition={{ duration: 0.6 }}
        />

        {/* modality nodes: wobble when idle, align when hovered */}
        {CO_VERTS.map((v, i) => (
          <motion.g
            key={CO_MODS[i].label}
            initial={false}
            animate={
              active || prefersReducedMotion
                ? { x: 0, y: 0 }
                : {
                    x: WOBBLE[i].map(([wx]) => wx),
                    y: WOBBLE[i].map(([, wy]) => wy),
                  }
            }
            transition={
              active
                ? { type: "spring", stiffness: 200, damping: 18 }
                : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }
            }
          >
            <circle
              cx={v.x}
              cy={v.y}
              r="9"
              fill="#111111"
              stroke={CO_MODS[i].color}
              strokeOpacity={active ? 1 : 0.55}
              strokeWidth="1.3"
              style={{ transition: "stroke-opacity 0.4s" }}
            />
            <text
              x={v.x}
              y={v.y + 3.5}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-fira-code), monospace"
              fill={CO_MODS[i].color}
            >
              {CO_MODS[i].label}
            </text>
            {active && (
              <motion.circle
                cx={v.x}
                cy={v.y}
                r="9"
                stroke={CO_MODS[i].color}
                strokeWidth="1"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0], scale: [1, 1.9, 2.4] }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.8 }}
                style={{ transformOrigin: `${v.x}px ${v.y}px` }}
              />
            )}
          </motion.g>
        ))}

        {/* live score readout */}
        <text
          x={CO_C.x}
          y={CO_H - 12}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-fira-code), monospace"
          fill="#a855f7"
          fillOpacity="0.95"
        >
          cMSCI {active ? "0.87" : score}
        </text>
        {active && (
          <motion.text
            x={CO_C.x}
            y={CO_H - 1}
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="var(--font-fira-code), monospace"
            fill="#10b981"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ delay: 0.7 }}
          >
            &#10003; calibrated
          </motion.text>
        )}
      </svg>
    </div>
  );
}

/* ---------------- JuRAG: citation graph bloom (unchanged) ---------------- */

const GRAPH_NODES = [
  { x: 75, y: 50, r: 5, hop: 0 },
  { x: 34, y: 26, r: 3.4, hop: 1 },
  { x: 116, y: 30, r: 3, hop: 1 },
  { x: 28, y: 72, r: 2.6, hop: 1 },
  { x: 118, y: 74, r: 3.6, hop: 1 },
  { x: 76, y: 12, r: 2.4, hop: 1 },
  { x: 10, y: 46, r: 2, hop: 2 },
  { x: 140, y: 52, r: 2.2, hop: 2 },
  { x: 52, y: 90, r: 1.8, hop: 2 },
  { x: 102, y: 92, r: 2, hop: 2 },
];
const GRAPH_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 6], [2, 7], [3, 8], [4, 9], [1, 5], [4, 7],
];

function CitationGraph({ active }: EffectProps) {
  return (
    <div
      className="absolute bottom-8 right-5 z-[1] pointer-events-none hidden lg:block"
      aria-hidden="true"
      style={{ opacity: active ? 0.85 : 0.22, transition: "opacity 0.5s" }}
    >
      <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
        {GRAPH_EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={GRAPH_NODES[a].x}
            y1={GRAPH_NODES[a].y}
            x2={GRAPH_NODES[b].x}
            y2={GRAPH_NODES[b].y}
            stroke="#ef4444"
            strokeWidth={a === 0 || b === 0 ? 0.8 : 0.5}
            initial={false}
            animate={{
              strokeOpacity: active ? (a === 0 || b === 0 ? 0.8 : 0.35) : 0.3,
            }}
            transition={{ duration: 0.4, delay: active ? i * 0.06 : 0 }}
          />
        ))}
        {GRAPH_NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.hop === 0 ? "#ef4444" : "#111111"}
            stroke="#ef4444"
            strokeWidth="1"
            initial={false}
            animate={{
              strokeOpacity: active ? (n.hop <= 1 ? 1 : 0.5) : 0.45,
              scale: active && n.hop === 0 ? [1, 1.25, 1] : 1,
            }}
            transition={{
              scale: { duration: 1.6, repeat: active ? Infinity : 0 },
              strokeOpacity: { duration: 0.4, delay: active ? n.hop * 0.2 : 0 },
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ---------------- ARKIS: contradiction-penalized confidence gauge ---------------- */

const GAUGE_CX = 75;
const GAUGE_CY = 72;
const GAUGE_R = 34;

function gaugePoint(frac: number) {
  // 0 → 180deg (left), 1 → 0deg (right)
  const angle = Math.PI * (1 - frac);
  return {
    x: GAUGE_CX + GAUGE_R * Math.cos(angle),
    y: GAUGE_CY - GAUGE_R * Math.sin(angle),
  };
}

const EVIDENCE = [
  { label: "ev1 ✓", ok: true },
  { label: "ev2 ✓", ok: true },
  { label: "ev3 ✗ contradiction", ok: false },
];

function ConfidenceGauge({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();
  const needle78 = gaugePoint(0.78);
  const needle95 = gaugePoint(0.95);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-16 right-5 z-[5] pointer-events-none hidden lg:block"
          aria-hidden="true"
        >
          <svg width="150" height="110" viewBox="0 0 150 110" fill="none">
            {/* evidence chips */}
            {EVIDENCE.map((e, i) => (
              <motion.g
                key={e.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.3 }}
              >
                <rect
                  x={i === 2 ? 8 : 32}
                  y={4 + i * 15}
                  width={i === 2 ? 106 : 58}
                  height="12"
                  rx="6"
                  fill={e.ok ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.15)"}
                  stroke={e.ok ? "#10b981" : "#ef4444"}
                  strokeOpacity="0.6"
                  strokeWidth="0.8"
                />
                <text
                  x={i === 2 ? 61 : 61}
                  y={13 + i * 15}
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="var(--font-fira-code), monospace"
                  fill={e.ok ? "#10b981" : "#ef4444"}
                >
                  {e.label}
                </text>
              </motion.g>
            ))}

            {/* gauge arc */}
            <path
              d={`M ${GAUGE_CX - GAUGE_R} ${GAUGE_CY} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${GAUGE_CX + GAUGE_R} ${GAUGE_CY}`}
              stroke="#3b82f6"
              strokeOpacity="0.3"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* fill: rushes to 0.95 then penalized back to 0.78 */}
            <motion.path
              d={`M ${GAUGE_CX - GAUGE_R} ${GAUGE_CY} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${GAUGE_CX + GAUGE_R} ${GAUGE_CY}`}
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={
                prefersReducedMotion
                  ? { pathLength: 0.78 }
                  : { pathLength: [0, 0.95, 0.95, 0.78] }
              }
              transition={{ delay: 1.1, duration: 1.5, times: [0, 0.5, 0.65, 1] }}
            />
            {/* needle */}
            <motion.line
              x1={GAUGE_CX}
              y1={GAUGE_CY}
              stroke="#60a5fa"
              strokeWidth="1.4"
              initial={{ x2: GAUGE_CX - GAUGE_R + 6, y2: GAUGE_CY }}
              animate={
                prefersReducedMotion
                  ? { x2: needle78.x, y2: needle78.y }
                  : {
                      x2: [GAUGE_CX - GAUGE_R + 6, needle95.x, needle95.x, needle78.x],
                      y2: [GAUGE_CY, needle95.y, needle95.y, needle78.y],
                    }
              }
              transition={{ delay: 1.1, duration: 1.5, times: [0, 0.5, 0.65, 1] }}
            />
            <circle cx={GAUGE_CX} cy={GAUGE_CY} r="2.5" fill="#60a5fa" />

            {/* penalty flash */}
            {!prefersReducedMotion && (
              <motion.text
                x={GAUGE_CX + 42}
                y={GAUGE_CY - 26}
                fontSize="8"
                fontFamily="var(--font-fira-code), monospace"
                fill="#ef4444"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0.7] }}
                transition={{ delay: 2.0, duration: 0.8 }}
              >
                &#8722;0.4 cap
              </motion.text>
            )}

            {/* readout */}
            <motion.text
              x={GAUGE_CX}
              y={GAUGE_CY + 22}
              textAnchor="middle"
              fontSize="13"
              fontFamily="var(--font-fira-code), monospace"
              fontWeight="700"
              fill="#3b82f6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
            >
              0.78
            </motion.text>
            <motion.text
              x={GAUGE_CX}
              y={GAUGE_CY + 34}
              textAnchor="middle"
              fontSize="7"
              fontFamily="var(--font-fira-code), monospace"
              fill="#a0a0a0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 2.5 }}
            >
              contradiction-penalized confidence
            </motion.text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- ExoVeil: mini light curve ---------------- */

function miniCurvePath(): { path: string; dipX: number } {
  const W = 170;
  const BASE = 20;
  let seed = 987654;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const dipX = 112;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * W;
    let y = BASE + (rand() - 0.5) * 4;
    const d = Math.abs(x - dipX);
    if (d < 14) y += d > 9 ? ((14 - d) / 5) * 11 : 11;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return { path: pts.join(" "), dipX };
}

const MINI_CURVE = miniCurvePath();

function MiniLightCurve({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-16 right-5 z-[5] pointer-events-none hidden lg:block"
          aria-hidden="true"
        >
          <svg width="252" height="77" viewBox="0 0 170 52" fill="none">
            <motion.path
              d={MINI_CURVE.path}
              stroke="#facc15"
              strokeOpacity="0.75"
              strokeWidth="1.2"
              initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
            />
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0.2 : 1.2 }}
            >
              <circle cx={MINI_CURVE.dipX} cy="31" r="2.2" fill="#facc15" />
              <text
                x={MINI_CURVE.dipX}
                y="46"
                textAnchor="middle"
                fontSize="8.5"
                fontFamily="var(--font-fira-code), monospace"
                fill="#facc15"
                fillOpacity="0.9"
              >
                SNR 31.2
              </text>
            </motion.g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- SWIM: satellite + agent mesh with graceful degradation ---------------- */

const MESH_HUB = { x: 75, y: 52 };
const MESH_AGENTS = [
  { x: 22, y: 18, name: "HOMOGEN" },
  { x: 128, y: 18, name: "CALIBRO" },
  { x: 22, y: 88, name: "VISIOS" }, // this one fails
  { x: 128, y: 88, name: "PREDIKT" },
];
const FAILING_INDEX = 2;

function AgentMesh({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    if (!active) {
      setDegraded(false);
      return;
    }
    const id = setInterval(() => setDegraded((d) => !d), 3800);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div
      className="absolute bottom-16 right-5 z-[1] pointer-events-none hidden lg:block"
      aria-hidden="true"
      style={{ opacity: active ? 0.95 : 0.3, transition: "opacity 0.5s" }}
    >
      <svg width="150" height="118" viewBox="0 0 150 118" fill="none">
        {/* edges */}
        {MESH_AGENTS.map((a, i) => {
          const dead = degraded && i === FAILING_INDEX;
          return (
            <line
              key={a.name}
              x1={MESH_HUB.x}
              y1={MESH_HUB.y}
              x2={a.x}
              y2={a.y}
              stroke={dead ? "#666666" : "#10b981"}
              strokeOpacity={dead ? 0.25 : active ? 0.55 : 0.35}
              strokeWidth="0.8"
              strokeDasharray={dead ? "3 3" : undefined}
              style={{ transition: "all 0.6s" }}
            />
          );
        })}

        {/* message pulses along live edges */}
        {!prefersReducedMotion &&
          active &&
          MESH_AGENTS.map((a, i) => {
            if (degraded && i === FAILING_INDEX) return null;
            return (
              <motion.circle
                key={`pulse-${a.name}`}
                r="2"
                fill="#10b981"
                animate={{
                  cx: [a.x, MESH_HUB.x],
                  cy: [a.y, MESH_HUB.y],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: degraded ? 1.0 : 1.6,
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: "easeIn",
                }}
              />
            );
          })}

        {/* agents */}
        {MESH_AGENTS.map((a, i) => {
          const dead = degraded && i === FAILING_INDEX;
          return (
            <g key={a.name} style={{ transition: "opacity 0.6s", opacity: dead ? 0.3 : 1 }}>
              <circle
                cx={a.x}
                cy={a.y}
                r="6"
                fill="#111111"
                stroke={dead ? "#666666" : "#10b981"}
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
              {dead && (
                <text
                  x={a.x}
                  y={a.y + 2.8}
                  textAnchor="middle"
                  fontSize="7"
                  fill="#ef4444"
                >
                  &#10007;
                </text>
              )}
              <text
                x={a.x}
                y={a.y < 50 ? a.y - 10 : a.y + 16}
                textAnchor="middle"
                fontSize="6.5"
                fontFamily="var(--font-fira-code), monospace"
                fill={dead ? "#666666" : "#10b981"}
                fillOpacity="0.85"
              >
                {a.name}
              </text>
            </g>
          );
        })}

        {/* orchestrator hub */}
        <circle
          cx={MESH_HUB.x}
          cy={MESH_HUB.y}
          r="8"
          fill="#10b981"
          fillOpacity="0.15"
          stroke="#10b981"
          strokeWidth="1.3"
        />
        <text
          x={MESH_HUB.x}
          y={MESH_HUB.y + 3}
          textAnchor="middle"
          fontSize="6"
          fontFamily="var(--font-fira-code), monospace"
          fill="#10b981"
        >
          ORCH
        </text>

        {/* status line */}
        <text
          x="75"
          y="114"
          textAnchor="middle"
          fontSize="7.5"
          fontFamily="var(--font-fira-code), monospace"
          fill={degraded ? "#facc15" : "#10b981"}
          fillOpacity="0.95"
          style={{ transition: "fill 0.5s" }}
        >
          {degraded
            ? "4/5 agents · degraded · output stable"
            : "5/5 agents · nominal"}
        </text>
      </svg>
    </div>
  );
}

function SatellitePass({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {active && (
        <div
          className="absolute inset-0 pointer-events-none z-[5] overflow-hidden rounded-2xl hidden md:block"
          aria-hidden="true"
        >
          <motion.div
            className="absolute"
            initial={{ left: "-8%", top: "4%", opacity: 0 }}
            animate={{
              left: ["-8%", "104%"],
              top: ["4%", "62%"],
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "linear",
              times: [0, 0.08, 0.92, 1],
            }}
          >
            <div
              className="absolute right-2 top-1/2 h-[2px] w-24"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(16,185,129,0.55))",
                transform: "rotate(27.5deg)",
                transformOrigin: "right center",
              }}
            />
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <rect x="0" y="4" width="6" height="4" rx="0.5" fill="#10b981" fillOpacity="0.85" />
              <rect x="16" y="4" width="6" height="4" rx="0.5" fill="#10b981" fillOpacity="0.85" />
              <rect x="7" y="2.5" width="8" height="7" rx="1" fill="#e5e7eb" />
              <line x1="6" y1="6" x2="7" y2="6" stroke="#9ca3af" strokeWidth="1" />
              <line x1="15" y1="6" x2="16" y2="6" stroke="#9ca3af" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SwimEffects(props: EffectProps) {
  return (
    <>
      <SatellitePass {...props} />
      <AgentMesh {...props} />
    </>
  );
}

/* ---------------- dispatcher ---------------- */

const EFFECTS: Record<string, React.ComponentType<EffectProps>> = {
  haftung: YoloOverlay,
  autobahn: LidarHud,
  hnep: QctCollapse,
  cmsci: CoherenceMeter,
  jurag: CitationGraph,
  arkis: ConfidenceGauge,
  exoveil: MiniLightCurve,
  swim: SwimEffects,
};

export default function CardEffect({
  projectId,
  active,
  cardRef,
}: EffectProps & { projectId: string }) {
  const Effect = EFFECTS[projectId];
  if (!Effect) return null;
  return <Effect active={active} cardRef={cardRef} />;
}
