'use client';

import { fetcher } from "@/lib/fetcherSwr";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowRoundBack, IoMdContact } from "react-icons/io";
import useSWR, { mutate } from "swr";
import utc from "dayjs/plugin/utc";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import SpinnerCircle4 from "@/components/spinner-10";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaPhoneAlt, FaRegBuilding } from "react-icons/fa";

dayjs.extend(utc);

export default function Page() {
    const params = useParams();
    const { user_id, id } = params;
    const router = useRouter()
    const [service, setService] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

   

     

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full bg-white rounded-lg shadow-xl p-6">

                <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:flex lg:justify-start">
                    Edit Inquiry
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">Company Name</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <FaRegBuilding  size={20} />
                            </div>
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">Name</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <IoMdContact   size={20} />
                            </div>
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">Phone Number</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <FaPhoneAlt    size={20} />
                            </div>
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">Secondary Phone Number</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <FaPhoneAlt    size={20} />
                            </div>
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">Secondary Phone Number</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <FaPhoneAlt    size={20} />
                            </div>
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>


                 
                </div>


                <div className="mt-6 text-center flex gap-3 justify-start">

                    <button
                        
                        className="bg-[#7367f0] text-white px-6 py-2 cursor-pointer rounded-sm hover:bg-[#4f43cf] transition"
                    >
                        {loading ? "Updating" : "Update Service"}
                    </button>

                    <Link
                        href={`/user/master/service`}
                        className="inline-flex bg-[#00bad1] text-white justify-center gap-0.5 items-center px-6 py-2 rounded-sm"
                    >
                        Go Back
                        <IoIosArrowRoundBack />
                    </Link>
                </div>

            </div>
        </div>
    );
}