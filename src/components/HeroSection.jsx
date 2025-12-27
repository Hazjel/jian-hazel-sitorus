import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative pt-16 border-b-2 border-foreground"
    >
      {/* Swiss Grid Background */}
      <div className="absolute inset-0 swiss-grid opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-[2px] bg-accent" />
                <span className="text-sm font-mono uppercase tracking-widest">
                  Software Developer
                </span>
              </div>

              <h1 className="text-display mb-8">
                <span className="block">Jian Hazel</span>
                <span className="block text-muted-foreground">Sitorus</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-12 leading-relaxed">
                Informatics student passionate about software development
                and artificial intelligence.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 font-medium uppercase tracking-wide btn-press group"
                    asChild
                  >
                    <a href="#projects" className="flex items-center gap-2">
                      View Work
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-medium uppercase tracking-wide btn-press"
                    asChild
                  >
                    <a href="#contact">Contact</a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="text-[200px] font-bold text-muted leading-none select-none">
                01
              </div>
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-accent" />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-12 left-6"
        >
          <a
            href="#about"
            className="flex items-center gap-3 text-sm font-mono uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
