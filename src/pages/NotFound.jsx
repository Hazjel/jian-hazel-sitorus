import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";

const NotFound = () => {
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".nf-glitch",
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, stagger: 0.15 }
      )
        .fromTo(
          ".nf-text",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          "-=0.6"
        )
        .fromTo(
          ".nf-link",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden relative"
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none grain-texture" />
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Aurora accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[#1a0a2e]/20 blur-[150px] animate-float-slow pointer-events-none" />

      <div className="text-center relative z-10 px-6">
        <p className="nf-text text-white/30 text-[11px] tracking-[0.4em] uppercase mb-8">
          Error &mdash; 404
        </p>

        <h1
          className="nf-glitch glitch-text font-display text-[clamp(5rem,18vw,14rem)] leading-[0.9] tracking-[-0.04em] text-white/90 font-light mb-4"
          data-text="Lost"
        >
          Lost
        </h1>
        <h1
          className="nf-glitch glitch-text font-display text-[clamp(5rem,18vw,14rem)] leading-[0.9] tracking-[-0.04em] text-white/40 font-light italic mb-12"
          data-text="in space"
        >
          in space
        </h1>

        <p className="nf-text text-white/50 text-base md:text-lg font-light max-w-md mx-auto mb-12 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          to="/"
          className="nf-link inline-flex items-center gap-3 text-white/70 text-xs tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 py-3 border-b border-white/20 hover:border-white/60 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-2" />
          Back to Home
        </Link>

        {/* Decorative 404 in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(15rem,40vw,30rem)] font-light text-white/[0.015] select-none pointer-events-none leading-none">
          404
        </div>
      </div>
    </div>
  );
};

export default NotFound;
