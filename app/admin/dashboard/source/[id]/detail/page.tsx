'use client';

import { fetcher } from "@/lib/fetcherSwr";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import useSWR from "swr";
import utc from "dayjs/plugin/utc";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import SpinnerCircle4 from "@/components/spinner-10";

dayjs.extend(utc);

export default function Page() {

    const params = useParams();
    const { id } = params;

    const { data, error, isLoading } = useSWR(`/api/admin/dashboard/source/${id}`, fetcher);

    if (isLoading) {
        return <SpinnerCircle4 />
    }

    if (error) {
        return <div className="p-6 text-red-500">Failed to load response.</div>;
    }

    const fields = {
        Source: data?.source,
        Status: data?.status,
        "Added On": data?.createdAt
            ? dayjs(data.createdAt).utc().format("DD-MM-YYYY hh:mm A")
            : "-",
    };

    return (
        <section className="px-3">
            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/admin/dashboard/` },
                        { label: "Source", href: `/admin/dashboard/source` },
                        { label: "Detail", isPage: true },
                    ]}
                />
            </div>
            <div className="bg-white p-8 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.15)] space-y-6">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <h1 className="text-2xl text-gray-700 mx-auto lg:mx-0">Source Detail</h1>
                </div>

                <div>
                    {Object.entries(fields).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-center gap-6 my-8 border-b border-gray-100 pb-2"
                        >
                            <span className="text-base font-bold text-[#00bad1]">
                                {key}:
                            </span>
                            <p className="text-gray-700 mt-1">
                                {String(value ?? "-")}
                            </p>
                        </div>
                    ))}
                </div>

                <Link
                    href={`/admin/dashboard/source`}
                    className="inline-flex bg-[#00bad1] text-white items-center gap-1 px-4 py-2 rounded-md hover:opacity-90 transition"
                >
                    <IoIosArrowRoundBack size={24} />
                    Go Back
                </Link>
            </div>
        </section>
    );
}