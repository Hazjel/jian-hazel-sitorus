import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/Hazjel", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/jianhazel", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/jihazel_", label: "Instagram" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-content",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative py-16 bg-[#050505]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="footer-content max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <span className="text-white/60 text-lg font-light tracking-[-0.02em]">
            JHS<span className="text-white/20">.</span>
          </span>

          {/* Copyright */}
          <span className="text-white/20 text-xs tracking-[0.3em] uppercase">
            &copy; {currentYear} Jian Hazel Sitorus
          </span>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-white/10 text-white/30 hover:text-white/70 hover:border-white/30 transition-all duration-500"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 p-3 border border-white/10 text-white/30 hover:text-white/70 hover:border-white/30 transition-all duration-500"
        aria-label="Scroll to top"
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
};

export default Footer;
