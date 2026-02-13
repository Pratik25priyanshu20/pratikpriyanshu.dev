"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card group"
    >
      {/* Color accent bar */}
      <div
        className="project-color-bar"
        style={{ backgroundColor: project.color }}
      />

      {/* Header */}
      <div className="mb-6 pt-2">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
            style={{
              backgroundColor: `${project.color}15`,
              color: project.color,
            }}
          >
            {project.title.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
              {project.title}
            </h3>
            <p className="text-text-muted text-sm">{project.tagline}</p>
          </div>
        </div>
      </div>

      {/* Description — always visible */}
      <p className="text-text-secondary leading-relaxed mb-6">
        {project.description}
      </p>

      {/* Metrics — always visible for quick scanning */}
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {project.metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-surface-light/50 border border-border/50 rounded-xl p-3 text-center transition-all duration-300"
              style={{ borderColor: undefined }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${project.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                className="text-lg font-heading font-bold"
                style={{ color: project.color }}
              >
                {metric.value}
              </div>
              <div className="text-xs text-text-muted">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack — always visible */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors duration-200"
            style={{
              borderColor: `${project.color}25`,
              color: `${project.color}cc`,
              backgroundColor: `${project.color}08`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Expand/Collapse toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-normal text-text-muted transition-colors duration-200 mb-4 group/btn hover:text-text-secondary"
        aria-expanded={expanded}
      >
        <span className="group-hover/btn:underline" style={{ color: `${project.color}99` }}>
          {expanded ? "Show less" : "Deep dive: Challenge, Approach & Learnings"}
        </span>
        <ChevronIcon open={expanded} />
      </button>

      {/* Collapsible details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pb-2">
              {/* Challenge */}
              <div>
                <h4
                  className="text-sm font-mono uppercase tracking-wider mb-2"
                  style={{ color: project.color }}
                >
                  Challenge
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              {/* Approach */}
              <div>
                <h4
                  className="text-sm font-mono uppercase tracking-wider mb-2"
                  style={{ color: project.color }}
                >
                  Approach
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {project.approach}
                </p>
              </div>

              {/* Implementation */}
              <div>
                <h4
                  className="text-sm font-mono uppercase tracking-wider mb-2"
                  style={{ color: project.color }}
                >
                  Implementation
                </h4>
                <ul className="space-y-2">
                  {project.implementation.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-text-secondary text-sm"
                    >
                      <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full" style={{ backgroundColor: project.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Contribution (optional) */}
              {project.researchContribution && (
                <div>
                  <h4
                    className="text-sm font-mono uppercase tracking-wider mb-2"
                    style={{ color: project.color }}
                  >
                    Research Contribution
                  </h4>
                  <ul className="space-y-2">
                    {project.researchContribution.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-text-secondary text-sm"
                      >
                        <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: project.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Learnings */}
              <div>
                <h4
                  className="text-sm font-mono uppercase tracking-wider mb-2"
                  style={{ color: project.color }}
                >
                  Key Learnings
                </h4>
                <ul className="space-y-2">
                  {project.learnings.map((learning, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-text-secondary text-sm"
                    >
                      <span className="text-accent-purple mt-1 shrink-0 text-xs">&#9670;</span>
                      {learning}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why This Matters (optional) */}
              {project.whyThisMatters && (
                <div className="rounded-xl p-4 border border-border/50" style={{ backgroundColor: `${project.color}06` }}>
                  <h4
                    className="text-sm font-mono uppercase tracking-wider mb-2"
                    style={{ color: project.color }}
                  >
                    Why This Matters
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed italic">
                    {project.whyThisMatters}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links */}
      <div className="flex gap-3 pt-4 border-t border-border/50">
        {project.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm py-2 px-4 rounded-lg border border-border-light font-medium transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              color: project.color,
              borderColor: `${project.color}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${project.color}10`;
              e.currentTarget.style.borderColor = `${project.color}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = `${project.color}30`;
            }}
          >
            {link.label} &rarr;
          </a>
        ))}
      </div>
    </motion.article>
  );
}
