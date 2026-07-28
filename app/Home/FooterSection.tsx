"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >

          {/* Column 1 */}
          <motion.div
            className="space-y-4"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block">
              <Image
                src="/mars_logo.png"
                alt="MarsWeb Solutions Logo"
                width={180}
                height={50}
                className="h-auto w-auto max-w-[180px]"
              />
            </Link>

            <p className="text-sm leading-relaxed text-gray-600">
              MarsWeb Solutions CRM helps businesses simplify client
              management, track daily inquiries, and automate follow-ups
              effortlessly.
            </p>

            <div className="pt-2">
              <a
                href="https://www.marswebsolution.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#7367f0] hover:underline"
              >
                <Globe className="h-4 w-4" />
                www.marswebsolution.com
              </a>
            </div>
          </motion.div>


          {/* Column 2 */}
          <motion.div
            className="lg:pl-8"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-[#7367f0]">
                  Home
                </Link>
              </li>

              <li>
                <Link href="#features" className="text-sm text-gray-600 hover:text-[#7367f0]">
                  Features
                </Link>
              </li>

              <li>
                <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-[#7367f0]">
                  How It Works
                </Link>
              </li>

              <li>
                <Link href="#demo" className="text-sm text-gray-600 hover:text-[#7367f0]">
                  Get A Demo
                </Link>
              </li>

              <li>
                <Link href="/login" className="text-sm text-gray-600 hover:text-[#7367f0]">
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>


          {/* Column 3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Contact Us
            </h3>

            <ul className="mt-4 space-y-3">

              <li>
                <a
                  href="mailto:info@marswebsolution.com"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#7367f0]"
                >
                  <Mail className="h-4 w-4 text-[#7367f0]" />
                  info@marswebsolution.com
                </a>
              </li>

              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#7367f0]"
                >
                  <Phone className="h-4 w-4 text-[#7367f0]" />
                  +91 98765 43210
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#7367f0]"
                >
                  <MessageCircle className="h-4 w-4 text-[#7367f0]" />
                  WhatsApp Support
                </a>
              </li>

            </ul>
          </motion.div>


          {/* Column 4 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >

            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Follow Us
            </h3>

            <p className="mt-4 text-sm text-gray-600">
              Stay updated with our latest updates, tech tips, and product releases.
            </p>


            <motion.div
              className="mt-5 flex flex-wrap gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >

              {[
                {
                  icon: MessageCircle,
                  href: "https://wa.me/919876543210",
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com",
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com",
                },
                {
                  icon: Facebook,
                  href: "https://facebook.com",
                },
              ].map((social, index) => {
                const Icon = social.icon;

                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-[#7367f0] hover:bg-[#7367f0] hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}

            </motion.div>

          </motion.div>

        </motion.div>

 
        <motion.div
          className="mt-12 border-t border-gray-100 pt-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >

          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} MarsWeb Solutions. All rights reserved.
          </p>

          <div className="mt-4 flex justify-center space-x-6 sm:mt-0">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>

            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
          </div>

        </motion.div>

      </div>
    </footer>
  );
}