"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projects, researchThreads } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [hoverThread, setHoverThread] = useState<string | null>(null);

  const effectiveThread = hoverThread ?? activeThread;

  return (
    <section id="projects" className="py-section" aria-label="Projects">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Deep dives into systems I&apos;ve built, from research to production.
          </p>
        </motion.div>

        {/* Research thread filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-12 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter projects by research thread"
        >
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted mr-1">
            Research threads
          </span>
          <button
            onClick={() => setActiveThread(null)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
              activeThread === null
                ? "border-accent-blue/50 text-accent-blue-light bg-accent-blue/10"
                : "border-border text-text-secondary hover:border-border-light hover:text-text-primary"
            }`}
          >
            All
          </button>
          {researchThreads.map((thread) => (
            <button
              key={thread}
              onClick={() =>
                setActiveThread(activeThread === thread ? null : thread)
              }
              onMouseEnter={() => setHoverThread(thread)}
              onMouseLeave={() => setHoverThread(null)}
              aria-pressed={activeThread === thread}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                activeThread === thread
                  ? "border-accent-blue/50 text-accent-blue-light bg-accent-blue/10"
                  : "border-border text-text-secondary hover:border-border-light hover:text-text-primary"
              }`}
            >
              {thread}
            </button>
          ))}
        </motion.div>

        <div className="space-y-20 max-w-[1100px] mx-auto">
          {projects.map((project, index) => {
            const dimmed =
              effectiveThread !== null &&
              !project.threads.includes(effectiveThread);
            return (
              <div
                key={project.id}
                className={`transition-all duration-500 ${
                  dimmed ? "opacity-30 blur-[1px] scale-[0.99]" : "opacity-100"
                }`}
              >
                <ProjectCard project={project} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
