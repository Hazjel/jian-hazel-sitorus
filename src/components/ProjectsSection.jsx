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
      // Card entrance
      gsap.fromTo(
        cardRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Image parallax within card
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -10,
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

  return (
    <div
      ref={cardRef}
      className="project-card group relative"
    >
      {/* Project Image */}
      {project.image_url && (
        <div className="relative aspect-[16/10] overflow-hidden mb-6">
          <img
            ref={imageRef}
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            className="w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-105"
            style={{ filter: "brightness(0.8) contrast(1.05)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Hover overlay links */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                title="View Demo"
              >
                <ArrowUpRight size={20} />
              </a>
            )}
            {project.repo_link && (
              <a
                href={project.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                title="View Code"
              >
                <Github size={20} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Project Info */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white/20 text-xs tracking-[0.3em] font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-white/30 text-xs tracking-widest uppercase">
              {project.project_date
                ? new Date(project.project_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : new Date(project.created_at).getFullYear()}
            </span>
          </div>
          <Link
            to={`/project/${project.slug}`}
            className="block"
          >
            <h3 className="text-white/90 text-xl md:text-2xl font-light tracking-[-0.02em] group-hover:text-white transition-colors duration-500">
              {project.title}
            </h3>
          </Link>
          <p className="text-white/40 text-sm leading-relaxed mt-3 max-w-lg font-light line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] tracking-[0.2em] uppercase text-white/30 px-3 py-1 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Separator */}
      <div className="mt-10 h-px bg-white/5" />
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
      className="relative py-32 md:py-48 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 md:mb-28">
          <span className="projects-title block text-white/30 text-xs tracking-[0.5em] uppercase mb-4">
            Selected Work
          </span>
          <h2 className="projects-title font-display text-[clamp(2rem,5vw,4rem)] leading-[1.1] tracking-[-0.03em] text-white font-light">
            Projects &amp; Experiments
          </h2>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-white/30 text-sm tracking-widest uppercase">
            Loading...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-white/30 text-sm tracking-widest uppercase">
            No projects found. Check back later.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
