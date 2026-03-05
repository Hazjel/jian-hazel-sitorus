import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const levelStyles = {
  Beginner: "bg-muted-foreground",
  Intermediate: "bg-foreground",
  Expert: "bg-accent",
};

const getLevelFromProficiency = (proficiency) => {
  if (proficiency >= 80) return "Expert";
  if (proficiency >= 50) return "Intermediate";
  return "Beginner";
};

const SkillItem = ({ skill, index, isInView }) => {
  const level = getLevelFromProficiency(skill.proficiency);
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
      <span className={`text-xs font-mono uppercase tracking-wider px-3 py-1 ${levelStyles[level]} text-background`}>
        {level}
      </span>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("proficiency", { ascending: false });

        if (error) throw error;
        setSkills(data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const halfLength = Math.ceil(skills.length / 2);
  const firstHalf = skills.slice(0, halfLength);
  const secondHalf = skills.slice(halfLength);

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
            {loading ? (
              <div className="text-center text-muted-foreground py-10">Loading skills...</div>
            ) : skills.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No skills listed yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-x-12">
                <div>
                  {firstHalf.map((skill, index) => (
                    <SkillItem
                      key={skill.id}
                      skill={skill}
                      index={index}
                      isInView={isInView}
                    />
                  ))}
                </div>
                <div>
                  {secondHalf.map((skill, index) => (
                    <SkillItem
                      key={skill.id}
                      skill={skill}
                      index={index + firstHalf.length}
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
