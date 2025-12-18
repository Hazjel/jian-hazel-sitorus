import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "./ui/button";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "Online marketplace with shopping cart, payment integration, and product management features. Built with React and Node.js.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    title: "Task Management App",
    description:
      "Task management application with drag-and-drop functionality, reminders, and team collaboration features.",
    tags: ["React", "TypeScript", "Firebase"],
    github: "#",
    demo: "#",
    featured: true,
  },
  {
    title: "Weather Dashboard",
    description:
      "Real-time weather dashboard with data visualization and 7-day forecast predictions.",
    tags: ["Vue.js", "Chart.js", "OpenWeather API"],
    github: "#",
    demo: "#",
    featured: false,
  },
  {
    title: "Portfolio Website",
    description:
      "Personal portfolio website with smooth animations and responsive design.",
    tags: ["React", "Framer Motion", "Tailwind"],
    github: "#",
    demo: "#",
    featured: false,
  },
];

const ProjectCard = ({
  project,
  index,
  isInView,
}: {
  project: (typeof projects)[0];
  index: number;
  isInView: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className={`group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 ${
      project.featured ? "md:col-span-2" : ""
    }`}
  >
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-secondary">
          <Folder className="w-6 h-6 text-primary" />
        </div>
        <div className="flex gap-3">
          <a
            href={project.github}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href={project.demo}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </div>

      <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </motion.div>
);

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
            Recent Projects
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-primary/50 text-foreground hover:bg-primary/10"
          >
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
