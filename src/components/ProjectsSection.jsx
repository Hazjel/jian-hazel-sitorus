import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProjectCard = ({ project, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group border-t-2 border-foreground pt-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-accent font-mono text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.image_url && (
            <img
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              className="w-16 h-10 object-cover rounded border border-border"
            />
          )}
        </div>
        <span className="text-muted-foreground font-mono text-sm">
          {project.project_date ? new Date(project.project_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(project.created_at).getFullYear()}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link to={`/project/${project.slug}`} className="block group-hover:opacity-70 transition-opacity">
            <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono uppercase tracking-wide px-2 py-1 border border-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {project.demo_link && (
            <motion.a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="View Demo"
            >
              <ArrowUpRight size={20} />
            </motion.a>
          )}
          {project.repo_link && (
            <motion.a
              href={project.repo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="View Code"
            >
              <Github size={20} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 border-b-2 border-foreground min-h-[50vh]" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Section Label */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-accent font-mono text-sm">04</span>
              <h2 className="text-headline mt-2">Projects</h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Selected works and experiments.
              </p>
            </motion.div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-9 space-y-12">
            {loading ? (
              <div className="text-center text-muted-foreground py-10">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No projects found. Check back later!
              </div>
            ) : (
              projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isInView={isInView}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
