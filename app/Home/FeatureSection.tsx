"use client";

import Image from "next/image";
import { BarChart3, Activity, Mail, MessageCircle } from "lucide-react";

const features = [
  {
    title: "Dashboard Tracking",
    description:
      "Get a complete overview of your business with an intuitive dashboard. Monitor inquiries, follow-ups, team performance, lead status, and daily progress in one centralized place.",
    icon: BarChart3,
    image: "/dashboard.png",
  },
  {
    title: "Today's Activity Log",
    description:
      "Keep track of every action performed by your team throughout the day. View customer interactions, follow-up updates, assigned tasks, and completed activities with a detailed activity timeline.",
    icon: Activity,
    image: "/todays-log.png",
  },
  {
    title: "Daily Email & WhatsApp Reports",
    description:
      "Receive automated Email and WhatsApp reports every day containing Today's Follow-ups, Pending Follow-ups, Upcoming Follow-ups, Not Interested Leads, and Closed Inquiries. Stay informed without logging into the CRM.",
    icon: Mail,
    image: "/reminder.png",
  },
  {
    title: "Smart WhatsApp Follow-up Reminders",
    description:
      "Automatically send WhatsApp reminders 10 minutes before scheduled follow-ups. You can also configure custom reminder times to ensure your sales team never misses an important customer interaction.",
    icon: MessageCircle,
    image: "/callreminder.png",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16 text-center">
          <span className="inline-block rounded-full bg-[#7367f0]/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#7367f0]">
            Powerful CRM Features
          </span>

          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Everything You Need to Manage Your Customers
          </h2>

          <p className="mx-auto mt-3 sm:mt-4 max-w-3xl text-base sm:text-lg text-gray-600">
            MarsWeb Solutions CRM is designed to simplify customer management,
            automate follow-ups, and help your sales team close more deals with
            less effort.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-20 lg:space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`grid items-center gap-8 sm:gap-12 lg:grid-cols-2 ${
                  index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="flex flex-col items-start">
                  <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-[#7367f0]/10">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#7367f0]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-gray-600">
                    {feature.description}
                  </p>

                  <div className="mt-6 sm:mt-8 inline-flex rounded-lg bg-[#7367f0]/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-[#7367f0]">
                    Built for Modern Sales Teams
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <div className="relative w-full max-w-[550px] max-h-[380px] aspect-[4/3]">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 550px"
                      className="rounded-xl sm:rounded-2xl border border-gray-200 object-cover object-top shadow-lg sm:shadow-xl"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}