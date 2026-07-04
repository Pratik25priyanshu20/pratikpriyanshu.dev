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
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const nextShootingStarRef = useRef(0);
  const konamiUntilRef = useRef(0);
  const konamiProgressRef = useRef(0);

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
      };
    });
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

    const animate = () => {
      if (!isVisibleRef.current || !ctx || !canvas) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

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

          // Cursor repulsion — particles gently push away
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

              // Brighter connections near cursor
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
              // Blue-tinted connections, brighter near cursor
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

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particles glow brighter near cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const cursorDist = Math.sqrt(dx * dx + dy * dy);
        const cursorGlow = cursorDist < CURSOR_CONNECT_RADIUS
          ? (1 - cursorDist / CURSOR_CONNECT_RADIUS) * 0.6
          : 0;

        const finalOpacity = Math.min(p.opacity + cursorGlow, 1);
        const finalSize = p.size + cursorGlow * 1.5;

        // Soft glow for particles near cursor
        if (cursorGlow > 0.15) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, finalSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${cursorGlow * 0.1})`;
          ctx.fill();
        }

        // Konami: every star becomes a ringed planet
        const konamiLeft = konamiUntilRef.current - performance.now();
        const konami = konamiLeft > 0 ? Math.min(konamiLeft / 1500, 1) : 0;

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

      // Shooting stars
      if (!prefersReducedMotion) {
        const now = performance.now();
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

          // fade in fast, fade out toward end of life
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

          // bright head
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
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
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
