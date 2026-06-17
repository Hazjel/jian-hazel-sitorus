import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const HOME_PROJECTS_LIMIT = 6;

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch limited projects + total count in parallel
        const [projectsResult, countResult] = await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(HOME_PROJECTS_LIMIT),
          supabase
            .from("projects")
            .select("*", { count: "exact", head: true }),
        ]);

        if (projectsResult.error) throw projectsResult.error;

        setProjects(projectsResult.data || []);
        setTotalCount(countResult.count || 0);
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
        ".projects-title",
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

      // View All CTA reveal — only if element exists
      if (document.querySelector(".projects-cta")) {
        gsap.fromTo(
          ".projects-cta",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".projects-cta",
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  const hasMore = totalCount > projects.length;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="scroll-mt-20 relative py-32 md:py-40 lg:py-48 bg-[#0a0a0a]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 lg:mb-32 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="projects-title text-white/20 text-xs tracking-[0.4em] font-mono">
                04
              </span>
              <span className="projects-title w-12 h-px bg-white/20" />
              <span className="projects-title text-white/40 text-[11px] tracking-[0.4em] uppercase">
                Selected Work
              </span>
            </div>
            <h2 className="projects-title font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.03em] text-white font-light">
              Projects &amp;
              <span className="italic text-white/50"> Experiments</span>
            </h2>
          </div>

          {!loading && totalCount > 0 && (
            <div className="projects-title text-white/30 text-[11px] tracking-[0.3em] uppercase">
              Showing {String(projects.length).padStart(2, "0")}
              <span className="text-white/20"> / {String(totalCount).padStart(2, "0")}</span>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-14 gap-y-20 md:gap-y-24">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video skeleton-pulse" />
                <div className="h-3 w-20 skeleton-pulse" />
                <div className="h-6 w-3/4 skeleton-pulse" />
                <div className="h-4 w-full skeleton-pulse" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
            No projects yet.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-14 gap-y-20 md:gap-y-24">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* View All CTA */}
            {hasMore && (
              <div className="projects-cta mt-20 md:mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <p className="text-white/40 text-sm md:text-base font-light max-w-md leading-relaxed">
                  Explore the complete archive of works, experiments, and
                  ongoing projects.
                </p>
                <Link
                  to="/work"
                  className="group inline-flex items-center gap-4 text-white/80 text-xs tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 py-4 border-b border-white/20 hover:border-violet-400/30"
                >
                  View All Work
                  <span className="text-white/30 font-mono text-[10px] tracking-[0.2em]">
                    [{String(totalCount).padStart(2, "0")}]
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
