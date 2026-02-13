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
              I build production grade machine learning systems at the
              intersection of research and real world deployment.
            </p>
            <p>
              My work spans{" "}
              <span className="text-accent-purple font-medium">
                quantum augmented drug discovery
              </span>
              ,{" "}
              <span className="text-accent-orange font-medium">
                privacy preserving AI
              </span>
              , and{" "}
              <span className="text-accent-blue-light font-medium">
                multi agent orchestration systems
              </span>
              {" "}but the consistent focus is execution. I design end to end
              solutions: from data engineering pipelines (Kafka, Spark) and model
              development (quantum classical hybrids, transformers) to scalable
              deployment (FastAPI, Kubernetes, MLOps).
            </p>
            <p>
              I&apos;m particularly interested in translating advanced research
              into reliable systems, taking ideas from papers and turning them
              into deployable, tested architectures.
            </p>
            <p>
              Currently completing my{" "}
              <span className="text-text-primary font-medium">
                M.Sc. in Applied Data Science
              </span>{" "}
              at SRH Heidelberg (Grade: 1.8), and seeking Werkstudent
              opportunities in Germany where I can contribute to production ML
              and GenAI systems.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
