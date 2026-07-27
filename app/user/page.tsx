'use client';

import StatCard from "@/app/components/Card";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import { LuCalendarClock, LuMessageCircleOff } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdPendingActions, MdUpdate } from "react-icons/md";
import { TbXboxX } from "react-icons/tb";
import { useParams } from "next/navigation";
import { FiInbox } from "react-icons/fi";

interface IncomingData {

    totalInquiry: number;
    todayFollowup: number;
    upComing: number;
    pending: number;
    notInterested: number;
    closed: number;
    totalTodayActivityCount: number;

}


export default function Page() {

    const params = useParams();
    const { user_id } = params;

    const { data, error, isLoading } = useSWR<IncomingData>(`/api/user/dashboard`, fetcher);

    return (    
        <section>
            <div className="space-y-6 max-w-[1200px] mx-auto" >

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
                    <Link href={`/user/total-followups`}>
                        <StatCard
                            icon={FiInbox}
                            iconColor="text-blue-600"
                            iconBgColor="bg-blue-100"
                            title="Total Inquiries"
                            subTitle1="Latest Update"
                            subTitle2={data?.totalInquiry}
                        />
                    </Link>
                    <Link href={`/user/todays-followups`}>
                        <StatCard
                            icon={FaRegCalendarAlt}
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                            title="Today's Follow Up"
                            subTitle1="Latest Update"
                            subTitle2={data?.todayFollowup}
                        />
                    </Link>

                    <Link href={`/user/pending-followups`}>
                        <StatCard
                            icon={MdPendingActions}
                            iconColor="text-red-600"
                            iconBgColor="bg-red-100"
                            title="Pending Follow Up"
                            subTitle1="Latest Update"
                            subTitle2={data?.pending}
                        />
                    </Link>

                    <Link href={`/user/upcoming-followups`}>
                        <StatCard
                            icon={LuCalendarClock}
                            iconColor="text-purple-600"
                            iconBgColor="bg-purple-100"
                            title="Up Coming Follow Up"
                            subTitle1="Latest Update"
                            subTitle2={data?.upComing}
                        />
                    </Link>

                    <Link href={`/user/notInterested-followups`}>
                        <StatCard
                            icon={LuMessageCircleOff}
                            iconColor="text-gray-600"
                            iconBgColor="bg-gray-100"
                            title="Not Interesed"
                            subTitle1="Latest Update"
                            subTitle2={data?.notInterested}
                        />
                    </Link>

                    <Link href={`/user/closed-followups`}>
                        <StatCard
                            icon={TbXboxX}
                            iconColor="text-red-600"
                            iconBgColor="bg-red-100"
                            title="Closed"
                            subTitle1="Latest Update"
                            subTitle2={data?.closed}
                        />
                    </Link>

                    <Link href={`/user/activity`}>
                        <StatCard
                            icon={MdUpdate}
                            iconColor="text-yellow-600"
                            iconBgColor="bg-yellow-100"
                            title="Today Activity"
                            subTitle1="Latest Update"
                            subTitle2={data?.totalTodayActivityCount}
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}