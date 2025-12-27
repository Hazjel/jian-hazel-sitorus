import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import profilePhoto from "@/assets/profile-photo.jpeg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const info = [
    { label: "Education", value: "Telkom University" },
    { label: "Major", value: "Informatics" },
    { label: "Location", value: "Bandung, ID" },
    { label: "Year", value: "2023 — Present" },
  ];

  return (
    <section id="about" className="py-24 border-b-2 border-foreground" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Section Label */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-accent font-mono text-sm">02</span>
              <h2 className="text-headline mt-2">About</h2>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="aspect-[4/5] bg-muted overflow-hidden border-2 border-foreground">
                    <img
                      src={profilePhoto}
                      alt="Jian Hazel Sitorus"
                      className="w-full h-full object-cover object-[center_20%] grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent -z-10" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-8"
              >
                <p className="text-lg leading-relaxed">
                  I'm an Informatics student with a strong passion for software development 
                  and AI. Always enthusiastic about learning new things and working on
                  challenging projects.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  In my free time, I enjoy exploring the latest technologies,
                  contributing to open source, and sharing knowledge with the
                  developer community.
                </p>

                <div className="pt-8 border-t-2 border-foreground">
                  <div className="grid grid-cols-2 gap-6">
                    {info.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      >
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </span>
                        <p className="font-medium mt-1">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
