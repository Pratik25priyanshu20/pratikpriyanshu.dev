"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const W = 720;
const H = 56;
const WIRE_Y = 28;

// gate x-positions along the wire
const GATE_H = 150;
const GATE_CNOT_CTRL = 300;
const GATE_RY = 440;
const GATE_MEASURE = 600;

export default function QuantumDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  const gateDelay = (i: number) => 0.5 + i * 0.55;

  return (
    <div
      ref={ref}
      className="max-w-3xl mx-auto px-6 py-2 select-none"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-14 opacity-70"
        fill="none"
      >
        {/* wire */}
        <motion.line
          x1="0"
          y1={WIRE_Y}
          x2={W}
          y2={WIRE_Y}
          stroke="#8b5cf6"
          strokeOpacity="0.35"
          strokeWidth="1"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* |ψ⟩ state label */}
        <motion.text
          x="24"
          y={WIRE_Y + 4}
          fontSize="12"
          fontFamily="var(--font-fira-code), monospace"
          fill="#8b5cf6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.8 } : undefined}
          transition={{ delay: 0.3 }}
        >
          |&#968;&#10217;
        </motion.text>

        {/* H gate */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: gateDelay(0), type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformOrigin: `${GATE_H}px ${WIRE_Y}px` }}
        >
          <rect
            x={GATE_H - 12}
            y={WIRE_Y - 12}
            width="24"
            height="24"
            rx="4"
            fill="#111111"
            stroke="#8b5cf6"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          <text
            x={GATE_H}
            y={WIRE_Y + 4.5}
            textAnchor="middle"
            fontSize="12"
            fontFamily="var(--font-fira-code), monospace"
            fill="#8b5cf6"
          >
            H
          </text>
          {animate && (
            <motion.rect
              x={GATE_H - 12}
              y={WIRE_Y - 12}
              width="24"
              height="24"
              rx="4"
              stroke="#8b5cf6"
              strokeWidth="1"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0], scale: [1, 1.5, 1.8] }}
              transition={{ delay: gateDelay(0) + 0.15, duration: 0.9 }}
              style={{ transformOrigin: `${GATE_H}px ${WIRE_Y}px` }}
            />
          )}
        </motion.g>

        {/* CNOT control+target (the gate that "does nothing" — HNEP finding) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: gateDelay(1), type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformOrigin: `${GATE_CNOT_CTRL}px ${WIRE_Y}px` }}
        >
          <circle cx={GATE_CNOT_CTRL} cy={WIRE_Y} r="3.5" fill="#8b5cf6" fillOpacity="0.8" />
          <circle
            cx={GATE_CNOT_CTRL + 26}
            cy={WIRE_Y}
            r="8"
            stroke="#8b5cf6"
            strokeOpacity="0.7"
            strokeWidth="1.2"
            fill="none"
          />
          <line
            x1={GATE_CNOT_CTRL + 26}
            y1={WIRE_Y - 8}
            x2={GATE_CNOT_CTRL + 26}
            y2={WIRE_Y + 8}
            stroke="#8b5cf6"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          <line
            x1={GATE_CNOT_CTRL}
            y1={WIRE_Y}
            x2={GATE_CNOT_CTRL + 26}
            y2={WIRE_Y}
            stroke="#8b5cf6"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          {/* Δ = 0.000 whisper — the entanglement-does-nothing finding */}
          <motion.text
            x={GATE_CNOT_CTRL + 13}
            y={WIRE_Y - 15}
            textAnchor="middle"
            fontSize="8"
            fontFamily="var(--font-fira-code), monospace"
            fill="#666666"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.9 } : undefined}
            transition={{ delay: gateDelay(1) + 0.4 }}
          >
            &#916; = 0.000
          </motion.text>
        </motion.g>

        {/* RY gate */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: gateDelay(2), type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformOrigin: `${GATE_RY}px ${WIRE_Y}px` }}
        >
          <rect
            x={GATE_RY - 15}
            y={WIRE_Y - 12}
            width="30"
            height="24"
            rx="4"
            fill="#111111"
            stroke="#8b5cf6"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          <text
            x={GATE_RY}
            y={WIRE_Y + 4}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-fira-code), monospace"
            fill="#8b5cf6"
          >
            RY
          </text>
        </motion.g>

        {/* measurement */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: gateDelay(3), type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformOrigin: `${GATE_MEASURE}px ${WIRE_Y}px` }}
        >
          <rect
            x={GATE_MEASURE - 15}
            y={WIRE_Y - 12}
            width="30"
            height="24"
            rx="4"
            fill="#111111"
            stroke="#06b6d4"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          {/* measurement dial */}
          <path
            d={`M ${GATE_MEASURE - 8} ${WIRE_Y + 5} A 8 8 0 0 1 ${GATE_MEASURE + 8} ${WIRE_Y + 5}`}
            stroke="#06b6d4"
            strokeOpacity="0.8"
            strokeWidth="1.2"
          />
          <motion.line
            x1={GATE_MEASURE}
            y1={WIRE_Y + 5}
            x2={GATE_MEASURE + 5}
            y2={WIRE_Y - 4}
            stroke="#06b6d4"
            strokeWidth="1.2"
            initial={{ rotate: -40 }}
            animate={animate ? { rotate: [-40, 25, -10, 15, 0] } : undefined}
            transition={{ delay: gateDelay(3) + 0.3, duration: 1.1 }}
            style={{ transformOrigin: `${GATE_MEASURE}px ${WIRE_Y + 5}px` }}
          />
        </motion.g>

        {/* collapsed result */}
        <motion.text
          x={GATE_MEASURE + 45}
          y={WIRE_Y + 4}
          fontSize="12"
          fontFamily="var(--font-fira-code), monospace"
          fill="#06b6d4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.9 } : undefined}
          transition={{ delay: gateDelay(3) + 1.2 }}
        >
          |1&#10217;
        </motion.text>
      </svg>
    </div>
  );
}
