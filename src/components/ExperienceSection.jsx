import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const TYPE_LABELS = {
    internship: "Internship",
    organization: "Organization",
    committee: "Committee",
};

const ExperienceSection = () => {
    const sectionRef = useRef(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const { data, error } = await supabase
                    .from("experiences")
                    .select("*")
                    .order("sort_order", { ascending: true })
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setExperiences(data || []);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (prefersReduced) {
                gsap.set([".exp-title", ".exp-item"], { opacity: 1, y: 0, x: 0 });
                return;
            }

            gsap.fromTo(
                ".exp-title",
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none none",
                    },
                }
            );

            gsap.fromTo(
                ".exp-item",
                { x: -24, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: ".exp-timeline",
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [loading]);

    if (loading || experiences.length === 0) return null;

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="scroll-mt-20 relative py-32 md:py-40 lg:py-48 bg-[#0a0a0a]"
        >
            <div className="absolute top-0 left-0 w-full h-px section-divider" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
                {/* Section Header */}
                <div className="mb-20 md:mb-28 lg:mb-32">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="exp-title text-white/20 text-xs tracking-[0.4em] font-mono">
                            02
                        </span>
                        <span className="exp-title w-12 h-px bg-white/20" />
                        <span className="exp-title text-white/40 text-[11px] tracking-[0.4em] uppercase">
                            Experience
                        </span>
                    </div>
                    <h2 className="exp-title font-display text-[clamp(2rem,5.5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-white font-light max-w-4xl">
                        Where I&apos;ve
                        <span className="italic text-white/50"> contributed</span>
                    </h2>
                </div>

                {/* Timeline */}
                <div className="exp-timeline relative">
                    {/* Vertical line */}
                    <div className="absolute left-0 md:left-[200px] top-0 bottom-0 w-px bg-white/8 hidden md:block" />

                    <div className="space-y-0">
                        {experiences.map((exp, index) => (
                            <div
                                key={exp.id}
                                className="exp-item relative grid md:grid-cols-[200px_1fr] gap-6 md:gap-12 pb-14 md:pb-16 last:pb-0 group"
                            >
                                {/* Timeline dot */}
                                <div className="hidden md:block absolute left-[196px] top-1.5 w-[9px] h-[9px] border border-white/30 rotate-45 bg-[#070707] group-hover:border-white/60 transition-colors duration-500" />

                                {/* Left: period */}
                                <div className="md:text-right md:pr-10 pt-0.5 shrink-0">
                                    <span className="text-white/30 text-[11px] tracking-[0.25em] uppercase font-light">
                                        {exp.period_start || ""}
                                        {(exp.period_end || exp.is_current) && (
                                            <>
                                                {" "}—{" "}
                                                {exp.is_current ? (
                                                    <span className="text-emerald-400/70">Present</span>
                                                ) : (
                                                    exp.period_end
                                                )}
                                            </>
                                        )}
                                    </span>
                                </div>

                                {/* Right: content */}
                                <div className="pl-0 md:pl-10">
                                    <div className="flex items-start gap-3 flex-wrap mb-2">
                                        <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-white/25 border border-white/10 px-2 py-0.5 mt-0.5">
                                            {TYPE_LABELS[exp.type] ?? exp.type}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-light text-lg md:text-xl tracking-[-0.02em] leading-snug mb-1">
                                        {exp.role}
                                    </h3>
                                    <p className="text-white/45 text-sm tracking-[0.1em] mb-4 uppercase font-light">
                                        {exp.organization}
                                    </p>
                                    {exp.description && (
                                        <p className="text-white/40 text-sm md:text-base leading-[1.7] font-light max-w-2xl">
                                            {exp.description}
                                        </p>
                                    )}
                                    {/* Bottom separator (not on last) */}
                                    {index < experiences.length - 1 && (
                                        <div className="mt-12 md:mt-14 w-full h-px bg-white/5" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
