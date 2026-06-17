import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";

const ProjectCard = ({ project, index }) => {
  const dateLabel = project.project_date
    ? new Date(project.project_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : new Date(project.created_at).getFullYear();

  return (
    <div className="project-card group border-[3px] border-black hover:border-[5px] transition-all duration-100 bg-white">
      {/* Image */}
      <Link to={`/project/${project.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden border-b-[3px] border-black bg-[#F0F0F0]">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-4xl text-black/20">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Index badge */}
          <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-mono-rb text-xs">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* View indicator */}
          <div className="absolute bottom-0 right-0 bg-black text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono-rb text-xs text-black/50 uppercase tracking-widest">
            {dateLabel}
          </span>
          <div className="flex items-center gap-2">
            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="border-[2px] border-black p-1 hover:bg-black hover:text-white transition-colors duration-100"
                title="View Demo"
              >
                <ArrowUpRight size={12} />
              </a>
            )}
            {project.repo_link && (
              <a
                href={project.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="border-[2px] border-black p-1 hover:bg-black hover:text-white transition-colors duration-100"
                title="View Code"
              >
                <Github size={12} />
              </a>
            )}
          </div>
        </div>

        <Link to={`/project/${project.slug}`}>
          <h3 className="font-display text-black hover:underline" style={{ fontSize: "1.25rem", lineHeight: 1.1 }}>
            {project.title}
          </h3>
        </Link>

        <p className="text-sm text-black/60 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="chip-filter text-[9px] cursor-default">
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="chip-filter text-[9px] cursor-default bg-black text-white">
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
