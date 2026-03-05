import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Helper function to map skill names to Devicon URLs
const getIconUrl = (skillName) => {
  const nameMap = {
    "html & css": "html5",
    "html": "html5",
    "css": "css3",
    "javascript": "javascript",
    "js": "javascript",
    "typescript": "typescript",
    "react": "react",
    "react.js": "react",
    "next.js": "nextjs",
    "vue": "vuejs",
    "tailwind css": "tailwindcss",
    "tailwind": "tailwindcss",
    "node.js": "nodejs",
    "express": "express",
    "laravel": "laravel",
    "php": "php",
    "python": "python",
    "java": "java",
    "go": "go",
    "mysql": "mysql",
    "postgresql": "postgresql",
    "mongodb": "mongodb",
    "firebase": "firebase",
    "supabase": "supabase",
    "git": "git",
    "git & github": "github",
    "github": "github",
    "docker": "docker",
    "figma": "figma",
    "c++": "cplusplus",
    "c#": "csharp",
    "aws": "amazonwebservices",
  };

  const normalized = skillName.toLowerCase().trim();
  const slug = nameMap[normalized] || normalized.replace(/[^a-z0-9]/g, '');

  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
};

const SkillCategory = ({ category, categorySkills, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="mb-10 last:mb-0"
    >
      <h3 className="text-xl font-bold mb-4 text-foreground border-b border-muted-foreground/20 pb-2">
        {category}
      </h3>
      <div className="flex flex-wrap gap-3">
        {categorySkills.map((skill) => (
          <span
            key={skill.id}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-foreground/30 rounded-md text-sm font-medium hover:border-accent hover:text-accent transition-colors shadow-sm"
          >
            <img
              src={getIconUrl(skill.name)}
              alt=""
              className="w-4 h-4 object-contain"
              onError={(e) => {
                // Remove the image if the icon is not found on devicon
                e.target.style.display = 'none';
              }}
              loading="lazy"
            />
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [groupedSkills, setGroupedSkills] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("category", { ascending: true })
          .order("name", { ascending: true });

        if (error) throw error;

        // Group skills by category
        const grouped = (data || []).reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        }, {});

        setGroupedSkills(grouped);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const categories = Object.keys(groupedSkills);

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
              <h2 className="text-headline mt-2">Tech Stack</h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Technologies, frameworks, and tools I use to build solutions.
              </p>
            </motion.div>
          </div>

          {/* Skills List */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="text-center text-muted-foreground py-10">Loading tech stack...</div>
            ) : categories.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No skills listed yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-x-12">
                {/* Divide categories roughly in half across two columns if possible */}
                <div>
                  {categories.slice(0, Math.ceil(categories.length / 2)).map((category, index) => (
                    <SkillCategory
                      key={category}
                      category={category}
                      categorySkills={groupedSkills[category]}
                      index={index}
                      isInView={isInView}
                    />
                  ))}
                </div>
                <div>
                  {categories.slice(Math.ceil(categories.length / 2)).map((category, index) => (
                    <SkillCategory
                      key={category}
                      category={category}
                      categorySkills={groupedSkills[category]}
                      index={index + Math.ceil(categories.length / 2)}
                      isInView={isInView}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
