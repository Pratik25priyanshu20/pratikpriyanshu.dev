"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface EffectProps {
  active: boolean;
  cardRef: RefObject<HTMLElement | null>;
}

/* ---------------- #1 Haftung: YOLO self-detection ---------------- */

interface DetBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  conf: string;
}

const YOLO_CONFS = ["0.97", "0.93", "0.91", "0.88", "0.86", "0.84"];

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
    setBoxes(
      Array.from(els).map((el, i) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cardRect.left - 4,
          y: r.top - cardRect.top - 4,
          w: r.width + 8,
          h: r.height + 8,
          label: el.dataset.yolo ?? "object",
          conf: YOLO_CONFS[i % YOLO_CONFS.length],
        };
      })
    );
  }, [active, cardRef]);

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block" aria-hidden="true">
      <AnimatePresence>
        {active &&
          boxes.map((b, i) => (
            <motion.div
              key={`${b.label}-${i}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.25,
                delay: i * 0.13,
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="absolute border-[1.5px] rounded-sm"
              style={{
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                borderColor: "rgba(74, 222, 128, 0.75)",
              }}
            >
              <span className="absolute -top-5 left-0 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-sm bg-[#4ade80] text-black whitespace-nowrap">
                {b.label} {b.conf}
              </span>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- #3 Autobahn: LiDAR sweep ---------------- */

const PINGS = [
  { left: "22%", top: "32%", d: "8.2m", delay: 0.4 },
  { left: "68%", top: "52%", d: "23.6m", delay: 1.6 },
  { left: "42%", top: "74%", d: "14.1m", delay: 2.8 },
];

function LidarSweep({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();
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
          <motion.div
            className="absolute -inset-1/2"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(6,182,212,0) 0deg, rgba(6,182,212,0.10) 24deg, rgba(6,182,212,0) 48deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          />
          {PINGS.map((p) => (
            <div
              key={p.d}
              className="absolute"
              style={{ left: p.left, top: p.top }}
            >
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

/* ---------------- #4 cMSCI: coherence triangle ---------------- */

const TRI_R = 24;
const TRI_C = 38;
const VERTS = [-90, 30, 150].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: TRI_C + TRI_R * Math.cos(rad), y: TRI_C + TRI_R * Math.sin(rad) };
});
const MODALITIES = [
  { label: "T", color: "#60a5fa" },
  { label: "I", color: "#a855f7" },
  { label: "A", color: "#10b981" },
];

function CoherenceTriangle({ active }: EffectProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="absolute top-5 right-5 z-[5] pointer-events-none hidden lg:block"
      aria-hidden="true"
    >
      <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
        <motion.g
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: active ? 14 : 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "38px 38px" }}
        >
          <polygon
            points={VERTS.map((v) => `${v.x},${v.y}`).join(" ")}
            stroke="#a855f7"
            strokeOpacity={active ? 0.7 : 0.25}
            strokeWidth="1"
            fill="#a855f7"
            fillOpacity={active ? 0.08 : 0.03}
            style={{ transition: "all 0.5s" }}
          />
          {VERTS.map((v, i) => (
            <g key={MODALITIES[i].label}>
              <circle
                cx={v.x}
                cy={v.y}
                r="7"
                fill="#111111"
                stroke={MODALITIES[i].color}
                strokeOpacity={active ? 0.9 : 0.4}
                strokeWidth="1.2"
                style={{ transition: "stroke-opacity 0.5s" }}
              />
              <motion.g
                animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                transition={{
                  duration: active ? 14 : 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ transformOrigin: `${v.x}px ${v.y}px` }}
              >
                <text
                  x={v.x}
                  y={v.y + 3}
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="var(--font-fira-code), monospace"
                  fill={MODALITIES[i].color}
                  fillOpacity={active ? 1 : 0.55}
                >
                  {MODALITIES[i].label}
                </text>
              </motion.g>
            </g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}

/* ---------------- #5 JuRAG: citation graph bloom ---------------- */

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
      className="absolute bottom-16 right-5 z-[1] pointer-events-none hidden lg:block"
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
              pathLength: 1,
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

/* ---------------- #6 SWIM: satellite pass ---------------- */

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
            {/* scan trail */}
            <div
              className="absolute right-2 top-1/2 h-[2px] w-24"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(16,185,129,0.55))",
                transform: "rotate(27.5deg)",
                transformOrigin: "right center",
              }}
            />
            {/* satellite: body + solar panels */}
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

/* ---------------- dispatcher ---------------- */

const EFFECTS: Record<string, React.ComponentType<EffectProps>> = {
  haftung: YoloOverlay,
  autobahn: LidarSweep,
  cmsci: CoherenceTriangle,
  jurag: CitationGraph,
  swim: SatellitePass,
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
