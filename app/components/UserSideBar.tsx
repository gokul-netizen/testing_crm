"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LiaDotCircle } from "react-icons/lia";
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import SidebarImage from "./SideBarImage";
import { AiOutlineClose } from "react-icons/ai";

type SubLink = {
  label: string;
  href: string;
};


type Section = {
  title: string;
  icon: any;
  activeMatch: string;
  links: SubLink[];
};

type MainLink = {
  label: string;
  href: string;
  icon: any;
};

type SidebarProps = {
  onClose?: () => void
  mainLinks: MainLink[];
  sections?: Section[];
  UserImage: string;
  href?: string
};

export default function Sidebar({ mainLinks, sections, UserImage, href, onClose }: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const showLabels = !collapsed || hoverExpand;

  return (

    <aside
      onMouseEnter={() => collapsed && setHoverExpand(true)}
      onMouseLeave={() => collapsed && setHoverExpand(false)}
      className={`  h-full bg-white border-r shadow-xl z-40
        transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}
        ${hoverExpand ? "w-72" : ""}`}
    >
      {/* Header */}
      <div className="hidden lg:flex justify-between items-center px-6 py-4">
        {showLabels && (
          <SidebarImage domainLogo={UserImage} href={href} />
        )}
        <button
          onClick={() => {
            setCollapsed((p) => !p);
            setHoverExpand(false);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <LiaDotCircle size={22} />
        </button>
      </div>

      <nav className="px-4 py-4  space-y-2 overflow-y-auto  md:pt-4 ">
        <div className="flex justify-end w-full lg:hidden mb-4">
          <AiOutlineClose
            size={24}
            className="cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={onClose}
          />
        </div>


        {mainLinks.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              onClick={onClose}
              key={href}
              href={href}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all
                      ${active
                  ? "bg-[#7367f0] text-white"
                  : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Icon size={22} />
              {showLabels && <span className="font-medium">{label}</span>}   
            </Link>
          );
        })}

        {/* Sections */}
        {sections?.map((section) => {
          const isActive = pathname.includes(section.activeMatch);
          const isOpen = openSection === section.title;

          return (
            <div key={section.title}>
              {showLabels && (
                <div className="px-4 mt-6 mb-1 text-gray-400 uppercase text-sm">
                  {section.title}
                </div>
              )}

              <button
                onClick={() =>
                  setOpenSection(isOpen ? null : section.title)
                }
                className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg transition
                  ${isActive ? "bg-gray-100" : "hover:bg-gray-200"}`}
              >
                <section.icon size={22} />
                {showLabels && (
                  <>
                    <span className="text-base">{section.title}</span>
                    <MdOutlineKeyboardArrowRight
                      size={24}
                      className={`ml-auto transition-transform ${isOpen ? "rotate-90" : ""
                        }`}
                    />
                  </>
                )}
              </button>

              {isOpen && (
                <div className="pl-2 mt-1 space-y-1">
                  {section.links.map((link) => (
                    <Link
                      onClick={onClose}
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition
                        ${pathname === link.href
                          ? "bg-[#7367f0] text-white"
                          : "hover:bg-purple-50 text-gray-700"}`}
                    >
                      <FaRegCircle className="w-2 h-2" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
