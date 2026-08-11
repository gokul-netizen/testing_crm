'use client';

import { fetcher } from "@/lib/fetcherSwr";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoIosArrowRoundBack, IoMdTime } from "react-icons/io";
import { IoTrendingUpOutline } from "react-icons/io5";
import useSWR from "swr";
import utc from "dayjs/plugin/utc";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import SpinnerCircle4 from "@/components/spinner-10";

dayjs.extend(utc);



export default function Page() {

    const params = useParams();
    const { id } = params;
    const { data, error, isLoading } = useSWR(`/api/admin/master/source/${id}`, fetcher);

    if (isLoading) {
        return <SpinnerCircle4 />
    }


    const fields = [
        {
            label: "Source",
            value: data?.source,
            icon: <MdOutlineMiscellaneousServices size={20} />
        },
        {
            label: "Status",
            value: data?.status,
            icon: <IoTrendingUpOutline size={20} />
        },
        {
            label: "Added On",
            value: data?.createdAt ? dayjs(data.createdAt).utc().format("DD-MM-YYYY hh:mm A") : "-",
            icon: <IoMdTime size={20} />
        },

    ];

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full  bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:flex lg:justify-start">Source Detail</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {fields.map((field) => (
                        <div key={field.label} className="flex flex-col gap-1">

                            <label className="block text-gray-500 text-sm">
                                {field.label}
                            </label>

                            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">

                                <div className="px-3   flex items-center">
                                    {field.icon}
                                </div>

                                <div className="h-10 w-px bg-gray-300" />

                                <input
                                    type="text"
                                    value={String(field.value ?? "")}
                                    readOnly
                                    className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                                />

                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center flex justify-start ">
                    <Link
                        href={`/admin/dashboard/masters/source`}
                        className="inline-flex bg-[#00bad1] text-white justify-center  gap-0.5 items-center  px-6 py-2 rounded-sm   transition"
                    >
                        Go Back
                        <IoIosArrowRoundBack />
                    </Link>
                </div>
            </div>
        </div>
    );
}