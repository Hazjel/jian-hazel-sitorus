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
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
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
        { clipPath: "inset(15% 15% 15% 15%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: imageContainerRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Image parallax
      gsap.to(imageRef.current, {
        yPercent: -12,
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
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
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
      className="relative py-32 md:py-40 lg:py-48 bg-[#0a0a0a]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 lg:mb-32">
          <div className="flex items-center gap-4 mb-6 overflow-hidden">
            <span className="about-title-line text-white/20 text-xs tracking-[0.4em] font-mono">
              01
            </span>
            <span className="about-title-line w-12 h-px bg-white/20" />
            <span className="about-title-line text-white/40 text-[11px] tracking-[0.4em] uppercase">
              About
            </span>
          </div>
          <div className="overflow-hidden">
            <h2 className="about-title-line font-display text-[clamp(2rem,5.5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-white font-light max-w-5xl">
              An informatics student with a deep passion for building
              <span className="italic text-white/50"> meaningful </span>
              digital experiences.
            </h2>
          </div>
        </div>

        {/* Image + Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 lg:gap-20 items-start">
          {/* Expanding Image */}
          <div className="lg:col-span-5">
            <div
              ref={imageContainerRef}
              className="relative aspect-[4/5] overflow-hidden group"
            >
              <img
                ref={imageRef}
                src={profilePhoto}
                alt="Jian Hazel Sitorus"
                className="absolute inset-0 w-full h-[120%] object-cover object-[center_20%] grayscale hover:grayscale-0 transition-all duration-[1500ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 via-transparent to-transparent" />

              {/* Hover accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-px bg-white/20" />
              <div className="absolute top-0 left-0 w-px h-8 bg-white/20" />
              <div className="absolute bottom-0 right-0 w-8 h-px bg-white/20" />
              <div className="absolute bottom-0 right-0 w-px h-8 bg-white/20" />
            </div>
            {/* Image caption */}
            <div className="mt-4 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-white/30">
              <span>Portrait</span>
              <span>— 2026</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="about-text-container lg:col-span-7 flex flex-col justify-start space-y-10 lg:pt-6">
            <p className="about-text text-white/80 text-xl md:text-2xl leading-[1.5] font-light tracking-[-0.01em]">
              I&apos;m an Informatics student with a strong passion for
              software development and AI. Always enthusiastic about learning
              new things and working on challenging projects.
            </p>
            <p className="about-text text-white/40 text-base md:text-lg leading-[1.7] font-light max-w-2xl">
              In my free time, I enjoy exploring the latest technologies,
              contributing to open source, and sharing knowledge with the
              developer community.
            </p>

            {/* Info Grid */}
            <div className="about-info-grid pt-12 mt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                {info.map((item) => (
                  <div key={item.label} className="about-info-item group">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-3 group-hover:text-white/50 transition-colors duration-500">
                      {item.label}
                    </span>
                    <p className="text-white/85 text-sm md:text-base font-light tracking-[-0.01em]">
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
