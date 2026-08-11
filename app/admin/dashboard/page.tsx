'use client';

import { Globe } from "lucide-react";
import StatCard from "../../components/Card";
import Link from "next/link";
import { GrResources, GrUserAdmin } from "react-icons/gr";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import { HiUserGroup } from "react-icons/hi";
import { LuCalendarClock, LuFileSpreadsheet, LuMessageCircleOff } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { TbXboxX } from "react-icons/tb";




export default function Page() {

    const { data, error, isLoading } = useSWR("/api/admin/dashboard", fetcher);

    return (
        <section className="p-4">

            <div className="space-y-6 max-w-[1200px] mx-auto" >

                {/* Domain and Source */}
                <div className="grid grid-cols-2   md:grid-cols-4 gap-4">
                    <Link href={`/admin/dashboard/active-domain`}>
                        <StatCard
                            icon={Globe}
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                            title="Active Domain"
                            subTitle1="Latest Update"
                            subTitle2={data?.activeCount}
                        />
                    </Link>

                    <Link href={`/admin/dashboard/block-domain`}>
                        <StatCard
                            icon={Globe}
                            iconColor="text-orange-600"
                            iconBgColor="bg-orange-100"
                            title="Blocked Domain"
                            subTitle1="Latest Update"
                            subTitle2={data?.blockCount}
                        />
                    </Link>
                    <Link href={`/admin/dashboard/deleted-domain`}>
                        <StatCard
                            icon={Globe}
                            iconColor="text-red-600"
                            iconBgColor="bg-red-100"
                            title="Deleted Domain"
                            subTitle1="Latest Update"
                            subTitle2={data?.deleteCount}
                        />
                    </Link>
                    <Link href={`/admin/dashboard/source`}>
                        <StatCard
                            icon={GrResources}
                            iconColor="text-blue-600"
                            iconBgColor="bg-blue-100"
                            title="Source"
                            subTitle1="Latest Update"
                            subTitle2={data?.sourceCount}
                        />
                    </Link>

                       <Link href={`/admin/dashboard/active-admin-user`}>
                        <StatCard
                            icon={GrUserAdmin }
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                            title="Active Admin User"
                            subTitle1="Latest Update"
                            subTitle2={data?.adminUser}
                        />
                    </Link>

                    <Link href={`/admin/dashboard/active-user`}>
                        <StatCard
                            icon={HiUserGroup}
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                            title="Active User"
                            subTitle1="Latest Update"
                            subTitle2={data?.activeUser}
                        />
                    </Link>

                    

                    <Link href={`/admin/dashboard/block-user`}>
                        <StatCard
                            icon={HiUserGroup}
                            iconColor="text-orange-600"
                            iconBgColor="bg-orange-100"
                            title="Blocked User"
                            subTitle1="Latest Update"
                            subTitle2={data?.blockUser}
                        />
                    </Link>
                    <Link href={`/admin/dashboard/deleted-user`}>
                        <StatCard
                            icon={HiUserGroup}
                            iconColor="text-red-600"
                            iconBgColor="bg-red-100"
                            title="Deleted User"
                            subTitle1="Latest Update"
                            subTitle2={data?.deleteUser}
                        />
                    </Link>

                    <Link href={`/admin/dashboard/active-inquiry`}>
                        <StatCard
                            icon={LuFileSpreadsheet}
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                            title="Active Inquiry"
                            subTitle1="Latest Update"
                            subTitle2={data?.activeInquiry}
                        />
                    </Link>

                    <Link href={`/admin/dashboard/inquiry/deleted-view`}>
                        <StatCard
                            icon={LuFileSpreadsheet}
                            iconColor="text-red-600"
                            iconBgColor="bg-red-100"
                            title="Deleted Inquiry"
                            subTitle1="Latest Update"
                            subTitle2={data?.deletedInquiry}
                        />
                    </Link>

                     <Link href={`/admin/dashboard/todays-followup`}>
                        <StatCard
                            icon={FaRegCalendarAlt}
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                            title="Today's Follow Up"
                            subTitle1="Latest Update"
                            subTitle2={data?.todaysFollowUp}
                        />
                    </Link>

                    <Link href={`/admin/dashboard/pending`}>
                        <StatCard
                            icon={MdPendingActions}
                            iconColor="text-red-600"
                            iconBgColor="bg-red-100"
                            title="Pending Follow Up"
                            subTitle1="Latest Update"
                            subTitle2={data?.pendingCount}
                        />
                    </Link>

                    <Link href={`/admin/dashboard/up-coming`}>
                        <StatCard
                            icon={LuCalendarClock}
                            iconColor="text-purple-600"
                            iconBgColor="bg-purple-100"
                            title="Up Coming Follow Up"
                            subTitle1="Latest Update"
                            subTitle2={data?.upcomingCount}
                        />
                    </Link>

                     <Link href={`/admin/dashboard/not-interest`}>
                        <StatCard
                            icon={LuMessageCircleOff}
                            iconColor="text-gray-600"
                            iconBgColor="bg-gray-100"
                            title="Not Interesed"
                            subTitle1="Latest Update"
                            subTitle2={data?.notInterested}
                        />
                    </Link>
                    <Link href={`/admin/dashboard/closed`}>
                        <StatCard
                            icon={TbXboxX}
                            iconColor="text-red-600"
                            iconBgColor="bg-red-100"
                            title="Closed"
                            subTitle1="Latest Update"
                            subTitle2={data?.closed}
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}