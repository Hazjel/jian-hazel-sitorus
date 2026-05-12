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
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-24 md:py-32">
        {/* Large Brand Statement */}
        <div className="footer-brand mb-20 md:mb-24">
          <p className="text-white/30 text-[11px] tracking-[0.4em] uppercase mb-6">
            Let&apos;s Connect
          </p>
          <a
            href="mailto:duojhs222@gmail.com"
            className="group inline-block"
          >
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
              <span className="font-display text-xl text-white/80 tracking-[-0.02em]">
                JHS
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
            </div>
            <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
              &copy; {currentYear} Jian Hazel Sitorus
            </span>
          </div>

          {/* Nav Links */}
          <div className="footer-item flex items-center gap-6 md:gap-8 text-[10px] tracking-[0.3em] uppercase">
            <a
              href="#about"
              className="text-white/40 hover:text-white/80 transition-colors duration-500"
            >
              About
            </a>
            <a
              href="#projects"
              className="text-white/40 hover:text-white/80 transition-colors duration-500"
            >
              Work
            </a>
            <a
              href="#contact"
              className="text-white/40 hover:text-white/80 transition-colors duration-500"
            >
              Contact
            </a>
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
              className="ml-2 p-2.5 border border-white/10 text-white/40 hover:text-white hover:border-white/40 transition-all duration-500"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
