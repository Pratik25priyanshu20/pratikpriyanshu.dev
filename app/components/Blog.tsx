"use client";

import { motion } from "framer-motion";
import { blogPosts } from "@/lib/blog";

const tagColors: Record<string, string> = {
  "Multi-Agent": "#3b82f6",
  "LLM": "#8b5cf6",
  "Architecture": "#06b6d4",
  "Quantum": "#8b5cf6",
  "ML": "#10b981",
  "Research": "#f59e0b",
  "Edge AI": "#10b981",
  "Optimization": "#06b6d4",
  "Deployment": "#3b82f6",
};

export default function Blog() {
  return (
    <section id="blog" className="py-section" aria-label="Blog">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="section-title">
            Latest <span className="gradient-text">Writing</span>
          </h2>
          <p className="section-subtitle">
            Thoughts on ML engineering, research, and building intelligent
            systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group flex flex-col cursor-pointer"
            >
              {/* Thumbnail with animated gradient */}
              <div className="blog-thumbnail w-full h-40 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-cyan/10 flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="text-3xl block mb-2 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      {index === 0 ? "🤖" : index === 1 ? "⚛️" : "📡"}
                    </span>
                    <span className="text-text-muted text-xs font-mono">
                      {post.tags[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => {
                  const color = tagColors[tag] || "#3b82f6";
                  return (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${color}15`,
                        color: `${color}cc`,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>

              {/* Title */}
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-2 group-hover:text-accent-blue-light transition-colors duration-300">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border/50">
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {post.readTime}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
