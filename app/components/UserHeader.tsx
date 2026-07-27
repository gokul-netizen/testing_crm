"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  AiOutlineSun,
  AiOutlineClose,
  AiOutlineMoon,
  AiOutlineDesktop,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";
import { IoLanguageOutline, IoLogOutOutline } from "react-icons/io5";
import { FaRegBell, FaUsers } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
 
import { RiMailOpenLine } from "react-icons/ri";
import { LuFileSpreadsheet } from "react-icons/lu";
import Sidebar from "@/app/components/UserSideBar";
import NotificationDropdown from "./NotificationList";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import { deleteUserSession } from "@/lib/tokenJwt";


interface UserProps {
  userName?: string;
  user_image?: string;
}



export default function UserHeader({ userName = "User Name", user_image }: UserProps) {

  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const params = useParams()
  const { user_id } = params;

  const userId = user_id as string;

  const router = useRouter();

  const { data, error, isLoading } = useSWR( `/api/user/notifications` , fetcher);

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
 



  const delSession = async () => {
    try {
      await deleteUserSession();
      router.push("/");
    } catch (error) {
      console.log("failed to logout", error)
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setLangOpen(false);
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) setThemeOpen(false);
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) setGridOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);





  return (
    <section>
      <div className="flex items-center justify-between lg:justify-end px-5 py-6 m-4 bg-white text-black h-14 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.15)]">

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
                href={`/user/${user_id}`}
                mainLinks={[
                  { label: "Home", href: `/user`, icon: RiMailOpenLine },
                ]}
                sections={[
                  {
                    title: "Master",
                    icon: FaUsers,
                    activeMatch: `/user/master/service`,
                    links: [{ label: "Service", href: `/user/master/service` }, { label: "Designation", href: `/user/master/designation` }],
                  },
                  {
                    title: "User Management",
                    icon: FaUsers,
                    activeMatch: `/user/user/add-user`,
                    links: [{ label: "Add User", href: `/user/user-management/add-user` },],
                  },
                  {
                    title: "Inquiry",
                    icon: LuFileSpreadsheet,
                    activeMatch: `/user/inquiry/view`,
                    links: [{ label: "View", href: `/user/inquiry/view` }],
                  },
                ]}
              />
            </div>
          </>
        )}

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
              <div className="absolute right-0 mt-8 w-40 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
                <ul className="flex flex-col">
                  {languages.map((lang) => (
                    <li
                      key={lang}
                      className="px-4 py-2 hover:bg-gray-100 hover:text-purple-700 cursor-pointer"
                      onClick={() => setLangOpen(false)}
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
                      onClick={() => setThemeOpen(false)}
                    >
                      {theme.icon}
                      {theme.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <Image
              onClick={() => setProfileOpen(!profileOpen)}
              className="rounded-full cursor-pointer"
              width={40}
              height={35}
              src={user_image || ''}
              alt="user_image"
            />
            {profileOpen && (
              <div className="absolute right-0 mt-8 w-56 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                  <Image
                    className="rounded-full"
                    width={35}
                    height={35}
                    src={user_image || ''}
                    alt="user_image"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-gray-800 truncate">{userName}</span>
                    <span className="text-sm text-gray-500">User</span>
                  </div>
                </div>
                <div className="flex flex-col p-4">
                  <button onClick={() => { router.push(`/user/profile`); setProfileOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <AiOutlineUser size={20} className="text-gray-600" />
                    <span className="text-gray-800">Profile</span>
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <AiOutlineSetting size={20} className="text-gray-600" />
                    <span className="text-gray-800">Settings</span>
                  </button>
                  <button onClick={() => delSession()} className="flex items-center cursor-pointer justify-center mt-1 gap-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    <IoLogOutOutline size={20} /> Logout
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
