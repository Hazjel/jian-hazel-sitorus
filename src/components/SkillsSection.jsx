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
      gsap.fromTo(
        ".skills-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".skill-category",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".skill-item",
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.025,
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
      className="relative py-32 md:py-40 lg:py-48 bg-[#050505]"
    >
      {/* Subtle gradient accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 lg:mb-32">
          <div className="flex items-center gap-4 mb-6">
            <span className="skills-title text-white/20 text-xs tracking-[0.4em] font-mono">
              02
            </span>
            <span className="skills-title w-12 h-px bg-white/20" />
            <span className="skills-title text-white/40 text-[11px] tracking-[0.4em] uppercase">
              Tech Stack
            </span>
          </div>
          <h2 className="skills-title font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.03em] text-white font-light max-w-4xl">
            Technologies I use to
            <span className="italic text-white/50"> bring </span>
            ideas to life.
          </h2>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
            Loading...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
            No skills listed yet.
          </div>
        ) : (
          <div className="skills-grid grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-14 md:gap-y-16">
            {categories.map((category, idx) => (
              <div key={category} className="skill-category">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <h3 className="text-white/70 text-[11px] tracking-[0.4em] uppercase font-light">
                    {category}
                  </h3>
                  <span className="text-white/20 text-[10px] tracking-[0.3em] font-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category].map((skill) => (
                    <span
                      key={skill.id}
                      className="skill-item inline-block px-3.5 py-1.5 text-xs tracking-[0.05em] text-white/60 border border-white/10 hover:border-white/40 hover:text-white/90 hover:bg-white/[0.02] transition-all duration-500 cursor-default"
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

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default SkillsSection;
