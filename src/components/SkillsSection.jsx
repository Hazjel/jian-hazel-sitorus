import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

// Map skill names to Devicon slugs
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
    "nextjs": "nextjs",
    "vue": "vuejs",
    "vue.js": "vuejs",
    "angular": "angularjs",
    "svelte": "svelte",
    "tailwind css": "tailwindcss",
    "tailwind": "tailwindcss",
    "bootstrap": "bootstrap",
    "sass": "sass",
    "node.js": "nodejs",
    "nodejs": "nodejs",
    "express": "express",
    "express.js": "express",
    "nestjs": "nestjs",
    "laravel": "laravel",
    "php": "php",
    "python": "python",
    "django": "django",
    "flask": "flask",
    "fastapi": "fastapi",
    "java": "java",
    "spring": "spring",
    "spring boot": "spring",
    "kotlin": "kotlin",
    "go": "go",
    "golang": "go",
    "rust": "rust",
    "ruby": "ruby",
    "rails": "rails",
    "mysql": "mysql",
    "postgresql": "postgresql",
    "postgres": "postgresql",
    "mongodb": "mongodb",
    "redis": "redis",
    "sqlite": "sqlite",
    "firebase": "firebase",
    "supabase": "supabase",
    "git": "git",
    "git & github": "github",
    "github": "github",
    "gitlab": "gitlab",
    "docker": "docker",
    "kubernetes": "kubernetes",
    "figma": "figma",
    "adobe xd": "xd",
    "photoshop": "photoshop",
    "illustrator": "illustrator",
    "c++": "cplusplus",
    "c#": "csharp",
    "c": "c",
    "aws": "amazonwebservices",
    "azure": "azure",
    "gcp": "googlecloud",
    "google cloud": "googlecloud",
    "vercel": "vercel",
    "netlify": "netlify",
    "linux": "linux",
    "ubuntu": "ubuntu",
    "bash": "bash",
    "vscode": "vscode",
    "vs code": "vscode",
    "intellij": "intellij",
    "postman": "postman",
    "graphql": "graphql",
    "redux": "redux",
    "jest": "jest",
    "webpack": "webpack",
    "vite": "vitejs",
    "tensorflow": "tensorflow",
    "pytorch": "pytorch",
    "numpy": "numpy",
    "pandas": "pandas",
    "flutter": "flutter",
    "dart": "dart",
  };

  const normalized = skillName.toLowerCase().trim();
  const slug = nameMap[normalized] || normalized.replace(/[^a-z0-9]/g, "");

  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
};

// Spotlight card effect — tracks mouse position via CSS custom props
const SpotlightCard = ({ children, className = "" }) => {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
};

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

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([".skills-title", ".skill-category", ".skill-item", ".skills-marquee-wrap"], { opacity: 1, y: 0 });
        return;
      }

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

      // Marquee animation for all-skills bar
      gsap.fromTo(
        ".skills-marquee-wrap",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-marquee-wrap",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  const categories = Object.keys(groupedSkills);
  const allSkills = Object.values(groupedSkills).flat();

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="scroll-mt-20 relative py-32 md:py-40 lg:py-48 bg-[#050505] aurora-bg"
    >
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 lg:mb-32">
          <div className="flex items-center gap-4 mb-6">
            <span className="skills-title text-white/20 text-xs tracking-[0.4em] font-mono">
              03
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 skeleton-pulse rounded-sm" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
            No skills listed yet.
          </div>
        ) : (
          <>
            <div className="skills-grid grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-14 md:gap-y-16">
              {categories.map((category, idx) => (
                <SpotlightCard
                  key={category}
                  className="skill-category glass-card p-6 md:p-8 transition-all duration-500"
                >
                  <div className="relative z-10">
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
                          className="skill-item skill-chip group/skill inline-flex items-center gap-2 px-3.5 py-1.5 text-xs tracking-[0.05em] text-white/60 border border-white/10 cursor-default relative z-10"
                        >
                          <img
                            src={getIconUrl(skill.name)}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="w-3.5 h-3.5 object-contain opacity-70 grayscale group-hover/skill:opacity-100 group-hover/skill:grayscale-0 transition-all duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>

            {/* Infinite Marquee of all skills */}
            {allSkills.length > 0 && (
              <div className="skills-marquee-wrap mt-24 md:mt-32 pt-12 border-t border-white/5 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-white/15 text-[10px] tracking-[0.3em] uppercase">
                    Full Stack
                  </span>
                  <span className="flex-1 h-px bg-white/5" />
                </div>
                <div className="relative overflow-hidden">
                  <div className="marquee-track">
                    {/* Duplicate content for seamless loop */}
                    {[...allSkills, ...allSkills].map((skill, i) => (
                      <span
                        key={`${skill.id}-${i}`}
                        className="inline-flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.15em] uppercase text-white/25 whitespace-nowrap border-r border-white/5"
                      >
                        <img
                          src={getIconUrl(skill.name)}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="w-3 h-3 object-contain opacity-40 grayscale"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  {/* Fade edges */}
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px section-divider" />
    </section>
  );
};

export default SkillsSection;
