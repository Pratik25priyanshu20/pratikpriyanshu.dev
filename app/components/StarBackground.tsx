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
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const count = isMobile ? 45 : 85;

    particlesRef.current = Array.from({ length: count }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        speed: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.3,
        driftY: (Math.random() - 0.5) * 0.3,
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

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
        if (cursorGlow > 0.1) {
          ctx.fillStyle = `rgba(160, 200, 255, ${finalOpacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        }
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
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
