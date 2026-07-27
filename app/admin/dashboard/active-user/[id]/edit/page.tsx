'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowRoundBack } from 'react-icons/io';
import {   MdOutlineMail, MdOutlinePersonOutline } from 'react-icons/md';
import {   FaPhoneAlt } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcherSwr';

export default function Page() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<number>(0);
    const [status, setStatus] = useState('');
    const [isEmail, setIsEmail] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const { id } = params

    const { data, error, isLoading } = useSWR(`/api/active-user/${id}`, fetcher);
    const detailData = data?.data;

 
    
 

    useEffect(() => {
    if (detailData) {
        setName(detailData.name ?? '');
        setEmail(detailData.email ?? '');
        setStatus(detailData.status ?? '');
        setMobile(detailData.mobile_no ?? '');
        setIsEmail(detailData.emailTriggerOption ?? false);
    }
}, [detailData]);


    const handleUpdate = async () => {
        setLoading(true);
        
        try {
            const res = await fetch(`/api/active-user/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    status,
                    emailTriggerOption : isEmail,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || 'Failed to update domain'
                );
            }

            mutate(`/api/active-user`);

            toast.success('Domain updated successfully');

            router.push(`/admin/dashboard/active-user   `);
             
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full bg-white rounded-lg shadow-xl p-6">

                <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:flex lg:justify-start">
                    Edit User
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Domain Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">
                             Name
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <MdOutlinePersonOutline  size={20} />
                            </div>

                            <div className="h-10 w-px bg-gray-300" />

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">
                            Email 
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <MdOutlineMail  size={18} />
                            </div>

                            <div className="h-10 w-px bg-gray-300" />

                            <input
                                type="text"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">
                            Mobile Number
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <FaPhoneAlt  size={18} />
                            </div>

                            <div className="h-10 w-px bg-gray-300" />

                            <input
                                type="number"
                                value={mobile}
                                onChange={(e) =>
                                    setMobile(Number(e.target.value))
                                }
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">
                            Status
                        </label>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Active"
                                    checked={status === 'Active'}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                    className="accent-[#7367f0]"
                                />
                                Active
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Blocked"
                                    checked={status === 'Blocked'}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                    className="accent-red-600"
                                />
                                Blocked
                            </label>
                        </div>
                    </div>

                    {/* email trigger Status */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">
                            Email Trigger
                        </label>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="deleted"
                                    checked={!isEmail}
                                    onChange={() =>
                                        setIsEmail(false)
                                    }
                                    className="accent-red-600"
                                />
                                No
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="deleted"
                                    checked={isEmail}
                                    onChange={() =>
                                        setIsEmail(true)
                                    }
                                    className="  accent-[#7367f0]"
                                />
                                Yes
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center flex gap-3 justify-start">

                    <button
                        onClick={handleUpdate}
                        className="bg-[#7367f0] text-white px-6 py-2 cursor-pointer rounded-sm hover:bg-[#4f43cf] transition"
                    >
                        {loading ? 'Updating...' : 'Update User'}
                    </button>

                    <Link
                        href="/admin/dashboard/active-user"
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