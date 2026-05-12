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
          [".hero-top-marker", ".hero-side-label"],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 },
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

    // Cursor blink animation
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

    // Start typing after hero animation completes
    const startDelay = setTimeout(() => {
      type();
    }, 3200);

    return () => {
      clearTimeout(timeout);
      clearTimeout(startDelay);
    };
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
          style={{ filter: "brightness(0.3) contrast(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
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
        <div className="overflow-hidden mb-1 md:mb-2">
          <h1 className="hero-line font-display text-[clamp(3.5rem,13vw,11rem)] leading-[0.9] tracking-[-0.04em] text-white font-light">
            Jian Hazel
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line font-display text-[clamp(3.5rem,13vw,11rem)] leading-[0.9] tracking-[-0.04em] text-white/50 font-light italic">
            Sitorus
          </h1>
        </div>

        <div ref={subRef} className="mt-10 md:mt-14 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <span className="w-10 h-px bg-white/30" />
            <p className="text-white/60 text-[11px] md:text-xs tracking-[0.4em] uppercase font-light">
              <span className="hero-typed-text inline-block min-w-[12ch] text-center" />
              <span className="hero-typed-cursor inline-block w-px h-[1em] bg-white/60 ml-1 align-middle" />
            </p>
            <span className="w-10 h-px bg-white/30" />
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
