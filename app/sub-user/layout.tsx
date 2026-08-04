'use client';
import Sidebar from "@/app/components/UserSideBar";
import { LuFileSpreadsheet } from "react-icons/lu";
import { RiMailOpenLine } from "react-icons/ri";
import { Toaster } from "sonner";
import SubUserHeader from "@/app/components/SubUserHeader";
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
          href={`/sub-user`}

          mainLinks={[
            { label: "Home", href: `/sub-user`, icon: RiMailOpenLine },
          ]}

          sections={[

            {
              title: "Inquiry",

              icon: LuFileSpreadsheet,
              activeMatch: `/sub-user/inquiry/view`,
              links: [{ label: "View", href: `/sub-user/inquiry/view` }],
            },
          ]}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-auto bg-[#f8f7fa]">

        <SubUserHeader
          userImage={userImage ? `/${userImage.replace(/\\/g, '/')}` : "/admin_profile.webp"}
          userName={username}
        />

        <main className="flex-1 overflow-auto p-2 px-4">
          {children}
          <Toaster richColors position="top-right" />
        </main>
      </div>
    </div>
  );
}
