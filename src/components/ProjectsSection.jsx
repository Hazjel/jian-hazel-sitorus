import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -8,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const dateLabel = project.project_date
    ? new Date(project.project_date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : new Date(project.created_at).getFullYear();

  return (
    <div ref={cardRef} className="project-card group relative">
      {/* Project Image */}
      <Link to={`/project/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.02] border border-white/5 mb-7">
          {project.image_url ? (
            <img
              ref={imageRef}
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-[115%] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              style={{ filter: "brightness(0.85) contrast(1.05)" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px] tracking-[0.3em] uppercase">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

          {/* Project number */}
          <div className="absolute top-5 left-5 flex items-center gap-2.5">
            <span className="text-white/50 text-[10px] tracking-[0.3em] font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="w-6 h-px bg-white/30" />
          </div>

          {/* View link indicator */}
          <div className="absolute bottom-5 right-5 p-3 border border-white/20 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>
      </Link>

      {/* Project Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
            {dateLabel}
          </span>
          {/* External links */}
          <div className="flex items-center gap-3">
            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white/30 hover:text-white/80 transition-colors duration-500"
                title="View Demo"
              >
                <ArrowUpRight size={15} />
              </a>
            )}
            {project.repo_link && (
              <a
                href={project.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white/30 hover:text-white/80 transition-colors duration-500"
                title="View Code"
              >
                <Github size={14} />
              </a>
            )}
          </div>
        </div>

        <Link to={`/project/${project.slug}`} className="block">
          <h3 className="font-display text-2xl md:text-3xl font-light tracking-[-0.02em] text-white/95 group-hover:text-white transition-colors duration-500 leading-tight">
            {project.title}
          </h3>
        </Link>

        <p className="text-white/40 text-sm leading-[1.7] font-light line-clamp-2 max-w-lg">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.2em] uppercase text-white/35 px-2.5 py-1 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-32 md:py-40 lg:py-48 bg-[#0a0a0a]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 lg:mb-32 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="projects-title text-white/20 text-xs tracking-[0.4em] font-mono">
                03
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

          {!loading && projects.length > 0 && (
            <div className="projects-title text-white/30 text-[11px] tracking-[0.3em] uppercase">
              {String(projects.length).padStart(2, "0")} Total
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
            Loading...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
            No projects yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-14 gap-y-20 md:gap-y-24">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
