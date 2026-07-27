'use client';

import { useState } from 'react';
import { LuUsers } from 'react-icons/lu';
import OverView from "@/app/components/OverView";
import TimeLineAdminSide from "@/app/components/TimeLineAdminSide";
import CustomBreadcrumb from '@/app/components/BreadCrumb';
import { useParams } from 'next/navigation';




export default function Page() {

  const [followup, setFollowup] = useState(false);
  const params = useParams<{ id: string, all: string }>();
  const domainId = params.id;
  const inquiryId = params.all;

 




  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 bg-[#f8f7fa]">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        <div className='flex flex-col gap-4 md:flex-row items-center justify-between mr-4' >
          <div className="flex items-center gap-4">
            <button className={`flex items-center gap-2 px-6 py-2 rounded-md  ${followup ? "bg-[#7367f0] text-white" : "text-gray-500  hover:text-[#7367f0] hover:bg-[#bdb8f3]"} cursor-pointer font-medium text-[15px] hover:shadow-sm transition-all`}
              onClick={() => setFollowup(true)}
            >
              <LuUsers size={20} />
              <span>Overview</span>

            </button>

            <button className={`flex items-center gap-2 px-6 py-2 rounded-md  hover:bg-[#cecbec] ${followup ? "text-gray-500  hover:text-[#7367f0]" : "text-white bg-[#7367f0]"} cursor-pointer hover:shadow-sm font-medium text-[15px] transition-all`}
              onClick={() => setFollowup(false)}
            >
              <LuUsers size={20} />
              <span>Timeline</span>
            </button>
          </div>

          <CustomBreadcrumb
            paths={[
              { label: "View", href: "/admin/dashboard/inquiry/view" },
              { label: "Records", href: `/admin/dashboard/inquiry/view/${domainId}` },
              { label: "Detail", isPage: true },
            ]}
          />

        </div>

        {followup ? <OverView back={`/admin/dashboard/inquiry/view/${domainId}`} id={inquiryId} /> : <TimeLineAdminSide id={inquiryId} userId={2} />}
      </div>

    </div>
  );
}