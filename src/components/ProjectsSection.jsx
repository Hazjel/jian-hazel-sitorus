import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "./ProjectCard";

const HOME_PROJECTS_LIMIT = 6;

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const hasMore = totalCount > projects.length;

  return (
    <section id="projects" className="scroll-mt-16 bg-white border-b-[3px] border-black">
      {/* Section header */}
      <div className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <span className="section-label">04</span>
              <div className="w-8 border-t-[3px] border-black/30" />
              <span className="section-label">Selected Work</span>
            </div>
            {!loading && totalCount > 0 && (
              <span className="font-mono-rb text-xs text-black/50">
                {String(projects.length).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h2 className="font-display text-black mb-16">
          Projects & Experiments
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-l-[3px] border-t-[3px] border-black">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-r-[3px] border-b-[3px] border-black">
                <div className="aspect-video bg-[#F0F0F0] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-[#F0F0F0] animate-pulse w-20" />
                  <div className="h-6 bg-[#F0F0F0] animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="section-label">No projects yet.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 pt-8 border-t-[3px] border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <p className="text-black/60 text-sm max-w-md">
                  Explore the complete archive of works, experiments, and ongoing projects.
                </p>
                <Link to="/work" className="btn-primary">
                  View All Work
                  <span className="font-mono-rb text-xs">
                    [{String(totalCount).padStart(2, "0")}]
                  </span>
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
