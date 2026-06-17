import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TYPE_LABELS = {
  internship: "Internship",
  organization: "Organization",
  committee: "Committee",
};

const TYPE_COLORS = {
  internship: "text-[#008000] border-[#008000]",
  organization: "text-black border-black",
  committee: "text-[#FFA500] border-[#FFA500]",
};

const ExperienceSection = () => {
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
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading || experiences.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-16 bg-white border-b-[3px] border-black">
      {/* Section header */}
      <div className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 py-4">
            <span className="section-label">02</span>
            <div className="w-8 border-t-[3px] border-black/30" />
            <span className="section-label">Experience</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h2 className="font-display text-black mb-16">
          Where I've Contributed
        </h2>

        {/* Timeline */}
        <div className="border-l-[5px] border-black ml-0 md:ml-8 space-y-0">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 md:pl-12 pb-12 last:pb-0">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-[3px] border-black" />

              <div className="card-raw hover:border-[5px] transition-all duration-100">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`chip-status ${TYPE_COLORS[exp.type] ?? "text-black border-black"}`}>
                      {TYPE_LABELS[exp.type] ?? exp.type}
                    </span>
                    {exp.is_current && (
                      <span className="chip-status text-[#008000] border-[#008000]">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="font-mono-rb text-xs text-black/50">
                    {exp.period_start || ""}
                    {(exp.period_end || exp.is_current) && (
                      <> — {exp.is_current ? "Present" : exp.period_end}</>
                    )}
                  </span>
                </div>

                <h3 className="font-display text-black mb-1" style={{ fontSize: "1.25rem" }}>
                  {exp.role}
                </h3>
                <p className="font-mono-rb text-sm text-black/60 uppercase tracking-wide mb-3">
                  {exp.organization}
                </p>
                {exp.description && (
                  <p className="text-sm text-black/70 leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                )}
              </div>

              {index < experiences.length - 1 && <div className="h-6" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
