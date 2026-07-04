"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
 * A real (simplified) matched-filter transit detector, the same idea ExoVeil
 * uses: inject a box transit into noisy flux, slide zero-mean box templates
 * across the residuals, and ask whether the peak response clears 4 sigma.
 */

const N = 240;
const TRANSIT_DURATION = 14; // data points
const TEMPLATE_WIDTHS = [8, 11, 14, 18];
const THRESHOLD = 4.0;

const PLOT_W = 640;
const PLOT_H = 150;
const PAD_X = 8;
const PLOT_BASE = 55;
const FLUX_SCALE = 26000; // px per unit relative flux

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface LabResult {
  points: string;
  snr: number;
  detected: boolean;
  locatedCorrectly: boolean;
  trueStart: number;
  bestStart: number;
  bestWidth: number;
  expectedSnr: number;
}

function runDetector(depthPpm: number, noisePpm: number, seed: number): LabResult {
  const rand = mulberry32(seed);
  const gauss = () => {
    // Box-Muller
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const depth = depthPpm / 1e6;
  const sigma = noisePpm / 1e6;
  const trueStart = Math.floor(N * 0.35 + rand() * N * 0.3);

  // synthetic flux
  const flux: number[] = new Array(N);
  for (let i = 0; i < N; i++) {
    let f = 1 + gauss() * sigma;
    if (i >= trueStart && i < trueStart + TRANSIT_DURATION) f -= depth;
    flux[i] = f;
  }

  // residuals about the median
  const sorted = [...flux].sort((a, b) => a - b);
  const median = sorted[Math.floor(N / 2)];
  const r = flux.map((f) => f - median);

  // robust noise estimate via MAD
  const absDev = r.map((x) => Math.abs(x)).sort((a, b) => a - b);
  const mad = absDev[Math.floor(N / 2)] * 1.4826 || 1e-9;

  // matched filter: zero-mean box templates, max response over widths/positions
  let best = 0;
  let bestStart = 0;
  let bestWidth = TEMPLATE_WIDTHS[0];
  for (const w of TEMPLATE_WIDTHS) {
    let windowSum = 0;
    for (let i = 0; i < w; i++) windowSum += r[i];
    for (let i = 0; i + w <= N; i++) {
      if (i > 0) windowSum += r[i + w - 1] - r[i - 1];
      const stat = -windowSum / (mad * Math.sqrt(w));
      if (stat > best) {
        best = stat;
        bestStart = i;
        bestWidth = w;
      }
    }
  }

  const detected = best >= THRESHOLD;
  const locatedCorrectly =
    Math.abs(bestStart + bestWidth / 2 - (trueStart + TRANSIT_DURATION / 2)) <
    TRANSIT_DURATION;

  // theoretical expectation: SNR ~ depth * sqrt(n_transit) / sigma
  const expectedSnr = (depth * Math.sqrt(TRANSIT_DURATION)) / sigma;

  const step = (PLOT_W - 2 * PAD_X) / (N - 1);
  const points = flux
    .map((f, i) => {
      const x = PAD_X + i * step;
      const y = PLOT_BASE - (f - 1) * FLUX_SCALE;
      return `${x.toFixed(1)},${Math.max(4, Math.min(PLOT_H - 4, y)).toFixed(1)}`;
    })
    .join(" ");

  return { points, snr: best, detected, locatedCorrectly, trueStart, bestStart, bestWidth, expectedSnr };
}

export default function TransitLab() {
  const [open, setOpen] = useState(false);
  const [depthPpm, setDepthPpm] = useState(2000);
  const [noisePpm, setNoisePpm] = useState(400);
  const [seed, setSeed] = useState(42);

  const result = useMemo(
    () => runDetector(depthPpm, noisePpm, seed),
    [depthPpm, noisePpm, seed]
  );

  const step = (PLOT_W - 2 * PAD_X) / (N - 1);
  const found = result.detected && result.locatedCorrectly;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-normal transition-colors duration-200 group/lab"
        aria-expanded={open}
      >
        <span className="text-accent-yellow/90 group-hover/lab:underline">
          &#128301; Try the detector — inject a transit, see if it survives the noise
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-accent-yellow/70 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-accent-yellow/20 bg-surface-light/30 p-4">
              {/* light curve plot */}
              <svg
                viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
                className="w-full h-auto"
                aria-label="Synthetic light curve with injected transit"
              >
                {/* true transit window */}
                <rect
                  x={PAD_X + result.trueStart * step}
                  y="8"
                  width={TRANSIT_DURATION * step}
                  height={PLOT_H - 16}
                  fill="#facc15"
                  fillOpacity="0.05"
                  stroke="#facc15"
                  strokeOpacity="0.25"
                  strokeDasharray="3 4"
                  strokeWidth="0.8"
                />
                <text
                  x={PAD_X + (result.trueStart + TRANSIT_DURATION / 2) * step}
                  y={PLOT_H - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="var(--font-fira-code), monospace"
                  fill="#facc15"
                  fillOpacity="0.6"
                >
                  injected here
                </text>

                {/* flux */}
                <polyline
                  points={result.points}
                  fill="none"
                  stroke="#60a5fa"
                  strokeOpacity="0.8"
                  strokeWidth="1"
                />

                {/* detection marker */}
                {found && (
                  <g>
                    <rect
                      x={PAD_X + result.bestStart * step}
                      y="8"
                      width={result.bestWidth * step}
                      height={PLOT_H - 16}
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="1.2"
                      rx="2"
                    />
                    <text
                      x={PAD_X + (result.bestStart + result.bestWidth / 2) * step}
                      y="18"
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="var(--font-fira-code), monospace"
                      fill="#4ade80"
                    >
                      detected
                    </text>
                  </g>
                )}
              </svg>

              {/* controls */}
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <label className="block">
                  <span className="text-xs font-mono text-text-secondary">
                    transit depth:{" "}
                    <span className="text-accent-yellow">{depthPpm.toLocaleString()} ppm</span>
                    {depthPpm <= 100 && (
                      <span className="text-text-muted"> (Earth-analog: 84 ppm)</span>
                    )}
                  </span>
                  <input
                    type="range"
                    min="50"
                    max="10000"
                    step="50"
                    value={depthPpm}
                    onChange={(e) => setDepthPpm(Number(e.target.value))}
                    className="w-full mt-1 accent-[#facc15]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-text-secondary">
                    photometric noise:{" "}
                    <span className="text-accent-blue-light">{noisePpm} ppm</span>
                  </span>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={noisePpm}
                    onChange={(e) => setNoisePpm(Number(e.target.value))}
                    className="w-full mt-1 accent-[#60a5fa]"
                  />
                </label>
              </div>

              {/* verdict */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs font-mono">
                <span
                  className={`px-2.5 py-1 rounded-full font-semibold ${
                    found
                      ? "bg-[#4ade80]/15 text-[#4ade80]"
                      : "bg-[#ef4444]/15 text-[#ef4444]"
                  }`}
                >
                  {found
                    ? "✓ DETECTED"
                    : result.detected
                      ? "✗ FALSE POSITIVE (wrong location)"
                      : "✗ NOT DETECTED"}
                </span>
                <span className="text-text-secondary">
                  matched-filter SNR:{" "}
                  <span className={found ? "text-[#4ade80]" : "text-text-primary"}>
                    {result.snr.toFixed(1)}
                  </span>
                  <span className="text-text-muted"> (threshold {THRESHOLD.toFixed(1)})</span>
                </span>
                <button
                  onClick={() => setSeed((s) => s + 1)}
                  className="px-2.5 py-1 rounded-md border border-border-light text-text-secondary hover:text-text-primary hover:border-accent-yellow/40 transition-colors"
                >
                  &#8635; new noise
                </button>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-text-muted font-mono">
                SNR &#8776; depth &middot; &#8730;n<sub>transit</sub> / &#963; ={" "}
                {result.expectedSnr.toFixed(1)} expected. Drag depth to 84 ppm to
                see why Earth analogs are hard — and why PLATO&apos;s 25-second
                cadence (more points in transit) changes the game.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
