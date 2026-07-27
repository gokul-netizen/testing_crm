"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  LogIn,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#7367f0] shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        <Link href="/" className="flex items-center">
          <Image
            src="/mars_logo.png" 
            alt="Company Logo"
            width={200}
            height={120}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

      
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white hover:text-[#7367f0]"
          >
            <LogIn size={18} />
            Login
          </Link>

          <Link
            href="/#demo"
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#7367f0] transition-all duration-200 hover:bg-gray-100"
          >
            <CalendarDays size={18} />
            Get Demo
          </Link>
        </div>

     
        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

  
      {open && (
        <div className="border-t border-white/20 bg-[#7367f0] md:hidden">
          <div className="flex flex-col gap-3 p-5">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/30 py-3 text-white transition-all duration-200 hover:bg-white hover:text-[#7367f0]"
            >
              <LogIn size={18} />
              Login
            </Link>

            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-white py-3 font-semibold text-[#7367f0] transition-all duration-200 hover:bg-gray-100"
            >
              <CalendarDays size={18} />
              Get Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}