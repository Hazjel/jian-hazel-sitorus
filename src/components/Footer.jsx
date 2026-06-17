import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const [time, setTime] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/Hazjel", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/jianhazel", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/jihazel_", label: "Instagram" },
  ];

  // Real-time clock (WIB = UTC+7)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const wib = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).format(now);
      setTime(wib);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([".footer-brand", ".footer-item"], { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".footer-brand",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".footer-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[#050505] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px section-divider" />

      {/* Subtle aurora glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-[#1a0a2e]/8 blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-24 md:py-32">
        {/* Large Brand Statement */}
        <div className="footer-brand mb-20 md:mb-24">
          <p className="text-white/30 text-[11px] tracking-[0.4em] uppercase mb-6">
            Let&apos;s Connect
          </p>
          <a href="mailto:duojhs222@gmail.com" className="group inline-block">
            <span className="font-display text-[clamp(2rem,7vw,6rem)] leading-[1] tracking-[-0.03em] text-white/90 font-light hover:text-white transition-colors duration-700 italic">
              duojhs222@gmail.com
            </span>
            <span className="block h-px w-0 bg-white/40 group-hover:w-full transition-all duration-700 mt-2" />
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="footer-item flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl text-white/80 tracking-[-0.02em]">JHS</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
            </div>
            <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
              &copy; {currentYear} Jian Hazel Sitorus
            </span>
          </div>

          {/* Local Time */}
          <div className="footer-item flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400/60" />
            </span>
            <span>Bandung</span>
            <span className="text-white/60 font-mono tracking-wider">{time}</span>
            <span className="text-white/20">WIB</span>
          </div>

          {/* Nav Links */}
          <div className="footer-item flex items-center gap-6 md:gap-8 text-[10px] tracking-[0.3em] uppercase">
            <a href="#about" className="text-white/40 hover:text-white/80 transition-colors duration-500">About</a>
            <a href="#projects" className="text-white/40 hover:text-white/80 transition-colors duration-500">Work</a>
            <a href="#contact" className="text-white/40 hover:text-white/80 transition-colors duration-500">Contact</a>
          </div>

          {/* Social Links */}
          <div className="footer-item flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-white/10 text-white/40 hover:text-white hover:border-white/40 transition-all duration-500"
                aria-label={social.label}
              >
                <social.icon size={14} />
              </a>
            ))}
            <button
              onClick={scrollToTop}
              className="ml-2 p-2.5 border border-white/10 text-white/40 hover:text-white hover:border-white/40 transition-all duration-500 group"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} className="transition-transform duration-500 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
