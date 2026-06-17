import { useState, useEffect, useCallback } from "react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Work", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = useCallback((e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "experience", "skills", "projects", "contact"];
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              className="font-display text-xl text-black hover:bg-black hover:text-white px-2 py-0.5 transition-colors duration-100"
            >
              JHS
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`px-4 py-5 text-xs font-bold uppercase tracking-widest border-b-[3px] transition-colors duration-100 ${
                      isActive
                        ? "border-black text-black"
                        : "border-transparent text-black hover:border-black"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>

            {/* Available CTA */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="hidden md:inline-flex items-center gap-2 btn-primary text-sm py-2 px-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#008000] animate-pulse" />
              Available
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 border-[3px] border-black"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span className={`block w-4 h-0.5 bg-black transition-all duration-200 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-4 h-0.5 bg-black transition-all duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-0.5 bg-black transition-all duration-200 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[99] bg-black md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full px-6 pt-24 pb-10">
          <div className="flex flex-col gap-0 border-t-[3px] border-white/20">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="py-5 border-b-[3px] border-white/20 font-display text-3xl text-white hover:bg-white hover:text-black px-2 transition-colors duration-100"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t-[3px] border-white/20">
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Email</p>
            <a href="mailto:duojhs222@gmail.com" className="text-white text-sm font-mono hover:text-[#0000FF] transition-colors">
              duojhs222@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
