import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
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
    tags: ["React", "JavaScript", "Firebase"],
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

const ProjectCard = ({ project, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 ${
        project.featured ? "md:col-span-2" : ""
      }`}
      style={{
        boxShadow: isHovered
          ? "0 25px 50px -12px hsl(0 0% 0% / 0.4)"
          : "0 0 0 0 transparent",
      }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 100% / 0.1), transparent, hsl(0 0% 100% / 0.1))",
          padding: "1px",
        }}
      />

      <div className="p-6 md:p-8 relative">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="p-3 rounded-lg bg-secondary"
            animate={{ rotate: isHovered ? 10 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Folder className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="flex gap-3">
            <motion.a
              href={project.github}
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href={project.demo}
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ExternalLink size={20} />
            </motion.a>
          </div>
        </div>

        <motion.h3
          className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {project.title}
        </motion.h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + tagIndex * 0.05 }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground cursor-default hover:bg-secondary/80 hover:text-foreground transition-colors"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Hover gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

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
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="text-primary font-medium text-sm uppercase tracking-wider"
          >
            Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold mt-2"
          >
            Recent Projects
          </motion.h2>
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
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/50 text-foreground hover:bg-primary/10 btn-press"
            >
              View All Projects
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
