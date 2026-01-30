import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { error } = await supabase
        .from("messages")
        .insert([
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
    <section id="contact" className="py-24 bg-muted border-b-2 border-foreground" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Section Label */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-accent font-mono text-sm">05</span>
              <h2 className="text-headline mt-2">Contact</h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Let's work together.
              </p>

              <div className="mt-8 space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="w-4 h-4 text-accent" />
                    <span className="text-sm">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-9">
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={`bg-background border-2 focus:border-accent rounded-none h-12 ${errors.name ? "border-destructive" : "border-foreground"
                      }`}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1 font-mono">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`bg-background border-2 focus:border-accent rounded-none h-12 ${errors.email ? "border-destructive" : "border-foreground"
                      }`}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1 font-mono">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Tell me about your project..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  className={`bg-background border-2 focus:border-accent rounded-none resize-none ${errors.message ? "border-destructive" : "border-foreground"
                    }`}
                />
                {errors.message && (
                  <p className="text-destructive text-xs mt-1 font-mono">{errors.message}</p>
                )}
              </div>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-foreground text-background hover:bg-accent font-medium uppercase tracking-wide btn-press group rounded-none"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
