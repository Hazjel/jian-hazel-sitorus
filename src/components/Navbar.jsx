import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const navItems = [
  { name: "Home", href: "#home", num: "00" },
  { name: "About", href: "#about", num: "01" },
  { name: "Skills", href: "#skills", num: "02" },
  { name: "Work", href: "#projects", num: "03" },
  { name: "Contact", href: "#contact", num: "04" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef(null);
  const lastScrollY = useRef(0);

  const scrollToSection = useCallback((e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -20 },
      { y: 0, duration: 1, ease: "power3.out", delay: 2.2 }
    );

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setScrolled(currentScrollY > 50);

      lastScrollY.current = currentScrollY;

      // Active section detection
      const sections = ["home", "about", "skills", "projects", "contact"];
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              className="flex items-center gap-2 text-white/90 font-light hover:text-white transition-colors duration-500 group"
            >
              <span className="font-display text-xl tracking-[-0.02em]">
                JHS
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-white transition-colors duration-500" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10 lg:gap-12">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`group relative flex items-baseline gap-1.5 text-[11px] tracking-[0.25em] uppercase transition-colors duration-500 ${
                    activeSection === item.href.replace("#", "")
                      ? "text-white"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  <span className="text-[9px] text-white/20 font-mono">
                    {item.num}
                  </span>
                  <span className="relative">
                    {item.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-px transition-all duration-500 ${
                        activeSection === item.href.replace("#", "")
                          ? "w-full bg-white/60"
                          : "w-0 group-hover:w-full bg-white/60"
                      }`}
                    />
                  </span>
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors duration-500 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400/70" />
              </span>
              Available
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-10 h-10 flex flex-col justify-center items-end gap-1.5 z-[101]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`h-px bg-white/80 transition-all duration-500 ${
                  isOpen ? "w-6 rotate-45 translate-y-[3.5px]" : "w-6"
                }`}
              />
              <span
                className={`h-px bg-white/80 transition-all duration-500 ${
                  isOpen ? "w-6 -rotate-45 -translate-y-[3.5px]" : "w-4"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar — gradient accent */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-transparent">
          <div
            className="h-full bg-white/25"
            style={{ width: `${scrollProgress}%`, transition: "width 0.1s linear" }}
          />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-[#0a0a0a] md:hidden transition-all duration-700 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full px-6 pt-28 pb-12">
          <div className="flex flex-col gap-6 flex-1">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  scrollToSection(e, item.href);
                  setIsOpen(false);
                }}
                className="flex items-baseline gap-4 group"
                style={{
                  transitionDelay: isOpen ? `${150 + index * 80}ms` : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <span className="text-white/20 text-xs tracking-[0.3em] font-mono">
                  {item.num}
                </span>
                <span className="font-display text-4xl font-light text-white/80 group-hover:text-white tracking-[-0.02em] transition-colors duration-500">
                  {item.name}
                </span>
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
              Email
            </span>
            <a
              href="mailto:duojhs222@gmail.com"
              className="text-white/70 text-sm font-light"
            >
              duojhs222@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
