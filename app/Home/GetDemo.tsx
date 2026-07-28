"use client";

import { useState } from "react";
import {
  Send,
  User,
  Building,
  Phone,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";

export default function DemoFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        domain: "",
        phone: "",
        message: "",
      });
    }, 1200);
  };

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20" id="demo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-[#7367f0]/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#7367f0]"
            >
              See It in Action
            </motion.span>


            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Get a Free Live Demo of MarsWeb CRM
            </motion.h2>


            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600"
            >
              Discover how our CRM can help streamline your lead tracking,
              automate WhatsApp & email updates, and scale your sales pipeline
              effortlessly.
            </motion.p>


            <motion.div
              className="mt-8 space-y-4"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >

              {[
                "Tailored walk-through based on your business domain",
                "Instant setup assistance & custom team onboardings",
                "No obligation or credit card required",
              ].map((item) => (
                <motion.div
                  key={item}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#7367f0]" />

                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    {item}
                  </span>

                </motion.div>
              ))}

            </motion.div>

          </motion.div>

 
          <motion.div
            initial={{
              opacity: 0,
              x: 50,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
            className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl"
          >

            {isSubmitted ? (

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-2xl font-bold text-gray-900">
                  Demo Request Sent!
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Thank you for reaching out. Our team will contact you shortly
                  to schedule your live demonstration.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 rounded-lg bg-[#7367f0] px-6 py-2.5 text-sm font-medium text-white"
                >
                  Submit Another Request
                </motion.button>

              </motion.div>

            ) : (

              <form onSubmit={handleSubmit} className="space-y-5">

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Schedule Your Demo
                </h3>


                {[
                  {
                    name: "name",
                    label: "Your Name *",
                    icon: User,
                    placeholder: "Enter your name",
                    type: "text",
                  },
                  {
                    name: "domain",
                    label: "Business Domain / Website *",
                    icon: Building,
                    placeholder: "Enter your domain",
                    type: "text",
                  },
                  {
                    name: "phone",
                    label: "Phone / WhatsApp Number *",
                    icon: Phone,
                    placeholder: "Enter your phone number",
                    type: "tel",
                  },
                ].map((field) => {
                  const Icon = field.icon;

                  return (
                    <div key={field.name}>

                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                        {field.label}
                      </label>

                      <div className="relative mt-1.5">

                        <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                        <input
                          type={field.type}
                          name={field.name}
                          value={
                            formData[
                            field.name as keyof typeof formData
                            ]
                          }
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                          className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-[#7367f0] focus:outline-none focus:ring-1 focus:ring-[#7367f0]"
                        />

                      </div>

                    </div>
                  );
                })}


                <div>

                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Message / Requirements
                  </label>

                  <div className="relative mt-1.5">

                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements..."
                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-[#7367f0]"
                    />

                  </div>

                </div>


                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7367f0] py-3 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Request Demo
                    </>
                  )}

                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 