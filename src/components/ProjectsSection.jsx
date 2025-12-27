import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    num: "01",
    title: "Marketplace",
    description: "Online marketplace platform with shopping cart, product management, and user authentication.",
    tags: ["Laravel", "Vue", "PHP", "MySQL"],
    year: "2025",
    github: "https://github.com/Hazjel/marketplace",
    demo: null,
  },
  {
    num: "02",
    title: "Insurance Cost Prediction",
    description: "Machine learning model for predicting insurance costs based on various factors.",
    tags: ["Python", "Machine Learning", "Scikit-learn"],
    year: "2025",
    github: "https://github.com/Hazjel/insurance-cost-prediction",
    demo: null,
  },
  {
    num: "03",
    title: "Task Management App",
    description: "Task management with drag-and-drop functionality and team collaboration.",
    tags: ["React", "Firebase"],
    year: "2024",
    github: "#",
    demo: null,
  },
  {
    num: "04",
    title: "Weather Dashboard",
    description: "Real-time weather dashboard with data visualization and forecasts.",
    tags: ["Vue.js", "Chart.js"],
    year: "2023",
    github: "#",
    demo: null,
  },
  {
    num: "05",
    title: "Portfolio Website",
    description: "Personal portfolio with Swiss design principles and smooth animations.",
    tags: ["React", "Tailwind"],
    year: "2024",
    github: "#",
    demo: null,
  },
];

const ProjectCard = ({ project, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group border-t-2 border-foreground pt-6"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-accent font-mono text-sm">{project.num}</span>
        <span className="text-muted-foreground font-mono text-sm">{project.year}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono uppercase tracking-wide px-2 py-1 border border-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {project.github && project.github !== "#" && (
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="View on GitHub"
          >
            <ArrowUpRight size={20} />
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 border-b-2 border-foreground" ref={ref}>
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
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
