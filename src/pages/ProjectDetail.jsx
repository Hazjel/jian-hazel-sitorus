import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import Navbar from "@/components/Navbar";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="font-mono-rb text-xs text-black/40 uppercase tracking-widest">
          Loading...
        </span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <span className="font-mono-rb text-xs text-black/40 uppercase tracking-widest mb-6">
          Error — 404
        </span>
        <h1 className="font-display text-black mb-8" style={{ fontSize: "clamp(2rem,6vw,4rem)" }}>
          Project Not Found
        </h1>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>
    );
  }

  const dateLabel = project.project_date
    ? new Date(project.project_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : new Date(project.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Back nav */}
      <div className="pt-16 border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="inline-flex items-center gap-2 btn-ghost text-sm">
              <ArrowLeft size={14} />
              Back to Work
            </Link>
            <span className="font-mono-rb text-xs text-black/40 uppercase tracking-widest">
              Project Detail
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="font-mono-rb text-xs text-black/50 uppercase tracking-widest">
              {dateLabel}
            </span>
            <span className="w-8 border-t-[3px] border-black/20" />
            <span className="font-mono-rb text-xs text-black/50 uppercase tracking-widest">
              {project.tags?.[0] || "Project"}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-black mb-10" style={{ fontSize: "clamp(2rem, 7vw, 5rem)", lineHeight: 1.0 }}>
            {project.title}
          </h1>

          {/* Hero image */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] border-[5px] border-black overflow-hidden bg-[#F0F0F0]">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-6xl text-black/10">
                  {project.title?.[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Description */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono-rb text-xs text-black/40">01</span>
                <div className="w-8 border-t-[3px] border-black/20" />
                <span className="section-label">Overview</span>
              </div>
              <p className="text-lg md:text-xl text-black leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-8">
              {/* Technologies */}
              {project.tags && project.tags.length > 0 && (
                <div className="card-raw">
                  <p className="label-raw text-xs mb-4 text-black/50">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="chip-filter cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="border-[3px] border-black">
                <div className="px-5 py-3 border-b-[3px] border-black">
                  <p className="label-raw text-xs text-black/50">Links</p>
                </div>
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-4 border-b-[3px] border-black last:border-b-0 hover:bg-black hover:text-white group transition-colors duration-100"
                  >
                    <span className="font-body text-sm font-semibold uppercase tracking-widest">
                      Live Demo
                    </span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {project.repo_link && (
                  <a
                    href={project.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-4 border-b-[3px] border-black last:border-b-0 hover:bg-black hover:text-white group transition-colors duration-100"
                  >
                    <span className="font-body text-sm font-semibold uppercase tracking-widest">
                      Repository
                    </span>
                    <Github size={14} />
                  </a>
                )}
                {!project.demo_link && !project.repo_link && (
                  <div className="px-5 py-4">
                    <p className="font-mono-rb text-xs text-black/40">No links available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation */}
      {project.documentation_urls && project.documentation_urls.length > 0 && (
        <section className="border-b-[3px] border-black">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-10">
              <span className="font-mono-rb text-xs text-black/40">02</span>
              <div className="w-8 border-t-[3px] border-black/20" />
              <span className="section-label">Documentation</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {project.documentation_urls.map((url, index) => {
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-video border-[3px] border-black overflow-hidden hover:border-[5px] transition-all duration-100 bg-[#F0F0F0]"
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
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-mono-rb text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer nav */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <Link to="/" className="inline-flex items-center gap-2 btn-secondary">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetail;
