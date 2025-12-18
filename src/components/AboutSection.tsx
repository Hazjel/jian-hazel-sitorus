import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpeg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            About Me
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
            Get to Know Me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden gradient-border">
              <img 
                src={profilePhoto} 
                alt="Jian Hazel Sitorus" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              I'm an Informatics student at Telkom University
              with a strong passion for software development and AI.
              Always enthusiastic about learning new things and working on
              challenging projects.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              In my free time, I enjoy exploring the latest technologies,
              contributing to open source, and sharing knowledge with the
              developer community.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: GraduationCap,
                  label: "Telkom University",
                  sub: "Informatics",
                },
                {
                  icon: MapPin,
                  label: "Bandung, Indonesia",
                  sub: "Location",
                },
                {
                  icon: Calendar,
                  label: "2023 - Present",
                  sub: "Enrollment Year",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
