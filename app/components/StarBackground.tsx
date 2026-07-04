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

interface Flash {
  x: number;
  y: number;
  start: number;
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const flashesRef = useRef<Flash[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const nextShootingStarRef = useRef(0);
  const konamiUntilRef = useRef(0);
  const konamiProgressRef = useRef(0);
  const pulsarsRef = useRef<{ idx: number; period: number; angle: number }[]>([]);
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

    // pulsars: three bright stars scattered across the field, each with its
    // own rotation period and beam angle
    const bright = particlesRef.current
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.depth > 0.5)
      .sort(() => Math.random() - 0.5);
    pulsarsRef.current = bright.slice(0, 2).map(({ p, i }, k) => {
      p.size = Math.max(p.size, 1.9);
      p.opacity = Math.max(p.opacity, 0.55);
      return {
        idx: i,
        period: 1100 + k * 420 + Math.random() * 200,
        angle: 0.4 + k * 1.1,
      };
    });

    // binary system: a star in the lower part, distinct from the pulsars
    const pulsarIdxs = new Set(pulsarsRef.current.map((m) => m.idx));
    const lower = particlesRef.current
      .map((p, i) => ({ p, i }))
      .filter(({ p }, ) => p.baseY > height * 0.5 && p.depth > 0.45)
      .filter(({ i }) => !pulsarIdxs.has(i));
    binaryIdxRef.current = lower.length
      ? lower[Math.floor(Math.random() * lower.length)].i
      : -1;
    const binary = particlesRef.current[binaryIdxRef.current];
    if (binary) binary.opacity = Math.max(binary.opacity, 0.6);
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
    const LENS_RADIUS = 240;

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

              // consumed: flash at the horizon, respawn at a random edge
              if (bdist < BH_CORE + 6) {
                flashesRef.current.push({ x: bh.x, y: bh.y, start: now });
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

          // Cursor repulsion — suspended while a black hole is active
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

      // Supernova scheduling: first one arrives quickly, then rare
      if (!prefersReducedMotion) {
        if (nextSupernovaRef.current === 0) {
          nextSupernovaRef.current = now + 6000 + Math.random() * 10000;
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
        nextSupernovaRef.current = now + 40000 + Math.random() * 50000;
      }

      // Draw particles
      const konamiLeft = konamiUntilRef.current - now;
      const konami = konamiLeft > 0 ? Math.min(konamiLeft / 1500, 1) : 0;
      const eR = 26 * bh.strength; // Einstein radius for fake lensing

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // gravitational lensing: light bends around the mass — stars near the
        // black hole render pushed outward, piling up toward the photon ring
        let rx = p.x;
        let ry = p.y;
        if (bhOn) {
          const ldx = p.x - bh.x;
          const ldy = p.y - bh.y;
          const ld = Math.sqrt(ldx * ldx + ldy * ldy) + 0.001;
          if (ld < LENS_RADIUS) {
            const falloff = 1 - ld / LENS_RADIUS;
            const push = ((eR * eR) / (ld + 10)) * falloff;
            rx = bh.x + (ldx / ld) * (ld + push);
            ry = bh.y + (ldy / ld) * (ld + push);
          }
        }

        const dx = rx - mouse.x;
        const dy = ry - mouse.y;
        const cursorDist = Math.sqrt(dx * dx + dy * dy);
        const cursorGlow = cursorDist < CURSOR_CONNECT_RADIUS
          ? (1 - cursorDist / CURSOR_CONNECT_RADIUS) * 0.6
          : 0;

        let finalOpacity = Math.min(p.opacity + cursorGlow, 1);
        let finalSize = p.size + cursorGlow * 1.5;

        // ---- binary system: two stars orbiting a common center ----
        if (i === binaryIdxRef.current && !prefersReducedMotion) {
          const orbitAngle = now / 900 + p.phase;
          const orbitR = 9.5;
          const ax = rx + Math.cos(orbitAngle) * orbitR;
          const ay = ry + Math.sin(orbitAngle) * orbitR * 0.55;
          const bx = rx - Math.cos(orbitAngle) * orbitR;
          const by = ry - Math.sin(orbitAngle) * orbitR * 0.55;

          ctx.beginPath();
          ctx.arc(ax, ay, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bx, by, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 190, 255, ${finalOpacity})`;
          ctx.fill();
          continue;
        }

        // ---- pulsars: metronome flashes with lighthouse beams ----
        const pulsarMeta = !prefersReducedMotion
          ? pulsarsRef.current.find((m) => m.idx === i)
          : undefined;
        if (pulsarMeta) {
          const pulse = Math.pow(
            Math.max(0, Math.sin((now / pulsarMeta.period) * Math.PI * 2)),
            10
          );
          finalOpacity = Math.min(p.opacity + pulse * 0.9, 1);
          finalSize = p.size + pulse * 1.8;

          if (pulse > 0.05) {
            const beamLen = 30 + pulse * 46;
            for (const dir of [1, -1]) {
              const ex = rx + Math.cos(pulsarMeta.angle) * beamLen * dir;
              const ey = ry + Math.sin(pulsarMeta.angle) * beamLen * dir;
              const grad = ctx.createLinearGradient(rx, ry, ex, ey);
              grad.addColorStop(0, `rgba(190, 225, 255, ${0.55 * pulse})`);
              grad.addColorStop(1, "rgba(190, 225, 255, 0)");
              ctx.beginPath();
              ctx.moveTo(rx, ry);
              ctx.lineTo(ex, ey);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }
        }

        // ---- supernova: diffraction-spiked flare, dual shockwave, nebula ----
        if (i === sn.idx && snT <= 1) {
          if (snT < 0.22) {
            // detonation: brilliant core with JWST-style diffraction spikes
            const f = snT / 0.22;
            const ease = 1 - Math.pow(1 - f, 3);
            const R = p.size * (1 + ease * 26) * 2.4;

            const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, R);
            grad.addColorStop(0, "rgba(255, 255, 250, 1)");
            grad.addColorStop(0.25, "rgba(255, 235, 190, 0.75)");
            grad.addColorStop(0.6, "rgba(255, 200, 140, 0.3)");
            grad.addColorStop(1, "rgba(255, 180, 110, 0)");
            ctx.beginPath();
            ctx.arc(rx, ry, R, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // diffraction spikes: long cross + shorter diagonals
            const spikes = [
              { ang: 0, len: R * 2.6 },
              { ang: Math.PI / 2, len: R * 2.6 },
              { ang: Math.PI / 4, len: R * 1.5 },
              { ang: -Math.PI / 4, len: R * 1.5 },
            ];
            for (const sp of spikes) {
              for (const dir of [1, -1]) {
                const ex = rx + Math.cos(sp.ang) * sp.len * dir;
                const ey = ry + Math.sin(sp.ang) * sp.len * dir;
                const sgrad = ctx.createLinearGradient(rx, ry, ex, ey);
                sgrad.addColorStop(0, `rgba(255, 248, 230, ${0.85 * ease})`);
                sgrad.addColorStop(1, "rgba(255, 248, 230, 0)");
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(ex, ey);
                ctx.strokeStyle = sgrad;
                ctx.lineWidth = 1.3;
                ctx.stroke();
              }
            }
            finalSize = p.size * (1 + ease * 4);
            finalOpacity = 1;
          } else {
            // expansion: fast blue shock, slower orange ejecta, nebula glow
            const f = (snT - 0.22) / 0.78;
            const fade = 1 - f;

            // lingering nebula remnant
            const nebR = 26 + f * 70;
            const neb = ctx.createRadialGradient(rx, ry, 0, rx, ry, nebR);
            neb.addColorStop(0, `rgba(200, 150, 255, ${fade * 0.14})`);
            neb.addColorStop(0.6, `rgba(255, 170, 120, ${fade * 0.08})`);
            neb.addColorStop(1, "rgba(255, 170, 120, 0)");
            ctx.beginPath();
            ctx.arc(rx, ry, nebR, 0, Math.PI * 2);
            ctx.fillStyle = neb;
            ctx.fill();

            // fast blue shockwave
            const shockR = f * 250;
            ctx.beginPath();
            ctx.arc(rx, ry, shockR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(150, 200, 255, ${fade * 0.55})`;
            ctx.lineWidth = 1.6 * fade + 0.3;
            ctx.stroke();

            // slower orange ejecta shell (slightly lumpy: two offset arcs)
            const ejR = f * 165;
            ctx.beginPath();
            ctx.arc(rx, ry, ejR, 0.3, Math.PI * 1.75);
            ctx.strokeStyle = `rgba(255, 185, 120, ${fade * 0.6})`;
            ctx.lineWidth = 2.2 * fade + 0.3;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(rx, ry, ejR * 1.06, Math.PI * 1.6, Math.PI * 2.5);
            ctx.strokeStyle = `rgba(255, 205, 150, ${fade * 0.4})`;
            ctx.lineWidth = 1.4 * fade + 0.2;
            ctx.stroke();

            finalOpacity = p.opacity * (0.3 + 0.7 * f);
          }
        }

        // Konami: every star becomes a ringed planet
        if (konami > 0) {
          const ringAlpha = finalOpacity * 0.8 * konami;
          ctx.beginPath();
          ctx.ellipse(
            rx,
            ry,
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

        // spaghettification: stars stretch toward the singularity
        if (bhOn) {
          const sdx = bh.x - rx;
          const sdy = bh.y - ry;
          const sd = Math.sqrt(sdx * sdx + sdy * sdy) + 1;
          if (sd < 210 && sd > BH_CORE) {
            const stretch = Math.min(26, 900 / sd) * bh.strength;
            const salpha = 0.4 * bh.strength * (1 - sd / 210);
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + (sdx / sd) * stretch, ry + (sdy / sd) * stretch);
            ctx.strokeStyle = `rgba(255, 235, 200, ${salpha})`;
            ctx.lineWidth = Math.min(finalSize, 1.4);
            ctx.stroke();
          }
        }

        // Soft glow near cursor
        if (cursorGlow > 0.15) {
          ctx.beginPath();
          ctx.arc(rx, ry, finalSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${cursorGlow * 0.1})`;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(rx, ry, finalSize, 0, Math.PI * 2);
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
        // disk plane precesses slowly
        const tilt = -0.38 + Math.sin(time * 0.15) * 0.08;

        // relativistic polar jets, perpendicular to the disk
        const jetAngle = tilt - Math.PI / 2;
        for (const dir of [1, -1] as const) {
          const jx = bh.x + Math.cos(jetAngle) * 74 * dir;
          const jy = bh.y + Math.sin(jetAngle) * 74 * dir;
          const jgrad = ctx.createLinearGradient(bh.x, bh.y, jx, jy);
          jgrad.addColorStop(0, `rgba(147, 197, 253, ${0.3 * s})`);
          jgrad.addColorStop(1, "rgba(147, 197, 253, 0)");
          ctx.beginPath();
          ctx.moveTo(bh.x, bh.y);
          ctx.lineTo(jx, jy);
          ctx.strokeStyle = jgrad;
          ctx.lineWidth = 2.4;
          ctx.stroke();
        }

        // ambient glow
        const glow = ctx.createRadialGradient(bh.x, bh.y, BH_CORE, bh.x, bh.y, 100);
        glow.addColorStop(0, `rgba(251, 191, 36, ${0.2 * s})`);
        glow.addColorStop(0.5, `rgba(147, 100, 250, ${0.07 * s})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Doppler-beamed accretion disk: approaching side glows brighter
        const beamPhase = time * 2.2;
        const rings = [
          { rx: 21, ry: 6.5, hot: true, base: 0.95, lw: 1.9 },
          { rx: 30, ry: 9.5, hot: false, base: 0.6, lw: 1.4 },
          { rx: 40, ry: 13.5, hot: false, base: 0.28, lw: 1.0 },
        ];
        const SEG = 26;
        for (const ring of rings) {
          for (let k = 0; k < SEG; k++) {
            const a0 = (k / SEG) * Math.PI * 2;
            const a1 = ((k + 1) / SEG) * Math.PI * 2 + 0.03;
            const beam = 0.5 + 0.5 * Math.cos(a0 + beamPhase);
            const alpha = ring.base * (0.25 + 0.75 * beam) * s;
            ctx.beginPath();
            ctx.ellipse(bh.x, bh.y, ring.rx, ring.ry, tilt, a0, a1);
            ctx.strokeStyle = ring.hot
              ? `rgba(255, 242, 215, ${alpha})`
              : `rgba(251, 166, 60, ${alpha})`;
            ctx.lineWidth = ring.lw;
            ctx.stroke();
          }
        }

        // event horizon
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, BH_CORE, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, s * 1.4)})`;
        ctx.fill();

        // photon ring
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, BH_CORE + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 235, 200, ${0.85 * s})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // consumption flashes at the event horizon
      const flashes = flashesRef.current;
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        const t = (now - f.start) / 380;
        if (t > 1) {
          flashes.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, BH_CORE + 2 + t * 16, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 214, 130, ${(1 - t) * 0.7})`;
        ctx.lineWidth = 1.2 * (1 - t) + 0.2;
        ctx.stroke();
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
