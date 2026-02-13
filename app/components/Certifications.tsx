"use client";

import { motion } from "framer-motion";

const certifications = [
  {
    title: "Fundamentals of Deep Learning",
    issuer: "NVIDIA Deep Learning Institute (DLI)",
    date: "2024",
    description:
      "Comprehensive certification covering neural network architectures, training techniques, and deployment strategies using NVIDIA tools.",
    verifyUrl: "https://learn.nvidia.com/certificates?id=BgBxmEmiT82endkjHFjdiQ",
    color: "#76b900",
  },
  {
    title: "Building Transformer-Based NLP Applications",
    issuer: "NVIDIA Deep Learning Institute (DLI)",
    date: "2024",
    description:
      "Advanced certification on transformer architectures, attention mechanisms, and NLP application development with GPU-accelerated computing.",
    verifyUrl: "https://learn.nvidia.com/certificates?id=qgtj-5n-S8a4UfvC5cXeVw",
    color: "#76b900",
  },
];

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="py-section"
      aria-label="Certifications"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="section-title">
            <span className="gradient-text">Certifications</span>
          </h2>
          <p className="section-subtitle">
            Professional credentials validating deep learning expertise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group"
            >
              {/* Color accent */}
              <div
                className="project-color-bar"
                style={{ backgroundColor: cert.color }}
              />

              {/* Issuer + Verified badge */}
              <div className="flex items-center justify-between mb-4 pt-1">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: `${cert.color}20`,
                      color: cert.color,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L3 7l9 5 9-5-9-5z" />
                      <path d="M3 17l9 5 9-5" />
                      <path d="M3 12l9 5 9-5" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted">{cert.issuer}</div>
                    <div className="text-xs text-text-muted">{cert.date}</div>
                  </div>
                </div>
                <span
                  className="cert-verified"
                  style={{
                    backgroundColor: `${cert.color}15`,
                    color: cert.color,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Verified
                </span>
              </div>

              <h3 className="text-lg font-heading font-semibold text-text-primary mb-3 group-hover:text-accent-green transition-colors duration-300">
                {cert.title}
              </h3>

              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                {cert.description}
              </p>

              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:translate-x-1"
                style={{ color: cert.color }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Verify Credential
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
