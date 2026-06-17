import { useEffect, useRef } from "react";

const phrases = ["Software Enthusiast", "AI & Data Science Enthusiast", "Problem Solver"];

const HeroSection = () => {
  const typedTextRef = useRef(null);

  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const el = typedTextRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.textContent = phrases[0];
      return;
    }

    const type = () => {
      const current = phrases[phraseIndex];
      if (!isDeleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          timeout = setTimeout(type, 2400);
          return;
        }
        timeout = setTimeout(type, 80 + Math.random() * 40);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeout = setTimeout(type, 400);
          return;
        }
        timeout = setTimeout(type, 40 + Math.random() * 20);
      }
    };

    const start = setTimeout(type, 800);
    return () => { clearTimeout(timeout); clearTimeout(start); };
  }, []);

  return (
    <section
      id="home"
      className="scroll-mt-16 min-h-[100dvh] bg-white flex flex-col border-b-[3px] border-black"
    >
      {/* Top bar */}
      <div className="border-b-[3px] border-black mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between py-3">
            <span className="section-label">Portfolio — 2026</span>
            <span className="section-label">Est. 2023</span>
            <span className="section-label">Bandung, Indonesia</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-10 w-full py-16">
        {/* Name — massive Archivo Black */}
        <div className="mb-8">
          <h1
            className="font-display text-black leading-none"
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
          >
            JIAN HAZEL
          </h1>
          <h1
            className="font-display text-black leading-none"
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
          >
            SITORUS
          </h1>
        </div>

        {/* Thick rule */}
        <div className="border-t-[5px] border-black mb-8 w-full" />

        {/* Subtitle row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                ref={typedTextRef}
                className="font-mono-rb text-base md:text-lg text-black"
              />
              <span className="typed-cursor" />
            </div>
            <p className="text-sm text-black/60 font-body uppercase tracking-widest">
              Informatics · Telkom University
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-primary"
            >
              View Work
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-secondary"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between py-3">
            <span className="section-label">Scroll to explore</span>
            <span className="section-label font-mono-rb">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
