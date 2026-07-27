'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { MdDomain } from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcherSwr';

export default function Page() {
    const router = useRouter();

    const [domainName, setDomainName] = useState('');
    const [subscription, setSubscription] = useState<number>(0);
    const [status, setStatus] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const { id } = params

    const { data, error, isLoading } = useSWR(`/api/active-domain/${id}`, fetcher);
    const detailData = data?.data;
    
 

    useEffect(() => {
    if (detailData) {
        setDomainName(detailData.domainName ?? '');
        setSubscription(detailData.subscription ?? 0);
        setStatus(detailData.status ?? '');
        setIsDeleted(detailData.isDeleted ?? false);
    }
}, [detailData]);


    const handleUpdate = async () => {
        setLoading(true);

   

        try {
            const res = await fetch(`/api/active-domain/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    domainName,
                    subscription,
                    status,
                    isDeleted,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || 'Failed to update domain'
                );
            }

            mutate(`/api/domain/${id}`);

            toast.success('Domain updated successfully');

            router.push(`/admin/dashboard/deleted-domain`);
             
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
                    Edit Domain
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Domain Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">
                            Domain Name
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <MdDomain size={20} />
                            </div>

                            <div className="h-10 w-px bg-gray-300" />

                            <input
                                type="text"
                                value={domainName}
                                onChange={(e) =>
                                    setDomainName(e.target.value)
                                }
                                className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Subscription */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500 text-sm">
                            Subscription
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 flex items-center">
                                <FaCrown size={18} />
                            </div>

                            <div className="h-10 w-px bg-gray-300" />

                            <input
                                type="number"
                                value={subscription}
                                onChange={(e) =>
                                    setSubscription(Number(e.target.value))
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

                    {/* Delete Status */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">
                            Delete Status
                        </label>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="deleted"
                                    checked={!isDeleted}
                                    onChange={() =>
                                        setIsDeleted(false)
                                    }
                                    className="accent-[#7367f0]"
                                />
                                No
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="deleted"
                                    checked={isDeleted}
                                    onChange={() =>
                                        setIsDeleted(true)
                                    }
                                    className="accent-red-600"
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
                        {loading ? 'Updating...' : 'Update Domain'}
                    </button>

                    <Link
                        href="/admin/dashboard/masters/deleted-domains"
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