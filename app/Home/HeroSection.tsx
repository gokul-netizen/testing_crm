"use client";


import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "motion/react";


export default function HeroSection() {


  const MotionLink = motion(Link);

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };


  return (
    <section className="bg-gradient-to-b from-[#7367f0]/10 to-white" >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-18">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                variants={item}
                className="inline-flex items-center rounded-full bg-[#7367f0]/10 px-4 py-1 text-sm font-medium text-[#7367f0]"
              >
                🚀 TrackFlow Business CRM
              </motion.span>

              <motion.h1
                variants={item}
                className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl"
              >
                Track Every Lead Manage Every Customer
                <span className="block text-[#7367f0]">
                 Grow Your Business.
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-3 max-w-xl text-lg text-gray-600"
              >
                Manage customer inquiries, schedule reminders, monitor sales activities, 
                and boost productivity with a CRM built to keep your business moving forward.
              </motion.p>
            </motion.div>


            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <MotionLink
                href="/login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7367f0] px-6 py-3 font-semibold text-white transition hover:bg-[#6558e8]"
              >
                Get Started
                <ArrowRight size={18} />
              </MotionLink>

              <MotionLink
                href="/#demo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-[#7367f0] hover:text-[#7367f0]"
              >
                <PlayCircle size={20} />
                Book a Demo
              </MotionLink>
            </div>
          </div>


          <div className="relative flex justify-center">

            <div className="absolute -z-10 h-80 w-80 rounded-full bg-[#7367f0]/20 blur-3xl"></div>

            <motion.video
              src="/heroSection.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full max-w-2xl rounded-2xl object-contain drop-shadow-2xl"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}