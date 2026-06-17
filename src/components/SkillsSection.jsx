import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const getIconUrl = (skillName) => {
  const nameMap = {
    "html & css": "html5", "html": "html5", "css": "css3",
    "javascript": "javascript", "js": "javascript", "typescript": "typescript",
    "react": "react", "react.js": "react", "next.js": "nextjs", "nextjs": "nextjs",
    "vue": "vuejs", "vue.js": "vuejs", "angular": "angularjs", "svelte": "svelte",
    "tailwind css": "tailwindcss", "tailwind": "tailwindcss", "bootstrap": "bootstrap", "sass": "sass",
    "node.js": "nodejs", "nodejs": "nodejs", "express": "express", "express.js": "express",
    "nestjs": "nestjs", "laravel": "laravel", "php": "php", "python": "python",
    "django": "django", "flask": "flask", "fastapi": "fastapi", "java": "java",
    "spring": "spring", "spring boot": "spring", "kotlin": "kotlin", "go": "go", "golang": "go",
    "rust": "rust", "ruby": "ruby", "rails": "rails", "mysql": "mysql",
    "postgresql": "postgresql", "postgres": "postgresql", "mongodb": "mongodb",
    "redis": "redis", "sqlite": "sqlite", "firebase": "firebase", "supabase": "supabase",
    "git": "git", "git & github": "github", "github": "github", "gitlab": "gitlab",
    "docker": "docker", "kubernetes": "kubernetes", "figma": "figma",
    "c++": "cplusplus", "c#": "csharp", "c": "c",
    "aws": "amazonwebservices", "azure": "azure", "gcp": "googlecloud",
    "google cloud": "googlecloud", "vercel": "vercel", "netlify": "netlify",
    "linux": "linux", "ubuntu": "ubuntu", "bash": "bash",
    "vscode": "vscode", "vs code": "vscode", "postman": "postman",
    "graphql": "graphql", "redux": "redux", "jest": "jest",
    "webpack": "webpack", "vite": "vitejs", "tensorflow": "tensorflow",
    "pytorch": "pytorch", "numpy": "numpy", "pandas": "pandas",
    "flutter": "flutter", "dart": "dart",
  };
  const normalized = skillName.toLowerCase().trim();
  const slug = nameMap[normalized] || normalized.replace(/[^a-z0-9]/g, "");
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
};

const SkillsSection = () => {
  const [groupedSkills, setGroupedSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

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
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill);
          return acc;
        }, {});
        setGroupedSkills(grouped);
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = Object.keys(groupedSkills);
  const allSkills = Object.values(groupedSkills).flat();
  const displaySkills = activeCategory
    ? groupedSkills[activeCategory] || []
    : allSkills;

  return (
    <section id="skills" className="scroll-mt-16 bg-white border-b-[3px] border-black">
      {/* Section header */}
      <div className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 py-4">
            <span className="section-label">03</span>
            <div className="w-8 border-t-[3px] border-black/30" />
            <span className="section-label">Tech Stack</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h2 className="font-display text-black mb-12">
          Technologies I Use to Bring Ideas to Life.
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-[#F0F0F0] border-[3px] border-black animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="section-label">No skills listed yet.</p>
        ) : (
          <>
            {/* Category filter chips */}
            <div className="flex flex-wrap gap-0 border-[3px] border-black mb-8 w-fit">
              <button
                className={`chip-filter border-r-[3px] border-black last:border-r-0 ${activeCategory === null ? "active" : ""}`}
                onClick={() => setActiveCategory(null)}
              >
                All
              </button>
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  className={`chip-filter ${i < categories.length - 1 ? "border-r-[3px] border-black" : ""} ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills grid — per category cards */}
            {activeCategory ? (
              <div className="card-raw">
                <h3 className="font-display mb-6 border-b-[3px] border-black pb-4" style={{ fontSize: "1.25rem" }}>
                  {activeCategory}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {displaySkills.map((skill) => (
                    <span key={skill.id} className="chip-filter cursor-default">
                      <img
                        src={getIconUrl(skill.name)}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="w-3 h-3 mr-1.5 object-contain"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-l-[3px] border-t-[3px] border-black">
                {categories.map((category, idx) => (
                  <div
                    key={category}
                    className="border-r-[3px] border-b-[3px] border-black p-6 hover:bg-[#F0F0F0] transition-colors duration-100"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b-[3px] border-black">
                      <h3 className="font-display text-black" style={{ fontSize: "0.875rem" }}>
                        {category.toUpperCase()}
                      </h3>
                      <span className="font-mono-rb text-xs text-black/40">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {groupedSkills[category].map((skill) => (
                        <span key={skill.id} className="chip-filter text-[9px] cursor-default">
                          <img
                            src={getIconUrl(skill.name)}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="w-3 h-3 mr-1 object-contain"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Marquee strip */}
            {allSkills.length > 0 && (
              <div className="mt-12 border-t-[3px] border-black pt-6 overflow-hidden">
                <div className="relative overflow-hidden">
                  <div className="marquee-track">
                    {[...allSkills, ...allSkills].map((skill, i) => (
                      <span
                        key={`${skill.id}-${i}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono-rb uppercase tracking-widest text-black/40 border-r-[3px] border-black whitespace-nowrap"
                      >
                        <img
                          src={getIconUrl(skill.name)}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          className="w-3 h-3 object-contain opacity-50 grayscale"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
