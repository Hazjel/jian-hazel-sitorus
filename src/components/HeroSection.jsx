import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const auroraRef = useRef(null);

  // Parallax mouse movement for aurora orbs
  const handleMouseMove = useCallback((e) => {
    if (!auroraRef.current) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 30;
    const y = (clientY / window.innerHeight - 0.5) * 30;

    const orbs = auroraRef.current.querySelectorAll(".aurora-orb");
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.4;
      gsap.to(orb, {
        x: x * depth,
        y: y * depth,
        duration: 1.2,
        ease: "power2.out",
      });
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Reveal overlay wipe
      tl.fromTo(
        overlayRef.current,
        { scaleY: 1 },
        { scaleY: 0, duration: 1.8, transformOrigin: "top" }
      )
        .fromTo(
          ".hero-gradient-bg",
          { opacity: 0 },
          { opacity: 1, duration: 2 },
          "-=1.4"
        )
        // Character-level stagger for name
        .fromTo(
          ".hero-char",
          { y: 120, opacity: 0, rotateX: -80 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.4,
            stagger: 0.03,
            ease: "power4.out",
          },
          "-=1.4"
        )
        .fromTo(
          ".hero-char-last",
          { y: 120, opacity: 0, rotateX: -80 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.4,
            stagger: 0.03,
            ease: "power4.out",
          },
          "-=1.1"
        )
        .fromTo(
          subRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          [".hero-top-marker", ".hero-side-label"],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 },
          "-=0.8"
        )
        .fromTo(
          ".hero-particle",
          { opacity: 0 },
          { opacity: 1, duration: 2, stagger: 0.05 },
          "-=1"
        )
        .fromTo(
          ".aurora-orb",
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2, stagger: 0.2, ease: "power2.out" },
          "-=2"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.4"
        );

      // Parallax heading on scroll
      gsap.to(headingRef.current, {
        yPercent: -30,
        opacity: 0.2,
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

  // Typing animation for subtitle
  useEffect(() => {
    const phrases = [
      "Software Enthusiast",
      "AI & DS Enthusiast",
      "Fullstack Developer",
      "Problem Solver",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const typedEl = document.querySelector(".hero-typed-text");
    const cursorEl = document.querySelector(".hero-typed-cursor");

    if (!typedEl || !cursorEl) return;

    gsap.to(cursorEl, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: "steps(1)",
    });

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        typedEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          timeout = setTimeout(type, 2500);
          return;
        }
        timeout = setTimeout(type, 80 + Math.random() * 40);
      } else {
        charIndex--;
        typedEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeout = setTimeout(type, 500);
          return;
        }
        timeout = setTimeout(type, 40 + Math.random() * 20);
      }
    };

    const startDelay = setTimeout(() => {
      type();
    }, 3200);

    return () => {
      clearTimeout(timeout);
      clearTimeout(startDelay);
    };
  }, []);

  // Split text into characters for stagger animation
  const splitText = (text, className = "hero-char") =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className={`${className} inline-block`}
        style={{
          transformStyle: "preserve-3d",
          display: char === " " ? "inline" : "inline-block",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Animated Gradient Background */}
      <div className="hero-gradient-bg absolute inset-0 z-0 opacity-0">
        <div className="absolute inset-0 hero-gradient-animate" />

        {/* Aurora Orbs with mouse-reactive parallax */}
        <div ref={auroraRef} className="absolute inset-0">
          <div className="aurora-orb absolute top-[15%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[#1a1040]/50 blur-[120px] animate-aurora-orb" />
          <div className="aurora-orb absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-[#0c1a2e]/60 blur-[100px] animate-aurora-orb-reverse" />
          <div className="aurora-orb absolute top-[40%] left-[55%] w-[25vw] h-[25vw] rounded-full bg-[#1c0a28]/40 blur-[80px] animate-float-slow" />
          {/* Subtle violet accent orb */}
          <div className="aurora-orb absolute top-[60%] left-[30%] w-[20vw] h-[20vw] rounded-full bg-[#2d1b4e]/20 blur-[100px] animate-float-slow-reverse" />
        </div>
      </div>

      {/* Floating Particles — more particles for depth */}
      <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle absolute rounded-full animate-particle-float"
            style={{
              left: `${8 + Math.random() * 84}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: i % 5 === 0
                ? "rgba(255, 255, 255, 0.25)"
                : i % 7 === 0
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(255, 255, 255, 0.2)",
            }}
          />
        ))}
      </div>

      {/* Reveal Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-[#0a0a0a]"
        style={{ transformOrigin: "top" }}
      />

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 z-20 opacity-[0.04] pointer-events-none grain-texture" />

      {/* Side Labels */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-6 opacity-0 hero-side-label">
        <span className="text-white/30 text-[10px] tracking-[0.5em] uppercase writing-mode-vertical">
          Portfolio &mdash; 2026
        </span>
      </div>

      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-6 opacity-0 hero-side-label">
        <span className="text-white/30 text-[10px] tracking-[0.5em] uppercase writing-mode-vertical">
          Bandung &mdash; Indonesia
        </span>
      </div>

      {/* Top Marker */}
      <div className="absolute top-28 md:top-32 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 opacity-0 hero-top-marker">
        <span className="w-8 h-px bg-white/30" />
        <span className="text-white/40 text-[10px] tracking-[0.5em] uppercase">
          Est. 2023
        </span>
        <span className="w-8 h-px bg-white/30" />
      </div>

      {/* Content */}
      <div ref={headingRef} className="relative z-30 text-center px-6 max-w-[90rem]">
        <div className="py-3 mb-1 md:mb-3" style={{ perspective: "1000px" }}>
          <h1 className="font-display text-[clamp(3rem,11vw,9rem)] leading-[1.1] tracking-[-0.03em] text-white font-light">
            {splitText("Jian Hazel")}
          </h1>
        </div>
        <div className="py-3" style={{ perspective: "1000px" }}>
          <h1 className="font-display text-[clamp(3rem,11vw,9rem)] leading-[1.1] tracking-[-0.03em] text-white/50 font-light italic">
            {splitText("Sitorus", "hero-char-last")}
          </h1>
        </div>

        <div ref={subRef} className="mt-10 md:mt-14 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-white/30" />
            <p className="text-white/60 text-[11px] md:text-xs tracking-[0.4em] uppercase font-light">
              <span className="hero-typed-text inline-block min-w-[12ch] text-center" />
              <span className="hero-typed-cursor inline-block w-px h-[1em] bg-white/60 ml-1 align-middle" />
            </p>
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-white/30" />
          </div>
          <p className="text-white/30 text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-light">
            Informatics &mdash; Telkom University
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
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
