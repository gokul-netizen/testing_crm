'use client';

import { fetcher } from "@/lib/fetcherSwr";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import useSWR, { mutate } from "swr";
import utc from "dayjs/plugin/utc";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import SpinnerCircle4 from "@/components/spinner-10";
import { useEffect, useState } from "react";
import { toast } from "sonner";

dayjs.extend(utc);

export default function Page() {
    const params = useParams();
    const { id } = params;
    const router = useRouter()
    const [source, setSource] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const { data, isLoading } = useSWR(
        `/api/admin/dashboard/source/${id}`,
        fetcher
    );

    useEffect(() => {
        if (data) {
            setSource(data.source);
            setStatus(data.status);
        }
    }, [data])

    if (isLoading) {
        return <SpinnerCircle4 />;
    }

    const handleUpdate = async () => {
        setLoading(true);

        try {

            const res = await fetch(`/api/admin/dashboard/source/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source, status }),
            });
            
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to update");
             
            mutate(`/api/source/${id}`)
            toast.success(data.message || "Updated Successfully");
            router.push(`/admin/dashboard/source`);


        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full bg-white rounded-lg shadow-xl p-6">

                <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:flex lg:justify-start">
                    Edit Source
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">Source</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <MdOutlineMiscellaneousServices size={20} />
                            </div>
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Status</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Active"
                                    checked={status === "Active"}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="accent-[#7367f0]"
                                />
                                Active
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Blocked"
                                    onChange={(e) => setStatus(e.target.value)}
                                    checked={status === "Blocked"}
                                    className="accent-red-600"
                                />
                                Blocked
                            </label>
                        </div>
                    </div>
                </div>


                <div className="mt-6 text-center flex gap-3 justify-start">

                    <button
                        onClick={handleUpdate}
                        className="bg-[#7367f0] text-white px-6 py-2 cursor-pointer rounded-sm hover:bg-[#4f43cf] transition"
                    >
                        {loading ? "Updating" : "Update Service"}
                    </button>

                    <Link
                        href={`/admin/dashboard/source`}
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