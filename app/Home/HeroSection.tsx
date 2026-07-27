"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#7367f0]/10 to-white" >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
     
          <div>
            <span className="inline-flex items-center rounded-full bg-[#7367f0]/10 px-4 py-1 text-sm font-medium text-[#7367f0]">
              🚀 Smart CRM for Growing Businesses
            </span>

            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Simplify Your Customer
              <span className="block text-[#7367f0]">
                Relationship Management
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-lg text-gray-600">
              MarsWeb Solutions CRM helps businesses manage inquiries, track
              customer interactions, schedule follow-ups, assign leads to team
              members, and increase conversions—all from one powerful platform.
            </p>

            
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7367f0] px-6 py-3 font-semibold text-white transition hover:bg-[#6558e8]"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/#demo"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-[#7367f0] hover:text-[#7367f0]"
              >
                <PlayCircle size={20} />
                Book a Demo
              </Link>
            </div>

            
            {/* <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-8">
              <div>
                <h3 className="text-3xl font-bold text-[#7367f0]">1000+</h3>
                <p className="mt-1 text-sm text-gray-600">Customers Managed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#7367f0]">10K+</h3>
                <p className="mt-1 text-sm text-gray-600">Inquiries Tracked</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#7367f0]">99%</h3>
                <p className="mt-1 text-sm text-gray-600">Follow-up Success</p>
              </div>
            </div> */}
          </div>

      
          <div className="relative flex justify-center">
           
            <div className="absolute -z-10 h-80 w-80 rounded-full bg-[#7367f0]/20 blur-3xl"></div>

            <Image
              src="/herosection.avif"
              alt="MarsWeb Solutions CRM Dashboard"
              width={700}
              height={600}
              priority
              className="w-full max-w-2xl rounded-2xl object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}