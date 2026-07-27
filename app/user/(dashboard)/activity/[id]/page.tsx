'use client';

import CustomBreadcrumb from "@/app/components/BreadCrumb";
import OverView from "@/app/components/OverView";
import TimeLine from "@/app/components/TimeLine";
import { useParams } from "next/navigation";
import { useState } from "react";
import { LuUsers } from "react-icons/lu";


export default function Page() {

    const params = useParams<{ user_id: string; id: string }>();
    const [followup, setFollowup] = useState(false);
    const { id } = params;

    return (
        <>

            <div className="flex items-center gap-4 ">
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

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/user` },
                        { label: "activity-followups", href: `/user/activity` },
                        { label: "Detail", isPage: true },
                    ]}
                />
            </div>

            {followup ? <OverView back={`/user/activity`} id={id} /> : <TimeLine inquiryId={id}   />}
        </>
    )
}