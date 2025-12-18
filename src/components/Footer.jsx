import { Github, Linkedin, Instagram, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>© {currentYear} Jian Hazel Sitorus. Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
          </div>

          <div className="flex gap-4">
            {[
              { icon: Github, href: "https://github.com/Hazjel", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/jianhazel", label: "LinkedIn" },
              { icon: Instagram, href: "https://instagram.com/zelest__", label: "Instagram" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;