"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-16"
      aria-label="Introduction"
    >
      <div className="section-container w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text — 55% */}
          <motion.div
            className="lg:w-[55%] text-center lg:text-left"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-hero font-heading font-bold mb-2 tracking-tight"
            >
              <span className="gradient-text">PRATIK PRIYANSHU</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl font-heading font-medium text-text-secondary mb-6"
            >
              ML Engineer
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-text-secondary mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Bridging Research and Production in
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 justify-center lg:justify-start"
            >
              <span className="text-accent-blue-light font-medium">Multi-Agent AI</span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-accent-purple font-medium">Quantum ML</span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-accent-cyan font-medium">GenAI</span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-accent-green font-medium">Production Systems</span>
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-text-muted mb-8 flex items-center gap-2 justify-center lg:justify-start"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent-blue"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Heidelberg, Germany
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a href="#projects" className="btn-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
                View Projects
              </a>
              <a href="#contact" className="btn-secondary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Get in Touch
              </a>
            </motion.div>
          </motion.div>

          {/* Avatar — 45% */}
          <motion.div
            className="lg:w-[45%] flex justify-center"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
          >
            <div className="relative group">
              {/* Animated gradient ring */}
              <div className="avatar-ring w-64 h-64 sm:w-80 sm:h-80 lg:w-[350px] lg:h-[350px] rounded-full overflow-hidden transition-all duration-500 group-hover:scale-[1.02] animate-float">
                <Image
                  src="/images/ghibli.png"
                  alt="Pratik Priyanshu, Ghibli style avatar"
                  width={350}
                  height={350}
                  priority
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Soft ambient glow behind avatar */}
              <div className="absolute inset-0 -z-10 rounded-full bg-accent-blue/10 blur-3xl scale-125 group-hover:bg-accent-purple/10 transition-colors duration-1000" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
