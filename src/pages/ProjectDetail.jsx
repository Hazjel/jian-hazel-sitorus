import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { motion } from "framer-motion";

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
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
                <h1 className="text-2xl font-bold">Project Not Found</h1>
                <Link to="/">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-12">
                <Link to="/">
                    <Button variant="ghost" className="mb-8 hover:bg-transparent pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                    </Button>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid lg:grid-cols-2 gap-12"
                >
                    {/* Left Column: Image & Links */}
                    <div className="space-y-8">
                        <div className="aspect-video relative overflow-hidden rounded-lg border-2 border-foreground">
                            {project.image_url ? (
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    loading="lazy"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {project.demo_link && (
                                <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                                    <Button className="w-full h-12 text-lg gap-2 rounded-none border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-colors">
                                        Live Demo <ExternalLink className="w-5 h-5" />
                                    </Button>
                                </a>
                            )}
                            {project.repo_link && (
                                <a href={project.repo_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                                    <Button className="w-full h-12 text-lg gap-2 rounded-none border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-colors">
                                        Repository <Github className="w-5 h-5" />
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-display font-bold mb-4 leading-tight">{project.title}</h1>
                            <div className="flex items-center gap-4 text-muted-foreground font-mono">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(project.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold font-mono uppercase tracking-wider">About</h3>
                            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold font-mono uppercase tracking-wider">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags && project.tags.length > 0 ? (
                                    project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 border border-foreground text-sm font-mono uppercase tracking-wide hover:bg-accent hover:text-white transition-colors cursor-default"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground italic">No tags listed.</span>
                                )}
                            </div>
                        </div>

                        {project.documentation_urls && project.documentation_urls.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold font-mono uppercase tracking-wider">Documentation</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.documentation_urls.map((url, index) => {
                                        const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                                        return (
                                            <a
                                                key={index}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group relative overflow-hidden rounded-lg border-2 border-foreground hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                            >
                                                <div className="aspect-video bg-muted">
                                                    {isVideo ? (
                                                        <video
                                                            src={url}
                                                            controls
                                                            className="object-cover w-full h-full"
                                                        >
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        <img
                                                            src={url}
                                                            alt={`Documentation ${index + 1}`}
                                                            loading="lazy"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                                                        Open
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectDetail;
