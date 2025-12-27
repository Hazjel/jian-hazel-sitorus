import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "HTML & CSS", level: 80 },
  { name: "JavaScript", level: 55 },
  { name: "Tailwind CSS", level: 50 },
  { name: "Laravel", level: 75 },
  { name: "Java", level: 70 },
  { name: "Python", level: 55 },
  { name: "MySQL", level: 75 },
  { name: "Git & GitHub", level: 80 },
  { name: "Figma", level: 55 },
];

const SkillBar = ({ skill, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-medium group-hover:text-accent transition-colors">
          {skill.name}
        </span>
        <span className="font-mono text-sm text-muted-foreground">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 bg-muted border border-foreground overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.05, ease: "easeOut" }}
          className="h-full bg-foreground group-hover:bg-accent transition-colors"
        />
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 bg-muted border-b-2 border-foreground" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Section Label */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-accent font-mono text-sm">03</span>
              <h2 className="text-headline mt-2">Skills</h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Technologies and tools I work with.
              </p>
            </motion.div>
          </div>

          {/* Skills Grid */}
          <div className="lg:col-span-9">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {skills.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  skill={skill}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
