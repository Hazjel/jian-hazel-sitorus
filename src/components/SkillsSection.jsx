import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const skills = [
  { name: "HTML & CSS", level: 80, category: "Frontend" },
  { name: "JavaScript", level: 55, category: "Frontend" },
  { name: "Tailwind CSS", level: 50, category: "Frontend" },
  { name: "Laravel", level: 75, category: "Backend" },
  { name: "Java", level: 70, category: "Backend" },
  { name: "Python", level: 55, category: "AI & Backend" },
  { name: "MySQL", level: 75, category: "Database" },
  { name: "Git & GitHub", level: 80, category: "Tools" },
  { name: "Figma", level: 55, category: "Design" },
];

const SkillBar = ({ skill, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="space-y-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center">
        <motion.span
          className="font-medium text-foreground transition-colors group-hover:text-primary"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {skill.name}
        </motion.span>
        <motion.span
          className="text-sm text-muted-foreground font-medium"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay: 0.3 + index * 0.08, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{ background: "var(--gradient-primary)" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={isHovered ? { x: ["-100%", "100%"] } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ 
            boxShadow: isHovered 
              ? "0 0 20px hsl(0 0% 100% / 0.2)" 
              : "0 0 0px hsl(0 0% 100% / 0)" 
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [...new Set(skills.map((s) => s.category))];
  const filteredSkills = activeCategory 
    ? skills.filter(s => s.category === activeCategory)
    : skills;

  return (
    <section id="skills" className="py-24 bg-card/50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="text-primary font-medium text-sm uppercase tracking-wider"
          >
            Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold mt-2"
          >
            Skills & Technologies
          </motion.h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground glow"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              All
            </motion.button>
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground glow"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          <motion.div layout className="grid gap-5">
            {filteredSkills.map((skill, index) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
