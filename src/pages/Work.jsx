import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS_PER_PAGE = 9;

const Work = () => {
  const containerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [activeYear, setActiveYear] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-hero",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
        }
      );

      gsap.fromTo(
        ".work-filter",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.4,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  // Refresh ScrollTrigger when filtered list changes so cards animate
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [query, activeTag, activeYear, visibleCount]);

  // Derive all unique tags and years
  const { allTags, allYears } = useMemo(() => {
    const tags = new Set();
    const years = new Set();
    projects.forEach((p) => {
      (p.tags || []).forEach((t) => tags.add(t));
      const year = p.project_date
        ? new Date(p.project_date).getFullYear()
        : new Date(p.created_at).getFullYear();
      years.add(year);
    });
    return {
      allTags: Array.from(tags).sort(),
      allYears: Array.from(years).sort((a, b) => b - a),
    };
  }, [projects]);

  // Filter + search
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search
      if (query) {
        const q = query.toLowerCase();
        const haystack = [
          p.title,
          p.description,
          ...(p.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Tag filter
      if (activeTag !== "all") {
        if (!p.tags || !p.tags.includes(activeTag)) return false;
      }
      // Year filter
      if (activeYear !== "all") {
        const year = p.project_date
          ? new Date(p.project_date).getFullYear()
          : new Date(p.created_at).getFullYear();
        if (String(year) !== String(activeYear)) return false;
      }
      return true;
    });
  }, [projects, query, activeTag, activeYear]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const clearFilters = () => {
    setQuery("");
    setActiveTag("all");
    setActiveYear("all");
    setVisibleCount(PROJECTS_PER_PAGE);
  };

  const hasActiveFilter =
    query !== "" || activeTag !== "all" || activeYear !== "all";

  const handleFilterChange = (fn) => {
    setVisibleCount(PROJECTS_PER_PAGE);
    fn();
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0a0a0a] text-white cinematic-portfolio"
    >
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none grain-texture z-[1]" />

      {/* Back Nav */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-12 md:pt-16">
        <Link
          to="/"
          className="work-hero inline-flex items-center gap-3 text-white/50 text-[11px] tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-16 md:pt-24 pb-16">
        <div className="flex items-center gap-4 mb-6 work-hero">
          <span className="text-white/20 text-xs tracking-[0.4em] font-mono">
            Archive
          </span>
          <span className="w-12 h-px bg-white/20" />
          <span className="text-white/40 text-[11px] tracking-[0.4em] uppercase">
            All Works
          </span>
        </div>

        <h1 className="work-hero font-display text-[clamp(2.5rem,7vw,6rem)] leading-[1] tracking-[-0.03em] text-white font-light max-w-5xl">
          Every project,
          <span className="italic text-white/50"> every experiment.</span>
        </h1>

        <p className="work-hero text-white/50 text-base md:text-lg font-light leading-[1.7] mt-8 max-w-2xl">
          A complete index of everything I&apos;ve built. Browse by tag, filter
          by year, or search for something specific.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
        <div className="work-filter border-t border-b border-white/10 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search */}
          <div className="relative flex items-center gap-3 lg:min-w-[280px] lg:max-w-sm flex-1">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) =>
                handleFilterChange(() => setQuery(e.target.value))
              }
              placeholder="Search projects..."
              className="w-full bg-transparent text-white/80 text-sm font-light placeholder:text-white/20 focus:outline-none tracking-[0.02em]"
            />
            {query && (
              <button
                onClick={() => handleFilterChange(() => setQuery(""))}
                className="text-white/30 hover:text-white transition-colors duration-500"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Year Filter */}
          {allYears.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                Year
              </span>
              <button
                onClick={() => handleFilterChange(() => setActiveYear("all"))}
                className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-all duration-500 ${
                  activeYear === "all"
                    ? "border-white/60 text-white"
                    : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                }`}
              >
                All
              </button>
              {allYears.map((year) => (
                <button
                  key={year}
                  onClick={() =>
                    handleFilterChange(() => setActiveYear(String(year)))
                  }
                  className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-all duration-500 ${
                    activeYear === String(year)
                      ? "border-white/60 text-white"
                      : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="work-filter pt-6 pb-2 flex items-start gap-4 flex-wrap">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 shrink-0 mt-2">
              Tags
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleFilterChange(() => setActiveTag("all"))}
                className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-all duration-500 ${
                  activeTag === "all"
                    ? "border-white/60 text-white"
                    : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange(() => setActiveTag(tag))}
                  className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-all duration-500 ${
                    activeTag === tag
                      ? "border-white/60 text-white"
                      : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Count */}
        <div className="flex items-center justify-between mt-8 text-[10px] tracking-[0.3em] uppercase text-white/30">
          <span>
            {filteredProjects.length === 0
              ? "No results"
              : `${String(filteredProjects.length).padStart(2, "0")} ${
                  filteredProjects.length === 1 ? "Result" : "Results"
                }`}
          </span>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="text-white/50 hover:text-white transition-colors duration-500 flex items-center gap-2"
            >
              Clear
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-16 md:gap-y-20">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video skeleton-pulse" />
                <div className="h-2.5 w-16 skeleton-pulse" />
                <div className="h-6 w-3/4 skeleton-pulse" />
                <div className="h-3.5 w-full skeleton-pulse" />
                <div className="h-3.5 w-2/3 skeleton-pulse" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-6 text-center">
            <span className="font-display text-3xl md:text-4xl text-white/40 italic font-light">
              No matches found
            </span>
            <p className="text-white/40 text-sm font-light max-w-md">
              Try adjusting your filters or search query.
            </p>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="text-[10px] tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors duration-500 py-3 border-b border-white/20 hover:border-white/60"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              key={`${query}-${activeTag}-${activeYear}`}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-16 md:gap-y-20"
            >
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-20 md:mt-24 pt-12 border-t border-white/5 flex flex-col items-center gap-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                  Showing {String(visibleProjects.length).padStart(2, "0")} of{" "}
                  {String(filteredProjects.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() =>
                    setVisibleCount((c) => c + PROJECTS_PER_PAGE)
                  }
                  className="group inline-flex items-center gap-4 text-white/80 text-xs tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 py-4 border-b border-white/20 hover:border-white/60"
                >
                  Load More
                  <span className="text-white/30 font-mono text-[10px] tracking-[0.2em]">
                    [+
                    {Math.min(
                      PROJECTS_PER_PAGE,
                      filteredProjects.length - visibleCount
                    )}
                    ]
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Work;
