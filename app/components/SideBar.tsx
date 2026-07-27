"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LiaDotCircle } from "react-icons/lia";
import { FaRegCircle, FaUsers } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiCloseFill, RiMailOpenLine } from "react-icons/ri";
import { LuFileSpreadsheet } from "react-icons/lu";
import { TbColorSwatch } from "react-icons/tb";
import SidebarImage from "./SideBarImage";


const default_logo = "/mars_logo.png";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  desktopCollapsed: boolean;
  setDesktopCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  desktopCollapsed,
  setDesktopCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const [masterOpen, setMasterOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  
  
  // Logo logic
  useEffect(() => {
    if (pathname === "/admin/dashboard/inquiry/view") {
      setLogo(default_logo);
      localStorage.removeItem("selectedDomainLogo");
      localStorage.removeItem("selectedDomainName");
      return;
    } else if (pathname.startsWith("/admin/dashboard/inquiry/view/")) {
      const savedLogo = localStorage.getItem("selectedDomainLogo");
      setLogo(savedLogo || default_logo);
    } else {
      setLogo(default_logo);
      localStorage.removeItem("selectedDomainLogo");
      localStorage.removeItem("selectedDomainName");
    }
  }, [pathname]);


  const showLabels = !desktopCollapsed || hoverExpand;

  const links = [{ label: "Dashboard", href: "/admin/dashboard", icon: RiMailOpenLine }];

  const masterSubLinks = [
    { label: "Domain", href: "/admin/dashboard/masters/domain" },
    { label: "Deleted Domain", href: "/admin/dashboard/masters/deleted-domains" },
    { label: "Source", href: "/admin/dashboard/masters/source" },
    
  ];

  const userSubLinks = [
    { label: "Add User", href: "/admin/dashboard/user/adduser" },
    { label: "Deleted User", href: "/admin/dashboard/user/deleted-user" },
  ];

  const reviewSubLinks = [
    { label: "View", href: "/admin/dashboard/inquiry/view" },
    { label: "Deleted View", href: "/admin/dashboard/inquiry/deleted-view" },
  ];

  const isMasterParentActive = pathname.includes("/admin/dashboard/masters");
  const isUserActive = pathname.includes("/admin/dashboard/user");
  const isReviewActive = pathname.includes("/admin/dashboard/inquiry");

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
  onMouseEnter={() => desktopCollapsed && setHoverExpand(true)}
  onMouseLeave={() => desktopCollapsed && setHoverExpand(false)}
  className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-xl flex flex-col transition-all duration-300 z-40
    
    /* Mobile & Medium drawer (Hidden by default) */
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
    
    /* Desktop (Permanent starting at 1024px) */
    lg:translate-x-0
    
    /* Width logic */
    ${desktopCollapsed ? "lg:w-20" : "lg:w-72"} 
    w-72

    ${hoverExpand ? "lg:w-72" : ""}
  `}
>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 text-3xl font-bold tracking-tight ">
          <div className="w-28 h-16 flex-shrink-0">
            {showLabels && <SidebarImage domainLogo={logo} />}
          </div>

          <RiCloseFill
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden cursor-pointer"
          />

          <button
            onClick={() => {
              setDesktopCollapsed((prev) => !prev);
              setHoverExpand(false);
            }}
            className="hidden lg:block p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            {!desktopCollapsed ? (
              <LiaDotCircle size={22} />
            ) : hoverExpand ? (
              <FaRegCircle size={18} />
            ) : null}
          </button>
        </div>

        <nav className="px-4 py-4 space-y-2 overflow-y-auto">
          {/* Main Links */}
          {links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => isMobileOpen && setIsMobileOpen(false)}
                className={`flex items-center gap-4 ${showLabels ? "justify-start" : "justify-center"
                  } px-4 py-2 rounded-lg transition-all duration-200 ${active ? "bg-[#7367f0] text-white" : "text-[#444050] hover:bg-gray-100"
                  }`}
              >
                <Icon size={22} />
                {showLabels && <span className="text-base font-medium">{label}</span>}
              </Link>
            );
          })}

          {/* Masters */}
          {showLabels && <div className="px-4 mt-6 mb-1 text-gray-400 uppercase text-sm">Masters</div>}
          <button
            onClick={() => setMasterOpen(!masterOpen)}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-200 ${isMasterParentActive ? "bg-gray-100" : ""
              }`}
          >
            <TbColorSwatch size={22} />
            {showLabels && (
              <>
                <span>Master</span>
                <MdOutlineKeyboardArrowRight
                  className={`ml-auto transition-transform ${masterOpen ? "rotate-90" : ""}`}
                  size={25}
                />
              </>
            )}
          </button>

          {masterOpen &&
            masterSubLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                 onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-2 px-6 py-2 rounded-md ${pathname === link.href ? "bg-[#7367f0] text-white" : "hover:bg-purple-50"
                  }`}
              >
                <FaRegCircle className="w-2 h-2" />
                {link.label}
              </Link>
            ))}

          {/* Users */}
          {showLabels && <div className="px-4 mt-6 mb-1 text-gray-400 uppercase text-sm">User Management</div>}
          <button
            onClick={() => setUserOpen(!userOpen)}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-200 ${isUserActive ? "bg-gray-100" : ""
              }`}
          >
            <FaUsers size={22} />
            {showLabels && (
              <>
                <span>User Management</span>
                <MdOutlineKeyboardArrowRight
                  className={`ml-auto transition-transform ${userOpen ? "rotate-90" : ""}`}
                  size={25}
                />
              </>
            )}
          </button>

          {userOpen &&
            userSubLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
               onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-2 px-6 py-2 rounded-md ${pathname === link.href ? "bg-[#7367f0] text-white" : "hover:bg-purple-50"
                  }`}
              >
                <FaRegCircle className="w-2 h-2" />
                {link.label}
              </Link>
            ))}

          {/* Inquiry */}
          {showLabels && <div className="px-4 mt-6 mb-1 text-gray-400 uppercase text-sm">Inquiries</div>}
          <button
            onClick={() => setReviewOpen(!reviewOpen)}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-200 ${isReviewActive ? "bg-gray-200" : ""
              }`}
          >
            <LuFileSpreadsheet size={22} />
            {showLabels && (
              <>
                <span>Inquiry</span>
                <MdOutlineKeyboardArrowRight
                  className={`ml-auto transition-transform ${reviewOpen ? "rotate-90" : ""}`}
                  size={25}
                />
              </>
            )}
          </button>

          {reviewOpen &&
            reviewSubLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-2 px-6 py-2 rounded-md ${pathname === link.href ? "bg-[#7367f0] text-white" : "hover:bg-purple-50"
                  }`}
              >
                <FaRegCircle className="w-2 h-2" />
                {link.label}
              </Link>
            ))}
        </nav>
      </aside>
    </>
  );
}
