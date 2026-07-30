"use client";

import { KeyRound, UserPlus, LayoutDashboard, Clock, RefreshCw } from "lucide-react";
import { motion } from "motion/react";


const steps = [
  {
    number: "01",
    title: "Login with Credentials",
    description: "Securely access your account with your username and password to enter the CRM portal.",
    icon: KeyRound,
  },
  {
    number: "02",
    title: "Add Customer Inquiries",
    description: "Easily log new leads, prospective clients, and customer inquiries with crucial details.",
    icon: UserPlus,
  },
  {
    number: "03",
    title: "Track Inquiry Status",
    description: "Monitor your entire sales pipeline and inquiry statuses directly on your centralized dashboard.",
    icon: LayoutDashboard,
  },
  {
    number: "04",
    title: "View Timeline & Details",
    description: "Access complete communication history, action logs, and interaction timelines for every lead.",
    icon: Clock,
  },
  {
    number: "05",
    title: "Update Inquiry Status",
    description: "Mark follow-ups, reassign tasks, or update lead progress to closed or pending in real time.",
    icon: RefreshCw,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-[#7367f0]/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#7367f0]">
            Simple Workflow
          </span>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            How MarsWeb CRM Works
          </h2>

          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-gray-600">
            Our CRM is designed to be ridiculously easy to use. Manage your
            full customer lifecycle in five simple steps.
          </p>
        </motion.div>

        
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                whileHover={{ y: -8 }}
                className="relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all duration-300 hover:border-[#7367f0]/30 hover:bg-white hover:shadow-xl"
              >

                <div>
                  <div className="flex items-center justify-between">

                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.2 }}
                      className="text-3xl font-extrabold text-[#7367f0]/20"
                    >
                      {step.number}
                    </motion.span>
                  
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7367f0]/10 text-[#7367f0]"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>

                  </div>


                  <h3 className="mt-5 text-lg font-bold text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>

                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}