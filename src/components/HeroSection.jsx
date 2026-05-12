import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profilePhoto from "@/assets/profile-photo.jpeg";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        overlayRef.current,
        { scaleY: 1 },
        { scaleY: 0, duration: 1.8, transformOrigin: "top" }
      )
        .fromTo(
          imageRef.current,
          { scale: 1.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2 },
          "-=1.2"
        )
        .fromTo(
          ".hero-line",
          { y: 120, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, stagger: 0.15 },
          "-=1.4"
        )
        .fromTo(
          subRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.4"
        );

      // Parallax on scroll
      gsap.to(imageRef.current, {
        yPercent: 20,
        scale: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(headingRef.current, {
        yPercent: -30,
        opacity: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "80% top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <img
          ref={imageRef}
          src={profilePhoto}
          alt="Jian Hazel Sitorus"
          className="w-full h-full object-cover object-[center_20%] opacity-0"
          style={{ filter: "brightness(0.35) contrast(1.1)" }}
        />
      </div>

      {/* Reveal Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-[#0a0a0a]"
        style={{ transformOrigin: "top" }}
      />

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none grain-texture" />

      {/* Content */}
      <div ref={headingRef} className="relative z-30 text-center px-6">
        <div className="overflow-hidden mb-2">
          <h1 className="hero-line font-display text-[clamp(3rem,12vw,10rem)] leading-[0.85] tracking-[-0.04em] text-white font-light">
            Jian Hazel
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line font-display text-[clamp(3rem,12vw,10rem)] leading-[0.85] tracking-[-0.04em] text-white/60 font-light italic">
            Sitorus
          </h1>
        </div>

        <div ref={subRef} className="mt-8 md:mt-12">
          <p className="text-white/50 text-sm md:text-base tracking-[0.3em] uppercase font-light">
            Software Developer &mdash; Informatics
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent scroll-line" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-20 pointer-events-none vignette" />
    </section>
  );
};

export default HeroSection;
