"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// First numeric token in the string, e.g. "0.938", "251,038", "95.9"
const NUM_RE = /([0-9][0-9,]*(?:\.[0-9]+)?)/;

function formatNumber(n: number, decimals: number, useCommas: boolean) {
  if (useCommas) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return n.toFixed(decimals);
}

export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();

  const match = value.match(NUM_RE);
  const target = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  const decimals = match && match[1].includes(".")
    ? match[1].split(".")[1].length
    : 0;
  const useCommas = match ? match[1].includes(",") : false;

  const [display, setDisplay] = useState(() =>
    match ? formatNumber(0, decimals, useCommas) : value
  );

  useEffect(() => {
    if (!match) return;
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplay(match[1]);
      return;
    }

    const DURATION = 1300;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(formatNumber(target * eased, decimals, useCommas));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(match[1]);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, prefersReducedMotion]);

  if (!match) {
    return <span ref={ref}>{value}</span>;
  }

  const prefix = value.slice(0, match.index);
  const suffix = value.slice((match.index ?? 0) + match[1].length);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
