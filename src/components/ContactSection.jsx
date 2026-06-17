import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address").max(255),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validateField = (field, value) => {
    try {
      contactSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) validateField(field, value);
  };

  const handleBlur = (field) => {
    setFocusedField(null);
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      const { error } = await supabase.from("messages").insert([{
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }]);
      if (error) throw error;
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.name,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }, EMAILJS_PUBLIC_KEY);
      toast({ title: "Message Sent", description: "Thank you for reaching out. I'll get back to you soon." });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      toast({ title: "Error", description: "Failed to send message. Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (field) => {
    let cls = "input-raw";
    if (errors[field]) cls += " input-error";
    return cls;
  };

  return (
    <section id="contact" className="scroll-mt-16 bg-white border-b-[3px] border-black">
      {/* Section header */}
      <div className="border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 py-4">
            <span className="section-label">05</span>
            <div className="w-8 border-t-[3px] border-black/30" />
            <span className="section-label">Get in Touch</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h2 className="font-display text-black mb-16">
          Let's Create Something Extraordinary
        </h2>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Contact info */}
          <div className="lg:col-span-4 space-y-8">
            <p className="text-base text-black/70 leading-relaxed">
              I'm open to collaborations, freelance opportunities, and interesting
              conversations. Feel free to reach out.
            </p>

            <div className="space-y-0 border-[3px] border-black">
              <div className="p-5 border-b-[3px] border-black">
                <p className="label-raw text-xs mb-2 text-black/50">Email</p>
                <a
                  href="mailto:duojhs222@gmail.com"
                  className="font-mono-rb text-sm text-[#0000FF] hover:underline break-all"
                >
                  duojhs222@gmail.com
                </a>
              </div>
              <div className="p-5">
                <p className="label-raw text-xs mb-2 text-black/50">Location</p>
                <p className="font-mono-rb text-sm text-black">Bandung, Indonesia</p>
              </div>
            </div>

            {/* Status */}
            <div className="inline-flex items-center gap-3 border-[3px] border-[#008000] px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#008000] animate-pulse" />
              <span className="font-mono-rb text-xs text-[#008000] uppercase tracking-widest">
                Available for work
              </span>
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6" noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-name" className="label-raw">
                  Name <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => handleBlur("name")}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  aria-invalid={!!errors.name}
                  className={getInputClass("name")}
                />
                {errors.name && (
                  <p id="contact-name-error" role="alert" className="helper-text error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-email" className="label-raw">
                  Email <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => handleBlur("email")}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  aria-invalid={!!errors.email}
                  className={getInputClass("email")}
                />
                {errors.email && (
                  <p id="contact-email-error" role="alert" className="helper-text error">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="label-raw">
                Message <span className="text-[#FF0000]">*</span>
              </label>
              <textarea
                id="contact-message"
                placeholder="Tell me about your project..."
                rows={6}
                autoComplete="off"
                required
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onFocus={() => setFocusedField("message")}
                onBlur={() => handleBlur("message")}
                aria-describedby={errors.message ? "contact-message-error" : "contact-message-count"}
                aria-invalid={!!errors.message}
                className={getInputClass("message")}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.message ? (
                  <p id="contact-message-error" role="alert" className="helper-text error">
                    {errors.message}
                  </p>
                ) : <span />}
                <span id="contact-message-count" className="font-mono-rb text-xs text-black/40">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
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
