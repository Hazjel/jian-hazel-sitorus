import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between py-4">
            <span className="font-display text-xl">JHS</span>
            <span className="section-label">Error — 404</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center border-b-[3px] border-black">
        {/* Giant 404 */}
        <div
          className="font-display text-black leading-none select-none mb-0"
          style={{ fontSize: "clamp(6rem, 25vw, 20rem)", lineHeight: 0.9 }}
        >
          404
        </div>

        {/* Thick rule */}
        <div className="w-full max-w-xl border-t-[5px] border-black my-8" />

        <h1 className="font-display text-black mb-4" style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}>
          Page Not Found
        </h1>
        <p className="text-black/60 text-base max-w-md leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center gap-4">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <Link to="/work" className="btn-secondary">
            Browse Work
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
        <div className="flex items-center justify-between py-4">
          <span className="section-label">
            Requested: <span className="font-mono-rb">{location.pathname}</span>
          </span>
          <span className="section-label">jian-hazel-sitorus.vercel.app</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
