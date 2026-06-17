import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";
import Navbar from "@/components/Navbar";

const PROJECTS_PER_PAGE = 9;

const Work = () => {
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
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
    return { allTags: Array.from(tags).sort(), allYears: Array.from(years).sort((a, b) => b - a) };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        const hay = [p.title, p.description, ...(p.tags || [])].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (activeTag !== "all" && (!p.tags || !p.tags.includes(activeTag))) return false;
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
  const hasActiveFilter = query !== "" || activeTag !== "all" || activeYear !== "all";

  const handleFilterChange = (fn) => { setVisibleCount(PROJECTS_PER_PAGE); fn(); };
  const clearFilters = () => { setQuery(""); setActiveTag("all"); setActiveYear("all"); setVisibleCount(PROJECTS_PER_PAGE); };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Back nav + header */}
      <div className="pt-16 border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="inline-flex items-center gap-2 btn-ghost text-sm">
              <ArrowLeft size={14} />
              Back to Home
            </Link>
            <span className="section-label">Archive</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono-rb text-xs text-black/40">All Works</span>
          </div>
          <h1 className="font-display text-black mb-6" style={{ fontSize: "clamp(2rem, 7vw, 5rem)", lineHeight: 1.0 }}>
            Every Project, Every Experiment.
          </h1>
          <p className="text-black/60 text-base max-w-2xl leading-relaxed">
            A complete index of everything I've built. Browse by tag, filter by year, or search for something specific.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* Search */}
          <div className="flex items-center gap-3 border-b-[3px] border-black py-4">
            <span className="label-raw text-xs text-black/40 shrink-0">Search</span>
            <div className="w-px h-5 bg-black/20" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleFilterChange(() => setQuery(e.target.value))}
              placeholder="Search projects..."
              className="flex-1 bg-transparent text-black text-sm placeholder:text-black/30 focus:outline-none font-body"
            />
            {query && (
              <button
                onClick={() => handleFilterChange(() => setQuery(""))}
                className="border-[2px] border-black p-1 hover:bg-black hover:text-white transition-colors duration-100"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Year filter */}
          {allYears.length > 0 && (
            <div className="flex items-center gap-0 border-b-[3px] border-black">
              <span className="label-raw text-xs text-black/40 px-0 py-4 pr-4 border-r-[3px] border-black shrink-0">
                Year
              </span>
              <div className="flex flex-wrap gap-0">
                <button
                  onClick={() => handleFilterChange(() => setActiveYear("all"))}
                  className={`chip-filter border-0 border-l-[3px] border-black rounded-none ${activeYear === "all" ? "active" : ""}`}
                >
                  All
                </button>
                {allYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleFilterChange(() => setActiveYear(String(year)))}
                    className={`chip-filter border-0 border-l-[3px] border-black rounded-none ${activeYear === String(year) ? "active" : ""}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="flex items-start gap-0 border-b-[3px] border-black">
              <span className="label-raw text-xs text-black/40 px-0 py-4 pr-4 border-r-[3px] border-black shrink-0">
                Tags
              </span>
              <div className="flex flex-wrap gap-0">
                <button
                  onClick={() => handleFilterChange(() => setActiveTag("all"))}
                  className={`chip-filter border-0 border-l-[3px] border-black rounded-none ${activeTag === "all" ? "active" : ""}`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleFilterChange(() => setActiveTag(tag))}
                    className={`chip-filter border-0 border-l-[3px] border-black rounded-none ${activeTag === tag ? "active" : ""}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result count */}
          <div className="flex items-center justify-between py-4">
            <span className="font-mono-rb text-xs text-black/50 uppercase tracking-widest">
              {filteredProjects.length === 0
                ? "No results"
                : `${String(filteredProjects.length).padStart(2, "0")} ${filteredProjects.length === 1 ? "Result" : "Results"}`}
            </span>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 font-mono-rb text-xs text-black/50 hover:text-black uppercase tracking-widest transition-colors duration-100"
              >
                Clear filters <X size={10} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-[3px] border-black animate-pulse">
                <div className="aspect-video bg-[#F0F0F0]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-[#F0F0F0] w-20" />
                  <div className="h-6 bg-[#F0F0F0] w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-6 text-center border-[3px] border-black p-12">
            <h2 className="font-display text-black" style={{ fontSize: "2rem" }}>
              No Matches Found
            </h2>
            <p className="text-black/60 text-sm max-w-md">
              Try adjusting your filters or search query.
            </p>
            {hasActiveFilter && (
              <button onClick={clearFilters} className="btn-secondary mt-4">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 pt-8 border-t-[3px] border-black flex flex-col items-center gap-4">
                <span className="font-mono-rb text-xs text-black/50 uppercase tracking-widest">
                  Showing {String(visibleProjects.length).padStart(2, "0")} of {String(filteredProjects.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setVisibleCount((c) => c + PROJECTS_PER_PAGE)}
                  className="btn-secondary"
                >
                  Load More
                  <span className="font-mono-rb text-xs ml-2">
                    [+{Math.min(PROJECTS_PER_PAGE, filteredProjects.length - visibleCount)}]
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
