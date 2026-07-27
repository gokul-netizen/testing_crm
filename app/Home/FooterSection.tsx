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

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          <div className="space-y-4">
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
              MarsWeb Solutions CRM helps businesses simplify client management, track daily inquiries, and automate follow-ups effortlessly.
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
          </div>

          <div className="lg:pl-8">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#demo"
                  className="text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  Get A Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:info@marswebsolution.com"
                  className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#7367f0]" />
                  info@marswebsolution.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#7367f0]" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-[#7367f0]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#7367f0]" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Follow Us
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Stay updated with our latest updates, tech tips, and product releases.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-[#7367f0] hover:bg-[#7367f0] hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-[#7367f0] hover:bg-[#7367f0] hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-[#7367f0] hover:bg-[#7367f0] hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-[#7367f0] hover:bg-[#7367f0] hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>
 
        <div className="mt-12 border-t border-gray-100 pt-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
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
        </div>
      </div>
    </footer>
  );
}