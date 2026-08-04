'use client';

import { fetcher } from "@/lib/fetcherSwr";
import dayjs from "dayjs";
 
import useSWR from "swr";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import { FaUserClock } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import Link from "next/link";
 

dayjs.extend(utc);


export default function Page() {

    const { data, error, isLoading } = useSWR(`/api/sub-user`, fetcher);
 
    const active = `/api/sub-user/profile`;

    if (isLoading) return <SpinnerCircle4 />

    return (
        <section className=" flex flex-col-reverse lg:flex-row  items-start gap-4">

            <div className="bg-white shadow-xl rounded-md w-full lg:w-[40%] p-8 border border-gray-100">

                <div className="flex flex-col justify-center items-center mb-6">
                    <div className=" rounded  mb-4 shadow-sm ">

                        <img
                            src={!data?.user_image ? '/admin_profile.webp' : `/${data.user_image.replace(/\\/g, "/")}`}
                            alt={data?.username}
                            className="w-32 h-36 "
                        />

                    </div>

                    <h1 className="text-xl font-bold text-slate-700 tracking-tight uppercase">
                        {data?.username || "MARS WEB Solution"}
                    </h1>

                    <div className="flex justify-between gap-4 mb-8">

                        <div className="flex items-center gap-3 flex-1 p-3 mt-3 rounded-xl bg-purple-50/50 border border-purple-50">
                            <FaUserClock />
                            <div>
                                <p className="font-bold text-slate-700 text-base leading-tight">{dayjs.utc(data?.added_on).format("DD-MM-YYYY hh : mm A")}</p>
                                <p className="text-[11px] font-medium text-gray-400">Added On</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    <h3 className="text-gray-600 border-b-2 pb-3 font-bold text-lg">Details</h3>
                    <div className="space-y-3 text-[16px] text-gray-500">
                        <p><span className="font-bold text-gray-600">Person Name: </span> {data?.name}</p>
                        <p><span className="font-bold text-gray-600">Email: </span> {data?.email}</p>
                        <p><span className="font-bold text-gray-600">Mobile_no: </span> {data?.mobile_no}</p>
                        <p><span className="font-bold text-gray-600">Status: </span> {data?.status}</p>
                        <p><span className="font-bold text-gray-600">last_login: </span> {dayjs(data?.createdAt).format("DD-MM-YYYY hh : mm A")}</p>

                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-10">
                    <Link href={`/sub-user/profile-edit`} className="flex-1 bg-[#7C69EF] hover:bg-[#6a56e0] text-white font-bold py-3 flex items-center justify-center rounded-lg transition-all shadow-md shadow-indigo-100">
                        Edit
                    </Link>

                    <Link href={`/sub-user`} className="flex-1 flex justify-center   cursor-pointer bg-[#00BDD6] hover:bg-[#00a8bf] text-white font-bold py-3 rounded-lg transition-all shadow-md shadow-cyan-100">
                        Back ←
                    </Link>
                </div>
            </div>

            <div >
                <div className="flex  gap-4 ">
                    <button className={`flex items-center gap-2 px-6 py-2 rounded-md ${active ? "bg-[#7367f0] text-white" : ""}`}
                    >
                        <LuUsers size={20} />
                        <span className="font-semibold">Overview</span>

                    </button>

                    <Link href={`/sub-user/profile-edit`} className={`flex items-center gap-2 px-6 py-2 rounded-md  text-gray-500 hover:bg-[#cecbec]`}
                    >
                        <LuUsers size={20} />
                        <span className="font-semibold">Account</span>
                    </Link>
                </div>

                <div>

                </div>
            </div>
        </section>
    );
}