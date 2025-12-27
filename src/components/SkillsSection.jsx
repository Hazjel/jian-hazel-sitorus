import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "HTML & CSS", level: "Expert" },
  { name: "JavaScript", level: "Intermediate" },
  { name: "Tailwind CSS", level: "Intermediate" },
  { name: "Laravel", level: "Expert" },
  { name: "Java", level: "Intermediate" },
  { name: "Python", level: "Intermediate" },
  { name: "MySQL", level: "Expert" },
  { name: "Git & GitHub", level: "Expert" },
  { name: "Figma", level: "Intermediate" },
];

const levelStyles = {
  Beginner: "bg-muted-foreground",
  Intermediate: "bg-foreground",
  Expert: "bg-accent",
};

const SkillItem = ({ skill, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex items-center justify-between py-4 border-b border-foreground group"
    >
      <span className="font-medium group-hover:text-accent transition-colors">
        {skill.name}
      </span>
      <span className={`text-xs font-mono uppercase tracking-wider px-3 py-1 ${levelStyles[skill.level]} text-background`}>
        {skill.level}
      </span>
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

              {/* Legend */}
              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent" />
                  <span className="text-xs font-mono uppercase">Expert</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-foreground" />
                  <span className="text-xs font-mono uppercase">Intermediate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-muted-foreground" />
                  <span className="text-xs font-mono uppercase">Beginner</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Skills List */}
          <div className="lg:col-span-9">
            <div className="grid md:grid-cols-2 gap-x-12">
              <div>
                {skills.slice(0, 5).map((skill, index) => (
                  <SkillItem
                    key={skill.name}
                    skill={skill}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </div>
              <div>
                {skills.slice(5).map((skill, index) => (
                  <SkillItem
                    key={skill.name}
                    skill={skill}
                    index={index + 5}
                    isInView={isInView}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
