import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = () => {
  const sectionRef = useRef(null);
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

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        ".skills-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Category blocks stagger
      gsap.fromTo(
        ".skill-category",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Individual skill items
      gsap.fromTo(
        ".skill-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  const categories = Object.keys(groupedSkills);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-[#050505]"
    >
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 md:mb-28">
          <span className="skills-title block text-white/30 text-xs tracking-[0.5em] uppercase mb-4">
            Tech Stack
          </span>
          <h2 className="skills-title font-display text-[clamp(2rem,5vw,4rem)] leading-[1.1] tracking-[-0.03em] text-white font-light max-w-3xl">
            Technologies I use to bring ideas to life.
          </h2>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-white/30 text-sm tracking-widest uppercase">
            Loading...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-white/30 text-sm tracking-widest uppercase">
            No skills listed yet.
          </div>
        ) : (
          <div className="skills-grid grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {categories.map((category) => (
              <div key={category} className="skill-category">
                <h3 className="text-white/50 text-[11px] tracking-[0.4em] uppercase mb-6 pb-3 border-b border-white/10">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category].map((skill) => (
                    <span
                      key={skill.id}
                      className="skill-item inline-block px-4 py-2 text-sm text-white/60 border border-white/10 hover:border-white/40 hover:text-white/90 transition-all duration-500 cursor-default"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default SkillsSection;
