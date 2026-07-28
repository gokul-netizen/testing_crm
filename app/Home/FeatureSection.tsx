"use client";

import Image from "next/image";
import { BarChart3, Activity, Mail, MessageCircle } from "lucide-react";
import { motion } from "motion/react";


const features = [
  {
    title: "Dashboard Tracking",
    description:
      "Get a complete overview of your business with an intuitive dashboard. Monitor inquiries, follow-ups, team performance, lead status, and daily progress in one centralized place.",
    icon: BarChart3,
    desktopImage: "/dashboard.png",
    mobileImage: "/dashboardmobile.png",
  },
  {
    title: "Today's Activity Log",
    description:
      "Keep track of every action performed by your team throughout the day. View customer interactions, follow-up updates, assigned tasks, and completed activities with a detailed activity timeline.",
    icon: Activity,
    desktopImage: "/todays-log.png",
    mobileImage: "/activityMobile.png",
  },
  {
    title: "Daily Email & WhatsApp Reports",
    description:
      "Receive automated Email and WhatsApp reports every day containing Today's Follow-ups, Pending Follow-ups, Upcoming Follow-ups, Not Interested Leads, and Closed Inquiries. Stay informed without logging into the CRM.",
    icon: Mail,
    desktopImage: "/whatsapp.png",
    mobileImage: "/remindermobile.png",
  },
  {
    title: "Smart WhatsApp Follow-up Reminders",
    description:
      "Automatically send WhatsApp reminders 10 minutes before scheduled follow-ups. You can also configure custom reminder times to ensure your sales team never misses an important customer interaction.",
    icon: MessageCircle,
    desktopImage: "/callreminder.png",
    mobileImage: "/infoMobile.png",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <motion.span
            className="inline-block rounded-full bg-[#7367f0]/10 px-3.5 py-1.5 text-xs font-semibold text-[#7367f0] sm:px-4 sm:py-2 sm:text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Powerful CRM Features
          </motion.span>

          <motion.h2
            className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Everything You Need to Manage Your Customers
          </motion.h2>

          <motion.p
            className="mx-auto mt-3 max-w-3xl text-base text-gray-600 sm:mt-4 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            MarsWeb Solutions CRM is designed to simplify customer management,
            automate follow-ups, and help your sales team close more deals with
            less effort.
          </motion.p>
        </div>

        <div className="space-y-16 sm:space-y-20 lg:space-y-28">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                className={`grid items-center gap-10 sm:gap-12 lg:grid-cols-2 ${index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
              >
            
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-start"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7367f0]/10 sm:mb-6 sm:h-14 sm:w-14">
                    <Icon className="h-6 w-6 text-[#7367f0] sm:h-7 sm:w-7" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-lg">
                    {feature.description}
                  </p>

                  <div className="mt-6 inline-flex rounded-lg bg-[#7367f0]/10 px-3.5 py-1.5 text-xs font-medium text-[#7367f0] sm:mt-8 sm:px-4 sm:py-2 sm:text-sm">
                    Built for Modern Sales Teams
                  </div>
                </motion.div>

 
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7 }}
                  className="flex w-full items-center justify-center"
                >
                  <div className="relative w-full max-w-[800px] flex justify-center items-center">

               
                    <div className="relative w-full max-w-[800px] aspect-[30/12] overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl bg-white">
                      <Image
                        src={feature.desktopImage}
                        alt={`${feature.title} Desktop View`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 500px"
                        className="object-cover object-top"
                      />
                    </div>

                 
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 w-[34%] max-w-[200px] aspect-[13/20] overflow-hidden rounded-[20px] sm:rounded-[24px] border-4 border-gray-900 shadow-2xl bg-white z-10"
                    >
                      <Image
                        src={feature.mobileImage}
                        alt={`${feature.title} Mobile View`}
                        fill
                        sizes="200px"
                        className="object-cover object-top"
                      />
                    </motion.div>

                  </div>
                </motion.div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}