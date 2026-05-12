import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none grain-texture" />
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="text-center relative z-10 px-6">
        <p className="text-white/30 text-[11px] tracking-[0.4em] uppercase mb-8">
          Error &mdash; 404
        </p>

        <h1 className="font-display text-[clamp(5rem,18vw,14rem)] leading-[0.9] tracking-[-0.04em] text-white/90 font-light mb-4">
          Lost
        </h1>
        <h1 className="font-display text-[clamp(5rem,18vw,14rem)] leading-[0.9] tracking-[-0.04em] text-white/40 font-light italic mb-12">
          in space
        </h1>

        <p className="text-white/50 text-base md:text-lg font-light max-w-md mx-auto mb-12 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 text-white/70 text-xs tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 py-3 border-b border-white/20 hover:border-white/60 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
