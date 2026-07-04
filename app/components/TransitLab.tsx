"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
 * A real (simplified) version of the ExoVeil pipeline:
 *   1. synthetic flux = stellar variability + photometric noise + limb-darkened transit
 *   2. a robust baseline model predicts what the star *should* look like
 *      (rolling median — a stand-in for the Transformer world model)
 *   3. a matched filter searches the residuals for transit-shaped dips
 * Toggle the world model off to watch stellar variability fool the detector.
 */

const N = 240;
const TRANSIT_DURATION = 14; // data points
const TEMPLATE_WIDTHS = [8, 11, 14, 18];
const THRESHOLD = 4.0;
const MEDIAN_WINDOW = 41; // wider than the transit, so the median keeps the dip

const PLOT_W = 640;
const PLOT_H = 170;
const PAD_X = 8;

const CADENCES = [
  { id: "kepler", label: "Kepler 30 min", bin: 1 },
  { id: "tess", label: "TESS 2 min", bin: 15 },
  { id: "plato", label: "PLATO 25 s", bin: 72 },
] as const;

type CadenceId = (typeof CADENCES)[number]["id"];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rollingMedian(arr: number[], win: number): number[] {
  const half = Math.floor(win / 2);
  const out = new Array<number>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const lo = Math.max(0, i - half);
    const hi = Math.min(arr.length, i + half + 1);
    const w = arr.slice(lo, hi).sort((a, b) => a - b);
    out[i] = w[Math.floor(w.length / 2)];
  }
  return out;
}

interface LabResult {
  fluxPts: string;
  baselinePts: string;
  snr: number;
  detected: boolean;
  locatedCorrectly: boolean;
  trueStart: number;
  bestStart: number;
  bestWidth: number;
  effNoisePpm: number;
  yFor: (f: number) => number;
}

function runDetector(
  depthPpm: number,
  noisePpm: number,
  variabilityPpm: number,
  cadence: CadenceId,
  detrend: boolean,
  seed: number
): LabResult {
  const rand = mulberry32(seed);
  const gauss = () => {
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const depth = depthPpm / 1e6;
  const bin = CADENCES.find((c) => c.id === cadence)!.bin;
  // binning more exposures per point beats down white noise by sqrt(n)…
  const sigma = noisePpm / 1e6 / Math.sqrt(bin);
  // …but stellar variability is astrophysical signal: binning does not remove it
  const amp = variabilityPpm / 1e6;

  const trueStart = Math.floor(N * 0.3 + rand() * N * 0.4);
  const phi1 = rand() * Math.PI * 2;
  const phi2 = rand() * Math.PI * 2;
  const phi3 = rand() * Math.PI * 2;

  const flux: number[] = new Array(N);
  for (let i = 0; i < N; i++) {
    // stellar variability: superposed spot-modulation sinusoids
    const stellar =
      amp *
      (0.55 * Math.sin((2 * Math.PI * i) / 97 + phi1) +
        0.35 * Math.sin((2 * Math.PI * i) / 53 + phi2) +
        0.25 * Math.sin((2 * Math.PI * i) / 151 + phi3));

    let f = 1 + stellar + gauss() * sigma;

    // limb-darkened transit: rounded bottom, steep ingress/egress
    const z = Math.abs(i - (trueStart + TRANSIT_DURATION / 2)) / (TRANSIT_DURATION / 2);
    if (z < 1) f -= depth * Math.sqrt(Math.max(0, 1 - z ** 4));

    flux[i] = f;
  }

  // baseline: the "world model" prediction of quiescent behaviour
  const globalMedian = [...flux].sort((a, b) => a - b)[Math.floor(N / 2)];
  const baseline = detrend
    ? rollingMedian(flux, MEDIAN_WINDOW)
    : new Array<number>(N).fill(globalMedian);

  const r = flux.map((f, i) => f - baseline[i]);

  // robust noise estimate via MAD on residuals
  const absDev = r.map((x) => Math.abs(x)).sort((a, b) => a - b);
  const mad = absDev[Math.floor(N / 2)] * 1.4826 || 1e-9;

  // matched filter
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

  // auto-scale the plot to the data
  let fmin = Infinity;
  let fmax = -Infinity;
  for (const f of flux) {
    if (f < fmin) fmin = f;
    if (f > fmax) fmax = f;
  }
  const span = Math.max(fmax - fmin, 1e-6);
  const yFor = (f: number) =>
    14 + (1 - (f - fmin) / span) * (PLOT_H - 42);

  const step = (PLOT_W - 2 * PAD_X) / (N - 1);
  const toPts = (arr: number[]) =>
    arr
      .map((f, i) => `${(PAD_X + i * step).toFixed(1)},${yFor(f).toFixed(1)}`)
      .join(" ");

  return {
    fluxPts: toPts(flux),
    baselinePts: toPts(baseline),
    snr: best,
    detected,
    locatedCorrectly,
    trueStart,
    bestStart,
    bestWidth,
    effNoisePpm: Math.round(sigma * 1e6),
    yFor,
  };
}

export default function TransitLab() {
  const [open, setOpen] = useState(false);
  const [depthPpm, setDepthPpm] = useState(1000);
  const [noisePpm, setNoisePpm] = useState(400);
  const [variabilityPpm, setVariabilityPpm] = useState(800);
  const [cadence, setCadence] = useState<CadenceId>("kepler");
  const [detrend, setDetrend] = useState(true);
  const [seed, setSeed] = useState(42);
  const [log, setLog] = useState({ hits: 0, runs: 0 });

  const result = useMemo(
    () => runDetector(depthPpm, noisePpm, variabilityPpm, cadence, detrend, seed),
    [depthPpm, noisePpm, variabilityPpm, cadence, detrend, seed]
  );

  const step = (PLOT_W - 2 * PAD_X) / (N - 1);
  const found = result.detected && result.locatedCorrectly;
  const falsePositive = result.detected && !result.locatedCorrectly;

  const newNoise = () => {
    const nextSeed = seed + 1;
    const r = runDetector(depthPpm, noisePpm, variabilityPpm, cadence, detrend, nextSeed);
    setLog((l) => ({
      hits: l.hits + (r.detected && r.locatedCorrectly ? 1 : 0),
      runs: l.runs + 1,
    }));
    setSeed(nextSeed);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-normal transition-colors duration-200 group/lab"
        aria-expanded={open}
      >
        <span className="text-accent-yellow/90 group-hover/lab:underline">
          &#128301; Try the detector — inject a transit, see if it survives a real star
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
                aria-label="Synthetic light curve with stellar variability and injected transit"
              >
                {/* true transit window */}
                <rect
                  x={PAD_X + result.trueStart * step}
                  y="6"
                  width={TRANSIT_DURATION * step}
                  height={PLOT_H - 24}
                  fill="#facc15"
                  fillOpacity="0.05"
                  stroke="#facc15"
                  strokeOpacity="0.25"
                  strokeDasharray="3 4"
                  strokeWidth="0.8"
                />
                <text
                  x={PAD_X + (result.trueStart + TRANSIT_DURATION / 2) * step}
                  y={PLOT_H - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="var(--font-fira-code), monospace"
                  fill="#facc15"
                  fillOpacity="0.6"
                >
                  injected here
                </text>

                {/* world model prediction */}
                {detrend && (
                  <polyline
                    points={result.baselinePts}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeOpacity="0.8"
                    strokeWidth="1.2"
                    strokeDasharray="5 4"
                  />
                )}

                {/* observed flux */}
                <polyline
                  points={result.fluxPts}
                  fill="none"
                  stroke="#60a5fa"
                  strokeOpacity="0.85"
                  strokeWidth="1"
                />

                {/* detection marker */}
                {result.detected && (
                  <g>
                    <rect
                      x={PAD_X + result.bestStart * step}
                      y="6"
                      width={result.bestWidth * step}
                      height={PLOT_H - 24}
                      fill="none"
                      stroke={falsePositive ? "#ef4444" : "#4ade80"}
                      strokeWidth="1.2"
                      rx="2"
                    />
                    <text
                      x={PAD_X + (result.bestStart + result.bestWidth / 2) * step}
                      y="16"
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="var(--font-fira-code), monospace"
                      fill={falsePositive ? "#ef4444" : "#4ade80"}
                    >
                      {falsePositive ? "false alarm" : "detected"}
                    </text>
                  </g>
                )}

                {/* legend */}
                <g fontSize="8.5" fontFamily="var(--font-fira-code), monospace">
                  <line x1={PAD_X + 4} y1="10" x2={PAD_X + 20} y2="10" stroke="#60a5fa" strokeWidth="1.2" />
                  <text x={PAD_X + 24} y="13" fill="#60a5fa" fillOpacity="0.9">observed flux</text>
                  {detrend && (
                    <>
                      <line x1={PAD_X + 104} y1="10" x2={PAD_X + 120} y2="10" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="4 3" />
                      <text x={PAD_X + 124} y="13" fill="#8b5cf6" fillOpacity="0.9">world model prediction</text>
                    </>
                  )}
                </g>
              </svg>

              {/* world model toggle + cadence */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                <button
                  onClick={() => setDetrend(!detrend)}
                  className="flex items-center gap-2 text-xs font-mono"
                  aria-pressed={detrend}
                >
                  <span
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                      detrend ? "bg-[#8b5cf6]" : "bg-border-light"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                        detrend ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </span>
                  <span className={detrend ? "text-[#a78bfa]" : "text-text-muted"}>
                    world-model detrending {detrend ? "ON" : "OFF"}
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  {CADENCES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCadence(c.id)}
                      className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border transition-all duration-200 ${
                        cadence === c.id
                          ? "border-accent-yellow/50 text-accent-yellow bg-accent-yellow/10"
                          : "border-border text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* sliders */}
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <label className="block">
                  <span className="text-xs font-mono text-text-secondary">
                    transit depth:{" "}
                    <span className="text-accent-yellow">{depthPpm.toLocaleString()} ppm</span>
                    {depthPpm <= 100 && (
                      <span className="text-text-muted"> (Earth: 84)</span>
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
                    photon noise:{" "}
                    <span className="text-accent-blue-light">{noisePpm} ppm</span>
                    <span className="text-text-muted"> → {result.effNoisePpm} binned</span>
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
                <label className="block">
                  <span className="text-xs font-mono text-text-secondary">
                    stellar variability:{" "}
                    <span className="text-[#a78bfa]">{variabilityPpm} ppm</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={variabilityPpm}
                    onChange={(e) => setVariabilityPpm(Number(e.target.value))}
                    className="w-full mt-1 accent-[#8b5cf6]"
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
                    : falsePositive
                      ? "✗ FALSE POSITIVE (variability fooled the filter)"
                      : "✗ NOT DETECTED"}
                </span>
                <span className="text-text-secondary">
                  SNR:{" "}
                  <span className={found ? "text-[#4ade80]" : "text-text-primary"}>
                    {result.snr.toFixed(1)}
                  </span>
                  <span className="text-text-muted"> / {THRESHOLD.toFixed(1)}</span>
                </span>
                <button
                  onClick={newNoise}
                  className="px-2.5 py-1 rounded-md border border-border-light text-text-secondary hover:text-text-primary hover:border-accent-yellow/40 transition-colors"
                >
                  &#8635; new star
                </button>
                {log.runs > 0 && (
                  <span className="text-text-muted">
                    log: {log.hits}/{log.runs} recovered
                  </span>
                )}
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-text-muted font-mono">
                {!detrend && variabilityPpm > 400
                  ? "The matched filter is being fooled by starspots — this is exactly why ExoVeil learns each star's behaviour first. Flip the world model on."
                  : "Try: Earth depth (84 ppm) at Kepler cadence — impossible. Switch to PLATO 25 s and watch binning pull it out of the noise. That's the paper's closing result."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
