"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/lib/skills";

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: i * 0.04,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

export default function Skills() {
  return (
    <section id="skills" className="py-section" aria-label="Skills">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="section-title">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="section-subtitle">
            Tools and technologies I work with across the ML stack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: catIndex * 0.05 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-heading font-semibold text-text-primary flex items-center gap-2 uppercase tracking-wider">
                <span className="text-lg">{category.emoji}</span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    custom={skillIndex}
                    variants={chipVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="skill-chip"
                  >
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
