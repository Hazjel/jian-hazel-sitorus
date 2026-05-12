import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  message: z
    .string()
    .trim()
    .min(1, { message: "Message is required" })
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

const ContactSection = () => {
  const sectionRef = useRef(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".contact-form-field",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".contact-info-item",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".contact-info",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validateField = (field, value) => {
    try {
      contactSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0]] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "duojhs222@gmail.com" },
    { icon: MapPin, label: "Location", value: "Bandung, Indonesia" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 md:py-40 lg:py-48 bg-[#050505]"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-20 md:mb-28 lg:mb-32">
          <div className="flex items-center gap-4 mb-6">
            <span className="contact-title text-white/20 text-xs tracking-[0.4em] font-mono">
              04
            </span>
            <span className="contact-title w-12 h-px bg-white/20" />
            <span className="contact-title text-white/40 text-[11px] tracking-[0.4em] uppercase">
              Get in Touch
            </span>
          </div>
          <h2 className="contact-title font-display text-[clamp(2rem,5.5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-white font-light max-w-4xl">
            Let&apos;s create something
            <span className="italic text-white/50"> extraordinary</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-16 lg:gap-20">
          {/* Contact Info */}
          <div className="contact-info lg:col-span-4 space-y-10 lg:pt-4">
            <p className="text-white/60 text-base md:text-lg leading-[1.7] font-light">
              I&apos;m open to collaborations, freelance opportunities, and
              interesting conversations. Feel free to reach out.
            </p>

            <div className="space-y-8 pt-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="contact-info-item flex items-start gap-5"
                >
                  <div className="p-3 border border-white/10 shrink-0">
                    <item.icon className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-1.5">
                      {item.label}
                    </span>
                    <p className="text-white/80 text-sm md:text-base font-light break-all">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="contact-form lg:col-span-8 space-y-10"
            noValidate
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              <div className="contact-form-field">
                <label className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`w-full bg-transparent border-b ${
                    errors.name ? "border-red-400/60" : "border-white/15"
                  } pb-3 text-white/90 text-base font-light placeholder:text-white/20 focus:outline-none focus:border-white/60 transition-colors duration-500`}
                />
                {errors.name && (
                  <p className="text-red-400/70 text-xs mt-3 font-light tracking-wide">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="contact-form-field">
                <label className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full bg-transparent border-b ${
                    errors.email ? "border-red-400/60" : "border-white/15"
                  } pb-3 text-white/90 text-base font-light placeholder:text-white/20 focus:outline-none focus:border-white/60 transition-colors duration-500`}
                />
                {errors.email && (
                  <p className="text-red-400/70 text-xs mt-3 font-light tracking-wide">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div className="contact-form-field">
              <label className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">
                Message
              </label>
              <textarea
                placeholder="Tell me about your project..."
                rows={5}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                className={`w-full bg-transparent border-b ${
                  errors.message ? "border-red-400/60" : "border-white/15"
                } pb-3 text-white/90 text-base font-light placeholder:text-white/20 focus:outline-none focus:border-white/60 transition-colors duration-500 resize-none`}
              />
              {errors.message && (
                <p className="text-red-400/70 text-xs mt-3 font-light tracking-wide">
                  {errors.message}
                </p>
              )}
            </div>
            <div className="contact-form-field pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center gap-4 text-white/80 text-xs tracking-[0.3em] uppercase hover:text-white transition-colors duration-500 disabled:opacity-40 py-4 pr-2 border-b border-white/20 hover:border-white/60"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
