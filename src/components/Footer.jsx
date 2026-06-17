import { useEffect, useState } from "react";
import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const wib = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).format(new Date());
      setTime(wib);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { icon: Github, href: "https://github.com/Hazjel", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/jianhazel", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/jihazel_", label: "Instagram" },
  ];

  return (
    <footer className="bg-black text-white border-t-[5px] border-black">
      {/* Big email CTA */}
      <div className="border-b-[3px] border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <p className="font-mono-rb text-xs uppercase tracking-widest text-white/40 mb-6">
            Let's Connect
          </p>
          <a
            href="mailto:duojhs222@gmail.com"
            className="font-display text-white hover:bg-white hover:text-black transition-colors duration-100 inline-block"
            style={{ fontSize: "clamp(1.5rem, 5vw, 4rem)", lineHeight: 1 }}
          >
            duojhs222@gmail.com
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 border-b-[3px] border-white/20">
          {/* Logo + copyright */}
          <div className="flex items-center gap-4">
            <span className="font-display text-xl text-white">JHS</span>
            <span className="w-px h-4 bg-white/20" />
            <span className="font-mono-rb text-xs text-white/40 uppercase tracking-widest">
              &copy; {currentYear} Jian Hazel Sitorus
            </span>
          </div>

          {/* Live clock */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#008000] animate-pulse" />
            <span className="font-mono-rb text-xs text-white/40 uppercase tracking-widest">Bandung</span>
            <span className="font-mono-rb text-sm text-white/70">{time}</span>
            <span className="font-mono-rb text-xs text-white/25">WIB</span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-0">
            {["#about", "#projects", "#contact"].map((href, i) => {
              const labels = ["About", "Work", "Contact"];
              return (
                <a
                  key={href}
                  href={href}
                  className={`font-mono-rb text-xs text-white/40 hover:text-white uppercase tracking-widest px-4 py-2 transition-colors duration-100 ${i < 2 ? "border-r-[3px] border-white/20" : ""}`}
                >
                  {labels[i]}
                </a>
              );
            })}
          </div>

          {/* Socials + back to top */}
          <div className="flex items-center gap-0">
            {socialLinks.map((social, i) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border-[3px] border-white/20 text-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-100 -mr-[3px]"
                aria-label={social.label}
              >
                <social.icon size={14} />
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-3 border-[3px] border-white/20 text-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-100 ml-3"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Tagline */}
        <div className="py-4">
          <p className="font-mono-rb text-xs text-white/20 uppercase tracking-widest text-center">
            Built with RawBlock Design System — No rounded corners. No shadows. No excuses.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
