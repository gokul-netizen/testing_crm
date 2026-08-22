'use client';

import { fetcher } from "@/lib/fetcherSwr";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import useSWR from "swr";
import CustomBreadcrumb from "@/app/components/BreadCrumb";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function OverView() {
    const params = useParams();
    const { id } = params;

    const { data, error, isLoading } = useSWR(
        `/api/admin/dashboard/active-user/${id}`,
        fetcher
    );

    const detailData = data?.data;

    if (isLoading) {
        return <div className="p-6 text-gray-500">Loading...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                Failed to load response.
            </div>
        );
    }

    return (
        <section className="px-3">
            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        {
                            label: "Dashboard",
                            href: `/admin/dashboard/`,
                        },
                        {
                            label: "Deleted User",
                            href: `/admin/dashboard/deleted-user`,
                        },
                        {
                            label: "Detail",
                            isPage: true,
                        },
                    ]}
                />
            </div>

            <div className="bg-white p-8 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.15)] space-y-6">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <h1 className="text-2xl text-gray-700 mx-auto lg:mx-0">
                        Detail Page
                    </h1>
                </div>

                <div>
                    {detailData &&
                        Object.entries(detailData).map(([key, value]) => {

                            let displayValue = "";

                            
                            if (
                                key === "added_on" ||
                                key === "joining_date"
                            ) {
                                displayValue = dayjs(value as string)
                                    .tz("Asia/Kolkata")
                                    .format("DD-MM-YYYY hh:mm A");
                            }

                            
                            else if (
                                key === "inquiryDomain" &&
                                value &&
                                typeof value === "object"
                            ) {
                                displayValue =
                                    (value as { domainName?: string })
                                        ?.domainName ?? "";
                            }

                            
                            else if (
                                value &&
                                typeof value === "object"
                            ) {
                                displayValue = JSON.stringify(value);
                            }

                             
                            else {
                                displayValue = String(value ?? "");
                            }

                            return (
                                <div
                                    key={key}
                                    className="flex items-center gap-6 my-8 border-b border-gray-100 pb-2"
                                >
                                    <span className="text-base font-bold text-[#00bad1]">
                                        {key}:
                                    </span>

                                    <p className="text-gray-700 mt-1">
                                        {displayValue}
                                    </p>
                                </div>
                            );
                        })}
                </div>

                <Link
                    href="/admin/dashboard/deleted-user/"
                    className="inline-flex bg-[#00bad1] text-white items-center gap-1 px-4 py-2 rounded-md hover:opacity-90 transition"
                >
                    <IoIosArrowRoundBack size={24} />
                    Go Back
                </Link>

            </div>
        </section>
    );
}