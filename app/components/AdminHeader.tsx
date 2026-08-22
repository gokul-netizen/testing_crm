"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  AiOutlineSun,
  AiOutlineMoon,
  AiOutlineDesktop,
  AiOutlineSetting,
  AiOutlineUser,

} from "react-icons/ai";

import { IoLanguageOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { FaRegBell } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { deleteAdminSession } from "@/lib/del-auth";


import { useRouter } from 'next/navigation'
import Sidebar from "./SideBar";
import Link from "next/link";
import NotificationDropdown from "./NotificationList";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";


export default function AdminHeader() {
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const router = useRouter();

  const { data, error, isLoading } = useSWR(`/api/admin/notifications`, fetcher);


  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const languages = ["English", "Spanish", "Hindi"];
  const themes = [
    { name: "Light", icon: <AiOutlineSun size={24} className="mr-2 text-yellow-500" /> },
    { name: "Dark", icon: <AiOutlineMoon size={24} className="mr-2 text-gray-700" /> },
    { name: "System", icon: <AiOutlineDesktop size={24} className="mr-2 text-blue-500" /> },
  ];




  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) setThemeOpen(false);
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) setGridOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const delSession = async () => {
    try {
      await deleteAdminSession();
      router.push('/admin');
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between  lg:justify-end px-5 py-6 m-4 bg-white text-black h-14 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.15)]">
        
        <div className="lg:hidden ">
          <FiMenu size={20} className="cursor-pointer" onClick={() => setIsMobileOpen(true)} />
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            desktopCollapsed={desktopCollapsed}
            setDesktopCollapsed={setDesktopCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>


         
        <div className="flex items-center gap-2">
       
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <IoLanguageOutline size={22} className="text-gray-700" />
            </button>
            {langOpen && (
              <div className="absolute left-0 mt-8 w-40 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
                <ul className="flex flex-col">
                  {languages.map((lang) => (
                    <li
                      key={lang}
                      className="px-4 py-2 hover:bg-gray-100 hover:text-purple-700 cursor-pointer"
                      onClick={() => {

                        setLangOpen(false);
                      }}
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

         
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <AiOutlineSun size={22} className="text-gray-700" />
            </button>
            {themeOpen && (
              <div className="absolute right-0 mt-8 w-40 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
                <ul className="flex flex-col">
                  {themes.map((theme) => (
                    <li
                      key={theme.name}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 hover:text-purple-700 cursor-pointer"
                      onClick={() => {

                        setThemeOpen(false);
                      }}
                    >
                      {theme.icon}
                      {theme.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

       
          <div className="relative " ref={gridRef}>
            <button
              onClick={() => setGridOpen(!gridOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <HiOutlineViewGridAdd size={22} className="text-gray-700" />
            </button>

          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition relative cursor-pointer"
            >
              <FaRegBell size={22} className="text-gray-700" />
              <span className="absolute top-0 right-1 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 p-2 rounded-full flex items-center justify-center border-2 border-white">
                {data?.data.length || 0}
              </span>

            </button>
            {notifOpen && (
              <div className="absolute right-0">
                <NotificationDropdown error={error} isLoading={isLoading} data={data} />
              </div>

            )}
          </div>

         
          <div className="relative" ref={profileRef}>
            <Image
              onClick={() => setProfileOpen(!profileOpen)}
              className="rounded-full cursor-pointer"
              width={40}
              height={35}
              src="/admin_profile.webp"
              alt="admin_image"
            />

            {profileOpen && (
              <div className="absolute right-0 mt-8 w-56 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                {/* Top Section */}
                <div className="flex items-center gap-3 p-4 border-b cursor-pointer border-gray-200">
                  <Image
                    className="rounded-full"
                    width={35}
                    height={35}
                    src="/admin_profile.webp"
                    alt="admin_image"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Admin Name</span>
                    <span className="text-sm text-gray-500">Administrator</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col p-4">
                  <Link href={`/admin/dashboard/profile`} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <AiOutlineUser size={20} className="text-gray-600" />
                    <span className="text-gray-800">Profile</span>
                  </Link>
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <AiOutlineSetting size={20} className="text-gray-600" />
                    <span className="text-gray-800">Settings</span>
                  </button>
                  <button onClick={() => delSession()} className="flex items-center flex-row-reverse justify-center mt-1 rounded gap-3 px-4 py-1 cursor-pointer bg-red-500  transition-colors border-t border-gray-200">
                    <IoLogOutOutline size={20} className=" text-white  " />
                    <span className="text-white ">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
