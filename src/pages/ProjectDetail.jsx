import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowUpRight, Github, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const heroImageRef = useRef(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (loading || !project) return;

    const ctx = gsap.context(() => {
      // Hero reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".detail-meta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
      )
        .fromTo(
          ".detail-title-line",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 },
          "-=0.5"
        )
        .fromTo(
          ".detail-hero-image",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4 },
          "-=0.8"
        )
        .fromTo(
          ".detail-content",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          "-=0.6"
        );

      // Hero image parallax
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          yPercent: 15,
          scrollTrigger: {
            trigger: ".detail-hero-image",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Documentation reveals
      gsap.fromTo(
        ".detail-doc-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".detail-docs",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, project]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <span className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
          Loading...
        </span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] space-y-6 px-6 text-center">
        <span className="text-white/30 text-[11px] tracking-[0.4em] uppercase">
          Error &mdash; 404
        </span>
        <h1 className="font-display text-5xl md:text-6xl text-white/90 font-light tracking-[-0.03em]">
          Project Not Found
        </h1>
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-white/60 text-xs tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 py-3 border-b border-white/20 hover:border-white/60 group mt-4"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>
    );
  }

  const dateLabel = project.project_date
    ? new Date(project.project_date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : new Date(project.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0a0a0a] text-white cinematic-portfolio cursor-none md:cursor-none"
    >
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none grain-texture z-[1]" />

      {/* Back Nav */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-12 md:pt-16">
        <Link
          to="/"
          className="detail-meta inline-flex items-center gap-3 text-white/50 text-[11px] tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-2" />
          Back to Work
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-16 md:pt-24 pb-16 md:pb-24">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <span className="detail-meta flex items-center gap-2 text-white/40 text-[11px] tracking-[0.3em] uppercase">
            <Calendar className="w-3.5 h-3.5" />
            {dateLabel}
          </span>
          <span className="detail-meta w-8 h-px bg-white/20" />
          <span className="detail-meta text-white/40 text-[11px] tracking-[0.3em] uppercase">
            Project Detail
          </span>
        </div>

        {/* Title */}
        <div className="overflow-hidden mb-10 md:mb-14">
          <h1 className="detail-title-line font-display text-[clamp(2.5rem,8vw,7rem)] leading-[1] tracking-[-0.03em] text-white font-light">
            {project.title}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="detail-hero-image relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-white/[0.02] border border-white/5 mb-16 md:mb-20">
          {project.image_url ? (
            <img
              ref={heroImageRef}
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-[120%] object-cover"
              style={{ filter: "brightness(0.9) contrast(1.05)" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[11px] tracking-[0.3em] uppercase">
              No Image Available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent" />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 md:gap-16 lg:gap-20">
          {/* Description */}
          <div className="detail-content lg:col-span-7 space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-white/20 text-xs tracking-[0.4em] font-mono">
                01
              </span>
              <span className="w-12 h-px bg-white/20" />
              <span className="text-white/40 text-[11px] tracking-[0.4em] uppercase">
                Overview
              </span>
            </div>
            <p className="text-white/80 text-lg md:text-xl leading-[1.7] font-light whitespace-pre-wrap tracking-[-0.01em]">
              {project.description}
            </p>
          </div>

          {/* Sidebar */}
          <div className="detail-content lg:col-span-5 space-y-10">
            {/* Technologies */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-5">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] tracking-[0.2em] uppercase text-white/60 px-3 py-1.5 border border-white/10 hover:border-white/40 hover:text-white/90 transition-all duration-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="space-y-4 pt-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-5">
                Links
              </span>
              {project.demo_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 border-t border-white/10 hover:border-white/40 transition-colors duration-500"
                >
                  <span className="text-white/80 text-sm tracking-[0.15em] uppercase group-hover:text-white transition-colors duration-500">
                    Live Demo
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                </a>
              )}
              {project.repo_link && (
                <a
                  href={project.repo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 border-t border-white/10 hover:border-white/40 transition-colors duration-500"
                >
                  <span className="text-white/80 text-sm tracking-[0.15em] uppercase group-hover:text-white transition-colors duration-500">
                    Repository
                  </span>
                  <Github className="w-4 h-4 text-white/40 group-hover:text-white transition-colors duration-500" />
                </a>
              )}
              {!project.demo_link && !project.repo_link && (
                <p className="text-white/30 text-xs tracking-wider italic">
                  No links available.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Documentation */}
      {project.documentation_urls && project.documentation_urls.length > 0 && (
        <section className="detail-docs max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 border-t border-white/5">
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="text-white/20 text-xs tracking-[0.4em] font-mono">
              02
            </span>
            <span className="w-12 h-px bg-white/20" />
            <span className="text-white/40 text-[11px] tracking-[0.4em] uppercase">
              Documentation
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {project.documentation_urls.map((url, index) => {
              const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-doc-item group relative block aspect-video bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/20 transition-colors duration-500"
                >
                  {isVideo ? (
                    <video
                      src={url}
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={url}
                      alt={`Documentation ${index + 1}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="text-white/70 text-[10px] tracking-[0.3em] font-mono">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom spacing */}
      <div className="h-32" />
    </div>
  );
};

export default ProjectDetail;
