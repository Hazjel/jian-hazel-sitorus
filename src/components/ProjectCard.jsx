import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Spotlight hover tracking
  const handleMouseMove = useCallback((e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    imageContainerRef.current.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );
    imageContainerRef.current.style.setProperty(
      "--mouse-y",
      `${e.clientY - rect.top}px`
    );
  }, []);

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
        <div
          ref={imageContainerRef}
          className="spotlight-card relative aspect-video overflow-hidden bg-white/[0.02] border border-white/5 mb-7 transition-all duration-700 group-hover:border-white/15"
          onMouseMove={handleMouseMove}
        >
          {project.image_url ? (
            <img
              ref={imageRef}
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-[110%] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              style={{ filter: "brightness(0.9) contrast(1.05)" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                  <span className="text-white/15 text-2xl font-display italic">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
                  No Image
                </span>
              </div>
            </div>
          )}
          {/* Gradient overlay with violet tint on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent opacity-40 group-hover:opacity-30 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f15]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Project number */}
          <div className="absolute top-5 left-5 flex items-center gap-2.5">
            <span className="text-white/50 text-[10px] tracking-[0.3em] font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="w-6 h-px bg-white/30" />
          </div>

          {/* View link indicator */}
          <div className="absolute bottom-5 right-5 p-3 border border-white/20 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight size={14} className="text-white" />
          </div>

          {/* Hover accent line */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
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

        {/* Tags with enhanced styling */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.2em] uppercase text-white/35 px-2.5 py-1 border border-white/10 hover:border-white/25 hover:text-white/50 transition-all duration-500"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/20 px-2.5 py-1">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
