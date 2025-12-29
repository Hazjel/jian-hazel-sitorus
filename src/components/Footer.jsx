import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/Hazjel", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/jianhazel", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/jihazel_", label: "Instagram" },
  ];

  return (
    <footer className="py-12 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl font-bold">
              JHS<span className="text-accent">.</span>
            </span>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <span className="text-sm text-muted-foreground font-mono">
              © {currentYear} Jian Hazel Sitorus
            </span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-end gap-4"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="p-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll to top */}
      <motion.button
        onClick={scrollToTop}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 border-2 border-foreground hover:bg-accent hover:border-accent hover:text-accent-foreground transition-colors"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </motion.button>
    </footer>
  );
};

export default Footer;
