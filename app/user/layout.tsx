'use client';
import Sidebar from "@/app/components/UserSideBar";
import { LuFileSpreadsheet } from "react-icons/lu";
import { RiMailOpenLine } from "react-icons/ri";
import UserHeader from "@/app/components/UserHeader";
import { Toaster } from "sonner";
import { FaUsers } from "react-icons/fa";
import { useUser } from "../context/userContext";
 

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const { username, userImage } = useUser();

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex">
        <Sidebar
          UserImage={userImage ? `/${userImage.replace(/\\/g, '/')}` : "/admin_profile.webp"}
          href={`/user`}
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
              links: [{ label: "Add User", href: `/user/user-management/add-user` }],
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

      <div className="flex-1 flex flex-col overflow-auto bg-[#f8f7fa]">
        <UserHeader
          user_image={userImage ? `/${userImage.replace(/\\/g, '/')}` : "/admin_profile.webp"}
          userName={username}
        />

        <main className="flex-1 overflow-auto p-2 px-4 ">

          {children}

          <Toaster richColors position="top-right" />
        </main>
      </div>

    </div>
  );
}
