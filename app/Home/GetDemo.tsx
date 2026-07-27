"use client";

import { useState } from "react";
import { Send, User, Building, Phone, MessageSquare, CheckCircle2 } from "lucide-react";

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
      setFormData({ name: "", domain: "", phone: "", message: "" });
    }, 1200);
  };

  return (
    <section  className="bg-gray-50 py-12 sm:py-16 lg:py-20" id="demo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          <div>
            <span className="inline-block rounded-full bg-[#7367f0]/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#7367f0]">
              See It in Action
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get a Free Live Demo of MarsWeb CRM
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600">
              Discover how our CRM can help streamline your lead tracking, automate WhatsApp & email updates, and scale your sales pipeline effortlessly.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#7367f0]" />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Tailored walk-through based on your business domain
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#7367f0]" />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Instant setup assistance & custom team onboardings
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#7367f0]" />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  No obligation or credit card required
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl">
            {isSubmitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-gray-900">
                  Demo Request Sent!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Thank you for reaching out. Our team will contact you shortly to schedule your live demonstration.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 rounded-lg bg-[#7367f0] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6054e0]"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Schedule Your Demo
                </h3>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    Your Name *
                  </label>
                  <div className="relative mt-1.5 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#7367f0] focus:outline-none focus:ring-1 focus:ring-[#7367f0]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="domain"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    Business Domain / Website *
                  </label>
                  <div className="relative mt-1.5 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Building className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="domain"
                      id="domain"
                      required
                      value={formData.domain}
                      onChange={handleChange}
                      placeholder="Enter your domain"
                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#7367f0] focus:outline-none focus:ring-1 focus:ring-[#7367f0]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative mt-1.5 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#7367f0] focus:outline-none focus:ring-1 focus:ring-[#7367f0]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    Message / Requirements
                  </label>
                  <div className="relative mt-1.5 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-gray-400">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <textarea
                      name="message"
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your team size or specific features you're looking for..."
                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#7367f0] focus:outline-none focus:ring-1 focus:ring-[#7367f0]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7367f0] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6054e0] focus:outline-none disabled:opacity-70"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Request Demo
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}