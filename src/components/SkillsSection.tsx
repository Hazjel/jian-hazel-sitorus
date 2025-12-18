import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "HTML & CSS", level: 80, category: "Frontend" },
  { name: "JavaScript", level: 75, category: "Frontend" },
  { name: "Tailwind CSS", level: 50, category: "Frontend" },
  { name: "Laravel", level: 75, category: "Backend" },
  { name: "Python", level: 70, category: "Backend" },
  { name: "Java", level: 70, category: "Backend" },
  { name: "MySQL", level: 75, category: "Database" },
  { name: "Git & GitHub", level: 80, category: "Tools" },
  { name: "Figma", level: 55, category: "Design" },
];

const SkillBar = ({
  skill,
  index,
  isInView,
}: {
  skill: (typeof skills)[0];
  index: number;
  isInView: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="space-y-2"
  >
    <div className="flex justify-between items-center">
      <span className="font-medium text-foreground">{skill.name}</span>
      <span className="text-sm text-muted-foreground">{skill.level}%</span>
    </div>
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${skill.level}%` } : {}}
        transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: "var(--gradient-primary)" }}
      />
    </div>
  </motion.div>
);

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="py-24 bg-card/50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
            Skills & Technologies
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 rounded-full bg-secondary text-muted-foreground text-sm"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="grid gap-6">
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
    </section>
  );
};

export default SkillsSection;
