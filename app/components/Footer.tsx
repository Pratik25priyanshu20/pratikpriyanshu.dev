"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/exoplanets")
      .then((r) => r.json())
      .then((d: { count: number | null }) => setCount(d.count))
      .catch(() => setCount(null));
  }, []);

  return (
    <footer className="py-10 text-center" aria-label="Footer">
      <div className="section-container space-y-2">
        <p className="text-xs font-mono text-text-muted">
          {count !== null ? (
            <>
              <span className="text-accent-yellow">
                {count.toLocaleString("en-US")}
              </span>{" "}
              confirmed exoplanets as of tonight
              <span className="text-text-muted/60">
                {" "}
                &middot; NASA Exoplanet Archive
              </span>
            </>
          ) : (
            <>Somewhere out there, a star just dimmed.</>
          )}
        </p>
        <p className="text-xs text-text-muted/60">
          &copy; {new Date().getFullYear()} Pratik Priyanshu
        </p>
      </div>
    </footer>
  );
}
