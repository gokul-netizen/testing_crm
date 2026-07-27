"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  AiOutlineSun,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineMoon,
  AiOutlineDesktop,
  AiOutlineSetting,
  AiOutlineUser,

} from "react-icons/ai";

import { IoLanguageOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { LuFileSpreadsheet } from "react-icons/lu";
import { useParams, useRouter } from 'next/navigation'
import { RiMailOpenLine } from "react-icons/ri";
import Sidebar from "@/app/components/UserSideBar";
import Link from "next/link";
import NotificationDropdown from "./NotificationList";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import { deleteUserSession } from "@/lib/tokenJwt";


interface HeaderProps {
  userName?: string;
  userImage?: string;
}


export default function SubUserHeader({ userName = "Sub User", userImage }: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const { id } = params;

 
  const { data, error, isLoading } = useSWR( `/api/sub-user/notification` , fetcher);
  const router = useRouter();

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
      await deleteUserSession();
      router.push('/');
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between  lg:justify-end px-5 py-6 m-4 bg-white text-black h-14 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.15)]">
        <div className="lg:hidden">
          <FiMenu size={20} onClick={() => setOpen(true)} />
        </div>

        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
              onClick={() => setOpen(false)}
            />

            <div className="fixed top-0 left-0 h-screen  w-64 bg-white z-[100] shadow-2xl transition-transform">

              <Sidebar
                onClose={() => setOpen(false)}
                UserImage={userImage ? `/${userImage.replace(/\\/g, '/')}` : "/admin_profile.webp"}
                href={`/user/${id}`}
                mainLinks={[
                  { label: "Home", href: `/sub-user/${id}`, icon: RiMailOpenLine },
                ]}
                sections={[


                  {
                    title: "Inquiry",
                    icon: LuFileSpreadsheet,
                    activeMatch: `/user/${id}/inquiry/view`,
                    links: [{ label: "View", href: `/sub-user/${id}/inquiry/view` }],
                  },
                ]}
              />
            </div>
          </>
        )}


        {/* Right menu */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
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

          {/* Theme Dropdown */}
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
         
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition relative cursor-pointer"
            >
              <FaRegBell size={22} className="text-gray-700" />
            </button>

             <span className="absolute top-0 right-1 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 p-2 rounded-full flex items-center justify-center border-2 border-white">
                {data?.data.length || 0}
              </span>

            {notifOpen && (
              <div className="absolute right-0 mt-2 z-50">
               <NotificationDropdown error={error} isLoading={isLoading}  data={data} />
              </div>
            )}
          </div>

           
          <div className="relative" ref={profileRef}>
            <Image
              onClick={() => setProfileOpen(!profileOpen)}

              className="rounded-full cursor-pointer"
              width={40}
              height={35}
              src={userImage || " "}
              alt="admin_image"
            />

            {profileOpen && (
              <div className="absolute right-0 mt-8 w-56 bg-white shadow-lg rounded-xl overflow-hidden z-50">

                <div className="flex items-center gap-3 p-4 border-b cursor-pointer border-gray-200">
                  <Image
                    className="rounded-full"
                    width={35}
                    height={35}
                    src={userImage || " "}
                    alt="admin_image"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-gray-800 truncate">{userName}</span>

                  </div>
                </div>

                <div className="flex flex-col p-4">
                  <Link href={`/sub-user/profile`} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
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
