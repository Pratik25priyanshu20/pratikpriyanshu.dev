"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  driftX: number;
  driftY: number;
  depth: number;
  ox: number; // black-hole displacement
  oy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const cometsRef = useRef<Comet[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const nextShootingStarRef = useRef(0);
  const nextCometRef = useRef(0);
  const konamiUntilRef = useRef(0);
  const konamiProgressRef = useRef(0);
  const pulsarIdxRef = useRef(-1);
  const binaryIdxRef = useRef(-1);
  const supernovaRef = useRef({ idx: -1, start: 0 });
  const nextSupernovaRef = useRef(0);
  const blackHoleRef = useRef({ x: 0, y: 0, until: 0, held: false, strength: 0 });
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const count = isMobile ? 45 : 85;

    particlesRef.current = Array.from({ length: count }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const depth = Math.random() * 0.85 + 0.15; // 0.15 (far) — 1.0 (near)
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size: (Math.random() * 2 + 0.5) * (0.5 + depth * 0.5),
        opacity: (Math.random() * 0.5 + 0.15) * (0.4 + depth * 0.6),
        speed: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.3,
        driftY: (Math.random() - 0.5) * 0.3,
        depth,
        ox: 0,
        oy: 0,
      };
    });

    // pulsar: a star in the upper part of the field
    const upper = particlesRef.current
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.baseY < height * 0.4);
    pulsarIdxRef.current = upper.length
      ? upper[Math.floor(Math.random() * upper.length)].i
      : -1;

    // binary system: a star in the lower part, distinct from the pulsar
    const lower = particlesRef.current
      .map((p, i) => ({ p, i }))
      .filter(({ p }, ) => p.baseY > height * 0.5);
    const binaryPick = lower.length
      ? lower[Math.floor(Math.random() * lower.length)].i
      : -1;
    binaryIdxRef.current = binaryPick === pulsarIdxRef.current ? -1 : binaryPick;
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Black hole: hold mouse down on empty background to collapse spacetime
    const handleMouseDown = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "button, a, input, textarea, select, article, nav, svg, form, [role='dialog'], p, h1, h2, h3, h4, li, img"
        )
      ) {
        return;
      }
      holdTimerRef.current = setTimeout(() => {
        blackHoleRef.current.x = mouseRef.current.x;
        blackHoleRef.current.y = mouseRef.current.y;
        blackHoleRef.current.held = true;
      }, 650);
    };
    const handleMouseUp = () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      blackHoleRef.current.held = false;
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // terminal-summoned black hole
    const handleSpawnBlackHole = () => {
      if (prefersReducedMotion) return;
      blackHoleRef.current.x = canvas.width / 2;
      blackHoleRef.current.y = canvas.height * 0.45;
      blackHoleRef.current.until = performance.now() + 7000;
    };
    window.addEventListener("spawn-blackhole", handleSpawnBlackHole);

    const KONAMI = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    const handleKonami = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[konamiProgressRef.current]) {
        konamiProgressRef.current++;
        if (konamiProgressRef.current === KONAMI.length) {
          konamiProgressRef.current = 0;
          konamiUntilRef.current = performance.now() + 7000;
          // eslint-disable-next-line no-console
          console.log(
            "%c⟡ every star is a planet, if you look long enough",
            "color:#facc15;font-style:italic"
          );
        }
      } else {
        konamiProgressRef.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handleKonami);

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let time = 0;
    const CONNECTION_DIST = 130;
    const CURSOR_RADIUS = 180;
    const CURSOR_CONNECT_RADIUS = 220;
    const BH_RADIUS = 480;
    const BH_CORE = 13;

    const animate = () => {
      if (!isVisibleRef.current || !ctx || !canvas) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;
      const now = performance.now();

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // black hole strength ramps in/out
      const bh = blackHoleRef.current;
      const bhActive = bh.held || now < bh.until;
      bh.strength += ((bhActive ? 1 : 0) - bh.strength) * 0.06;
      const bhOn = bh.strength > 0.01;

      // Update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Organic drift with sine/cosine
          p.x = p.baseX
            + Math.sin(time * p.speed + p.phase) * 40
            + Math.cos(time * p.speed * 0.6 + p.phase * 1.3) * 20;
          p.y = p.baseY
            + Math.cos(time * p.speed * 0.8 + p.phase) * 30
            + Math.sin(time * p.speed * 0.5 + p.phase * 0.7) * 15;

          // Depth-based scroll parallax: near stars drift up faster than far ones
          const parallax = scrollRef.current * p.depth * 0.12;
          p.y = ((p.y - parallax) % canvas.height + canvas.height) % canvas.height;

          // Slow linear drift
          p.baseX += p.driftX * 0.05;
          p.baseY += p.driftY * 0.05;

          // Wrap around screen edges
          if (p.baseX < -50) p.baseX = canvas.width + 50;
          if (p.baseX > canvas.width + 50) p.baseX = -50;
          if (p.baseY < -50) p.baseY = canvas.height + 50;
          if (p.baseY > canvas.height + 50) p.baseY = -50;

          // Black hole gravity: radial pull + tangential swirl = accretion spiral
          if (bhOn) {
            const bdx = bh.x - (p.x + p.ox);
            const bdy = bh.y - (p.y + p.oy);
            const bdist = Math.sqrt(bdx * bdx + bdy * bdy) + 1;
            if (bdist < BH_RADIUS) {
              const g = Math.pow(1 - bdist / BH_RADIUS, 2) * bh.strength;
              const ux = bdx / bdist;
              const uy = bdy / bdist;
              // radial infall + perpendicular swirl
              p.ox += ux * g * 5.5 + -uy * g * 3.2;
              p.oy += uy * g * 5.5 + ux * g * 3.2;

              // consumed: respawn at a random edge
              if (bdist < BH_CORE + 6) {
                const edge = Math.floor(Math.random() * 4);
                p.baseX = edge === 0 ? -40 : edge === 1 ? canvas.width + 40 : Math.random() * canvas.width;
                p.baseY = edge === 2 ? -40 : edge === 3 ? canvas.height + 40 : Math.random() * canvas.height;
                p.ox = 0;
                p.oy = 0;
              }
            }
          } else {
            // spacetime relaxes
            p.ox *= 0.94;
            p.oy *= 0.94;
          }
          p.x += p.ox;
          p.y += p.oy;

          // Cursor repulsion — particles gently push away (suspended near a black hole)
          if (!bhOn) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CURSOR_RADIUS && dist > 0) {
              const force = (CURSOR_RADIUS - dist) / CURSOR_RADIUS;
              const angle = Math.atan2(dy, dx);
              p.x += Math.cos(angle) * force * 25;
              p.y += Math.sin(angle) * force * 25;
            }
          }
        }
      }

      // Draw connections between nearby particles
      if (!prefersReducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONNECTION_DIST) {
              const alpha = (1 - dist / CONNECTION_DIST) * 0.25;

              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const cursorDist = Math.sqrt(
                (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2
              );
              const cursorBoost = cursorDist < CURSOR_CONNECT_RADIUS
                ? (1 - cursorDist / CURSOR_CONNECT_RADIUS) * 0.5
                : 0;

              const finalAlpha = Math.min(alpha + cursorBoost, 0.6);

              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              if (cursorBoost > 0.1) {
                ctx.strokeStyle = `rgba(96, 165, 250, ${finalAlpha})`;
              } else {
                ctx.strokeStyle = `rgba(120, 140, 180, ${finalAlpha})`;
              }
              ctx.lineWidth = cursorBoost > 0.1 ? 0.8 : 0.4;
              ctx.stroke();
            }
          }
        }

        // Draw lines from cursor to nearby particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CURSOR_CONNECT_RADIUS) {
            const alpha = (1 - dist / CURSOR_CONNECT_RADIUS) * 0.3;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Supernova scheduling: rare, recurring
      if (!prefersReducedMotion) {
        if (nextSupernovaRef.current === 0) {
          nextSupernovaRef.current = now + 20000 + Math.random() * 40000;
        }
        if (
          supernovaRef.current.idx === -1 &&
          now > nextSupernovaRef.current &&
          particles.length > 0
        ) {
          supernovaRef.current = {
            idx: Math.floor(Math.random() * particles.length),
            start: now,
          };
        }
      }
      const sn = supernovaRef.current;
      const snT = sn.idx >= 0 ? (now - sn.start) / 4200 : 2;
      if (snT > 1 && sn.idx >= 0) {
        supernovaRef.current = { idx: -1, start: 0 };
        nextSupernovaRef.current = now + 60000 + Math.random() * 80000;
      }

      // Draw particles
      const konamiLeft = konamiUntilRef.current - now;
      const konami = konamiLeft > 0 ? Math.min(konamiLeft / 1500, 1) : 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const cursorDist = Math.sqrt(dx * dx + dy * dy);
        const cursorGlow = cursorDist < CURSOR_CONNECT_RADIUS
          ? (1 - cursorDist / CURSOR_CONNECT_RADIUS) * 0.6
          : 0;

        let finalOpacity = Math.min(p.opacity + cursorGlow, 1);
        let finalSize = p.size + cursorGlow * 1.5;

        // ---- binary system: two stars orbiting a common center ----
        if (i === binaryIdxRef.current && !prefersReducedMotion) {
          const orbitAngle = now / 900 + p.phase;
          const orbitR = 7;
          const ax = p.x + Math.cos(orbitAngle) * orbitR;
          const ay = p.y + Math.sin(orbitAngle) * orbitR * 0.55;
          const bx = p.x - Math.cos(orbitAngle) * orbitR;
          const by = p.y - Math.sin(orbitAngle) * orbitR * 0.55;

          ctx.beginPath();
          ctx.arc(ax, ay, 1.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${finalOpacity})`;
          ctx.fill();
          continue;
        }

        // ---- pulsar: metronome flash with lighthouse beams ----
        if (i === pulsarIdxRef.current && !prefersReducedMotion) {
          const pulse = Math.pow(
            Math.max(0, Math.sin((now / 1400) * Math.PI * 2)),
            10
          );
          finalOpacity = Math.min(p.opacity + pulse * 0.9, 1);
          finalSize = p.size + pulse * 1.6;

          if (pulse > 0.05) {
            const beamAngle = 0.9;
            const beamLen = 26 + pulse * 30;
            for (const dir of [1, -1]) {
              const ex = p.x + Math.cos(beamAngle) * beamLen * dir;
              const ey = p.y + Math.sin(beamAngle) * beamLen * dir;
              const grad = ctx.createLinearGradient(p.x, p.y, ex, ey);
              grad.addColorStop(0, `rgba(190, 225, 255, ${0.35 * pulse})`);
              grad.addColorStop(1, "rgba(190, 225, 255, 0)");
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(ex, ey);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // ---- supernova: flare, then expanding remnant ring ----
        if (i === sn.idx && snT <= 1) {
          if (snT < 0.25) {
            const f = snT / 0.25;
            const flare = 1 + f * 22;
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * flare * 2.2);
            grad.addColorStop(0, `rgba(255, 250, 235, ${0.95})`);
            grad.addColorStop(0.4, `rgba(255, 210, 150, ${0.5})`);
            grad.addColorStop(1, "rgba(255, 190, 120, 0)");
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * flare * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            finalSize = p.size * (1 + f * 5);
            finalOpacity = 1;
          } else {
            const f = (snT - 0.25) / 0.75;
            const ringR = f * 210;
            const ringAlpha = (1 - f) * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 200, 150, ${ringAlpha})`;
            ctx.lineWidth = 1.2 * (1 - f) + 0.3;
            ctx.stroke();
            // faint inner shockwave
            ctx.beginPath();
            ctx.arc(p.x, p.y, ringR * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(180, 210, 255, ${ringAlpha * 0.5})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            finalOpacity = p.opacity * (0.4 + 0.6 * f); // dims, then recovers
          }
        }

        // Konami: every star becomes a ringed planet
        if (konami > 0) {
          const ringAlpha = finalOpacity * 0.8 * konami;
          ctx.beginPath();
          ctx.ellipse(
            p.x,
            p.y,
            finalSize * 3.2,
            finalSize * 1.1,
            -0.45 + p.phase * 0.1,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(250, 204, 21, ${ringAlpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        // Soft glow near cursor
        if (cursorGlow > 0.15) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, finalSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${cursorGlow * 0.1})`;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
        if (konami > 0.1) {
          ctx.fillStyle = `rgba(250, 214, 100, ${finalOpacity})`;
        } else if (cursorGlow > 0.1) {
          ctx.fillStyle = `rgba(160, 200, 255, ${finalOpacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        }
        ctx.fill();
      }

      // ---- black hole rendering ----
      if (bhOn) {
        const s = bh.strength;

        // ambient glow
        const glow = ctx.createRadialGradient(bh.x, bh.y, BH_CORE, bh.x, bh.y, 90);
        glow.addColorStop(0, `rgba(251, 191, 36, ${0.22 * s})`);
        glow.addColorStop(0.5, `rgba(147, 100, 250, ${0.08 * s})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, 90, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // accretion disk: two rotating elliptical streams
        for (const [tilt, rx, ry, color, alpha] of [
          [time * 1.4, 34, 10, "251, 191, 36", 0.75],
          [time * 1.4 + 1.1, 26, 8, "96, 165, 250", 0.45],
        ] as const) {
          ctx.beginPath();
          ctx.ellipse(bh.x, bh.y, rx, ry, tilt % (Math.PI * 2), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color}, ${alpha * s})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }

        // event horizon
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, BH_CORE, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, s * 1.4)})`;
        ctx.fill();

        // photon ring
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, BH_CORE + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 235, 200, ${0.8 * s})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ---- comets: rare, slow, with curved dust tails ----
      if (!prefersReducedMotion) {
        if (nextCometRef.current === 0) {
          nextCometRef.current = now + 15000 + Math.random() * 25000;
        }
        if (now > nextCometRef.current) {
          const fromLeft = Math.random() > 0.5;
          cometsRef.current.push({
            x: fromLeft ? -60 : canvas.width + 60,
            y: Math.random() * canvas.height * 0.5,
            vx: (fromLeft ? 1 : -1) * (1.6 + Math.random() * 0.9),
            vy: 0.4 + Math.random() * 0.5,
            trail: [],
          });
          nextCometRef.current = now + 40000 + Math.random() * 50000;
        }

        const comets = cometsRef.current;
        for (let i = comets.length - 1; i >= 0; i--) {
          const c = comets[i];
          c.x += c.vx;
          c.y += c.vy;
          c.vy += 0.002; // gentle curve
          c.trail.unshift({ x: c.x, y: c.y });
          if (c.trail.length > 46) c.trail.pop();

          if (
            c.x < -160 || c.x > canvas.width + 160 || c.y > canvas.height + 160
          ) {
            comets.splice(i, 1);
            continue;
          }

          // dust tail
          for (let t = c.trail.length - 1; t > 0; t--) {
            const frac = t / c.trail.length;
            const pt = c.trail[t];
            ctx.beginPath();
            ctx.arc(
              pt.x - c.vx * frac * 3,
              pt.y - c.vy * frac * 3,
              (1 - frac) * 2.2 + 0.3,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(170, 215, 255, ${(1 - frac) * 0.22})`;
            ctx.fill();
          }

          // nucleus + coma
          const coma = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 9);
          coma.addColorStop(0, "rgba(235, 245, 255, 0.9)");
          coma.addColorStop(1, "rgba(170, 215, 255, 0)");
          ctx.beginPath();
          ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = coma;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(c.x, c.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();
        }
      }

      // ---- shooting stars ----
      if (!prefersReducedMotion) {
        if (nextShootingStarRef.current === 0) {
          nextShootingStarRef.current = now + 1500 + Math.random() * 2500;
        }
        if (now > nextShootingStarRef.current) {
          const goingRight = Math.random() > 0.5;
          const speed = 9 + Math.random() * 5;
          const angle = (18 + Math.random() * 17) * (Math.PI / 180);
          shootingStarsRef.current.push({
            x: goingRight
              ? Math.random() * canvas.width * 0.4
              : canvas.width * 0.6 + Math.random() * canvas.width * 0.4,
            y: Math.random() * canvas.height * 0.45,
            vx: Math.cos(angle) * speed * (goingRight ? 1 : -1),
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: 45 + Math.random() * 25,
          });
          nextShootingStarRef.current = now + 3500 + Math.random() * 5000;
        }

        const stars = shootingStarsRef.current;
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i];
          s.x += s.vx;
          s.y += s.vy;
          s.life++;

          if (
            s.life > s.maxLife ||
            s.x < -100 || s.x > canvas.width + 100 ||
            s.y > canvas.height + 100
          ) {
            stars.splice(i, 1);
            continue;
          }

          const t = s.life / s.maxLife;
          const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;

          const trail = 14;
          const tailX = s.x - s.vx * trail * 0.35;
          const tailY = s.y - s.vy * trail * 0.35;
          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(220, 235, 255, ${alpha * 0.9})`);
          grad.addColorStop(1, "rgba(220, 235, 255, 0)");

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("spawn-blackhole", handleSpawnBlackHole);
      window.removeEventListener("keydown", handleKonami);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
