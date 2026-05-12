import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profilePhoto from "@/assets/profile-photo.jpeg";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  const info = [
    { label: "Education", value: "Telkom University" },
    { label: "Major", value: "Informatics" },
    { label: "Location", value: "Bandung, ID" },
    { label: "Year", value: "2023 — Present" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title reveal
      gsap.fromTo(
        ".about-title-line",
        { y: 80, opacity: 0 },
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

      // Text paragraphs fade in
      gsap.fromTo(
        ".about-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".about-text-container",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Image expansion on scroll
      gsap.fromTo(
        imageContainerRef.current,
        { clipPath: "inset(20% 20% 20% 20%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: imageContainerRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Image parallax
      gsap.to(imageRef.current, {
        yPercent: -15,
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Info items stagger
      gsap.fromTo(
        ".about-info-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".about-info-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <div className="overflow-hidden">
            <span className="about-title-line block text-white/30 text-xs tracking-[0.5em] uppercase mb-4">
              About
            </span>
          </div>
          <div className="overflow-hidden">
            <h2 className="about-title-line font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.03em] text-white font-light max-w-4xl">
              An informatics student with a deep passion for building
              <span className="italic text-white/50"> meaningful </span>
              digital experiences.
            </h2>
          </div>
        </div>

        {/* Image + Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Expanding Image */}
          <div
            ref={imageContainerRef}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <img
              ref={imageRef}
              src={profilePhoto}
              alt="Jian Hazel Sitorus"
              className="w-full h-[120%] object-cover object-[center_20%] grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent" />
          </div>

          {/* Text Content */}
          <div className="about-text-container flex flex-col justify-center space-y-10 lg:pt-16">
            <p className="about-text text-white/70 text-lg md:text-xl leading-relaxed font-light">
              I'm an Informatics student with a strong passion for software
              development and AI. Always enthusiastic about learning new things
              and working on challenging projects.
            </p>
            <p className="about-text text-white/40 text-base md:text-lg leading-relaxed font-light">
              In my free time, I enjoy exploring the latest technologies,
              contributing to open source, and sharing knowledge with the
              developer community.
            </p>

            {/* Info Grid */}
            <div className="about-info-grid pt-10 border-t border-white/10">
              <div className="grid grid-cols-2 gap-8">
                {info.map((item) => (
                  <div key={item.label} className="about-info-item">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-2">
                      {item.label}
                    </span>
                    <p className="text-white/80 text-sm font-light">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
