import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import gsap from "gsap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([".login-card", ".login-field"], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".login-card",
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2 }
      ).fromTo(
        ".login-field",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Login successful!");
        navigate("/admin");
      }
    } catch (error) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none grain-texture" />
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[#111118]/30 blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-[#0c1a2e]/20 blur-[100px] animate-float-slow-reverse pointer-events-none" />
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="login-card w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-display text-2xl text-white/90 tracking-[-0.02em]">
              JHS
            </span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
          </div>
          <h1 className="login-field font-display text-3xl md:text-4xl font-light text-white/90 tracking-[-0.02em] mb-3">
            Admin Login
          </h1>
          <p className="login-field text-white/40 text-sm font-light tracking-wide">
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="login-field space-y-2">
            <label
              htmlFor="email"
              className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-3"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                className={`w-full bg-transparent border-b ${
                  focusedField === "email"
                    ? "border-white/40"
                    : "border-white/15"
                } pb-3 pl-7 text-white/90 text-base font-light placeholder:text-white/20 focus:outline-none transition-colors duration-500`}
              />
            </div>
          </div>

          <div className="login-field space-y-2">
            <label
              htmlFor="password"
              className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-3"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                className={`w-full bg-transparent border-b ${
                  focusedField === "password"
                    ? "border-white/40"
                    : "border-white/15"
                } pb-3 pl-7 pr-8 text-white/90 text-base font-light placeholder:text-white/20 focus:outline-none transition-colors duration-500`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-300 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="login-field pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-3 py-4 border border-white/15 hover:border-white/40 text-white/80 hover:text-white text-xs tracking-[0.3em] uppercase transition-all duration-500 disabled:opacity-40 overflow-hidden"
            >
              {/* Shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Decorative line */}
        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="mt-6 text-center text-[10px] tracking-[0.3em] uppercase text-white/20">
          Protected Area
        </p>
      </div>
    </div>
  );
};

export default Login;
