"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="py-section" aria-label="About me">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.h2
            className="section-title"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            About <span className="gradient-text">Me</span>
          </motion.h2>

          <motion.div
            className="space-y-5 text-text-secondary leading-relaxed text-[1.05rem]"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <p>
              I research machine learning with a focus on building rigorous,
              reproducible evaluation frameworks for complex scientific and
              real-world problems.
            </p>
            <p>
              My work spans{" "}
              <span className="text-accent-purple font-medium">
                hybrid quantum-classical evaluation
              </span>
              ,{" "}
              <span className="text-accent-yellow font-medium">
                scientific machine learning
              </span>{" "}
              (exoplanet detection, Earth observation), and{" "}
              <span className="text-accent-cyan font-medium">
                multimodal coherence evaluation
              </span>
              . The consistent thread is methodological depth: uncertainty
              quantification, conformal prediction, statistical rigor, and
              honest reporting of null results.
            </p>
            <p>
              I&apos;m driven by the question of how we know what we claim to
              know about ML systems. I design evaluation protocols that
              separate genuine capability from artifacts of experimental setup.
            </p>
            <p>
              Currently completing my{" "}
              <span className="text-text-primary font-medium">
                M.Sc. in Applied Data Science
              </span>{" "}
              at SRH Heidelberg (Grade: 1.6), and seeking PhD positions in
              machine learning where reproducibility, principled evaluation, and
              methodological rigour are central values.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
