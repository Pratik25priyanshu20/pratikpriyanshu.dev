"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { skillCategories } from "@/lib/skills";

const W = 900;
const H = 540;

const CLUSTER_CENTERS: [number, number][] = [
  [150, 115], // Languages
  [450, 85], // ML Frameworks
  [755, 120], // Deep Learning
  [140, 305], // LLM & Agents
  [455, 265], // MLOps & Infra
  [765, 305], // Data & Databases
  [240, 455], // Cloud & Compute
  [530, 440], // Quantum Computing
  [790, 465], // Tools & Practices
];

const CAT_COLORS = [
  "#60a5fa",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#a855f7",
  "#facc15",
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface StarPoint {
  x: number;
  y: number;
  r: number;
  name: string;
}

function useConstellations() {
  return useMemo(() => {
    const rand = mulberry32(19770815);
    return skillCategories.map((cat, ci) => {
      const [cx, cy] = CLUSTER_CENTERS[ci % CLUSTER_CENTERS.length];
      const stars: StarPoint[] = cat.skills.map((skill, si) => {
        // spread skills around the cluster center on a rough ring + jitter
        const angle =
          (si / cat.skills.length) * Math.PI * 2 + rand() * 0.9 - 0.45;
        const radius = 34 + rand() * 46;
        return {
          x: cx + Math.cos(angle) * radius * 1.25,
          y: cy + Math.sin(angle) * radius * 0.85,
          r: 1.6 + rand() * 1.8,
          name: skill.name,
        };
      });
      return { title: cat.title, emoji: cat.emoji, color: CAT_COLORS[ci], stars };
    });
  }, []);
}

export default function SkillConstellation() {
  const constellations = useConstellations();
  const [active, setActive] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="hidden lg:block">
      <div className="relative rounded-2xl border border-border/50 bg-surface/30 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" fill="none">
          {constellations.map((c) => {
            const isActive = active === c.title;
            const dimmed = active !== null && !isActive;
            return (
              <g
                key={c.title}
                onMouseEnter={() => setActive(c.title)}
                onMouseLeave={() => setActive(null)}
                style={{
                  cursor: "default",
                  opacity: dimmed ? 0.25 : 1,
                  transition: "opacity 0.4s",
                }}
              >
                {/* invisible hover hitbox around cluster */}
                <circle
                  cx={c.stars.reduce((s, p) => s + p.x, 0) / c.stars.length}
                  cy={c.stars.reduce((s, p) => s + p.y, 0) / c.stars.length}
                  r="95"
                  fill="transparent"
                />

                {/* constellation lines */}
                {c.stars.slice(1).map((s, i) => (
                  <motion.line
                    key={i}
                    x1={c.stars[i].x}
                    y1={c.stars[i].y}
                    x2={s.x}
                    y2={s.y}
                    stroke={c.color}
                    strokeWidth="0.8"
                    initial={false}
                    animate={{
                      strokeOpacity: isActive ? 0.75 : 0.12,
                      pathLength: isActive || prefersReducedMotion ? 1 : 1,
                    }}
                    transition={{ duration: 0.35, delay: isActive ? i * 0.07 : 0 }}
                  />
                ))}

                {/* stars */}
                {c.stars.map((s) => (
                  <g key={s.name}>
                    {isActive && (
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r={s.r * 3}
                        fill={c.color}
                        fillOpacity="0.12"
                      />
                    )}
                    <motion.circle
                      cx={s.x}
                      cy={s.y}
                      r={s.r}
                      fill={isActive ? c.color : "#ffffff"}
                      initial={false}
                      animate={{ fillOpacity: isActive ? 1 : 0.55 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.text
                      x={s.x}
                      y={s.y - s.r - 5}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="var(--font-fira-code), monospace"
                      fill={c.color}
                      initial={false}
                      animate={{ opacity: isActive ? 0.95 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {s.name}
                    </motion.text>
                  </g>
                ))}

                {/* constellation name */}
                <motion.text
                  x={c.stars.reduce((s, p) => s + p.x, 0) / c.stars.length}
                  y={c.stars.reduce((s, p) => s + p.y, 0) / c.stars.length + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="var(--font-space-grotesk), sans-serif"
                  fontWeight="600"
                  fill={c.color}
                  initial={false}
                  animate={{ opacity: isActive ? 0 : 0.4 }}
                  transition={{ duration: 0.3 }}
                  style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                  {c.title}
                </motion.text>
              </g>
            );
          })}
        </svg>

        {/* corner annotation, sky-atlas style */}
        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-text-muted/60">
          skill atlas &middot; epoch 2026.5 &middot; hover to resolve
        </div>
      </div>

      {/* legend */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 justify-center">
        {constellations.map((c) => (
          <button
            key={c.title}
            onMouseEnter={() => setActive(c.title)}
            onMouseLeave={() => setActive(null)}
            className="flex items-center gap-1.5 text-xs transition-opacity duration-200"
            style={{
              color: c.color,
              opacity: active === null || active === c.title ? 0.85 : 0.3,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            {c.title}
          </button>
        ))}
      </div>
    </div>
  );
}
