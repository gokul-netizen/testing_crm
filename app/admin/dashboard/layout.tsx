"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "@/app/components/SideBar";
import AdminHeader from "@/app/components/AdminHeader";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        desktopCollapsed={desktopCollapsed}
        setDesktopCollapsed={setDesktopCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 overflow-auto transition-all  duration-300 bg-[#f8f7fa] ${
          desktopCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <AdminHeader />
        {children}
      </main>

      <Toaster position="top-right" richColors/>
    </>
  );
}