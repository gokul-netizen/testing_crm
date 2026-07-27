'use client';

import { MoreVertical } from 'lucide-react';
import { fetcher } from '@/lib/fetcherSwr';
import useSWR from 'swr';
import { LuLayoutList } from 'react-icons/lu';
import SpinnerCircle4 from '@/components/spinner-10';
import { timeSince } from '@/lib/time-ago';
import SubUserFollowUpPanel from '@/app/components/SubUserFollowUpPanel';
import dayjs from 'dayjs';
import { FaRegEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface Props {



    inquiryId: string | number;
    url?: string;

}

export default function TimeLine({ inquiryId, url }: Props) {

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [openAllRemarks, setOpenAllRemarks] = useState(false);

    const { data, isLoading, error } = useSWR(`/api/user/inquiry/view/inquiry/${inquiryId}/timeline`, fetcher);


    const timeLine = data?.history;
    const inquiryDetail = data?.inquiryDetail;
    const params = useParams();

    const { id } = params;

    if (isLoading) return <SpinnerCircle4 />;
    if (error) return <div className="p-10 text-center text-red-500">Error loading data.</div>;

    const getDotColor = (index: number) => {
        const colors = ['bg-[#7367f0]', 'bg-[#28c76f]', 'bg-[#00cfe8]'];
        return colors[index % colors.length];
    };

    const isWithinLastMinute = (createdAt: string) => {
        const diff = dayjs().diff(dayjs(createdAt, "YYYY-MM-DD HH:mm:ss"), "second");
        return diff <= 60;
    };



    return (
        <div className="w-full bg-white rounded-lg shadow-[0_2px_10px_0_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col min-h-[600px]">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    <LuLayoutList size={22} className="text-[#6f6b7d]" />
                    <h2 className="text-[18px] font-semibold text-[#5d596c]">Follow Up Timeline</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[#a5a3ae] hover:text-gray-600">
                        <MoreVertical size={20} />
                    </button>

                </div>
            </div>


            <div className='bg-[#7367f0] p-4'>
                <div className="  rounded grid grid-cols-1 md:grid-cols-3 gap-1 text-white/90">
                    <p><span className="text-white font-semibold">Company:</span> {inquiryDetail.companyName}</p>
                    <p><span className="text-white font-semibold">Name:</span> {inquiryDetail.name}</p>
                    <p><span className="text-white font-semibold">Phone:</span> {inquiryDetail.phone}</p>
                    <p><span className="text-white font-semibold">Email:</span> {inquiryDetail.email || "No email"}</p>
                    <p><span className="text-white font-semibold">Added On:</span> {dayjs(inquiryDetail.createdAt).utc().format("DD-MM-YYYY hh : mm A")}</p>

                </div>
                <div>
                    {
                        inquiryDetail?.followups[0]?.address ? <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inquiryDetail?.followups[0]?.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"

                        ><span className="text-white font-semibold">Address: {inquiryDetail?.followups[0]?.address}</span> </Link> : ""
                    }
                </div>

            </div>

            <div className='flex justify-end m-2'>
                <button
                    type="button"
                    onClick={() => setOpenAllRemarks(prev => !prev)}
                    className="w-30 p-0.5 cursor-pointer  rounded-md bg-[#7367f0] text-white text-sm font-medium transition-all duration-200 hover:bg-[#6254e8] active:scale-95 shadow-md"
                >
                    {openAllRemarks ? "See All Remarks" : "Close All Remarks"}
                </button>
            </div>

            <div className="px-2 md:px-8 md:pb-8 flex-1 md:py-0 ">

                {timeLine?.length > 0 ? (
                    timeLine.map((item: any, index: number) => (
                        <div key={index} className="flex gap-5 relative group">

                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-3.5 h-3.5 rounded-full mt-1.5 z-10 ${getDotColor(index)} border-2 border-white ring-1 ring-gray-100`}
                                />
                                {index !== timeLine.length - 1 && (
                                    <div className="w-[1px] h-full bg-[#dbdade] absolute top-4 left-[6.5px]" />
                                )}
                            </div>

                            <div className="flex-1 pb-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-base font-bold text-[#5d596c] uppercase">
                                            {item.type === 'assign' ? `Assigned To ${item.assignedToName}` : `${item.followUpStatus}${item.assignedToName ? ` ${item.assignedToName}` : ''}`}
                                        </h3>

                                        {item.date && item.time && (
                                            <p className="text-[14px] text-[#a5a3ae] font-medium flex items-center gap-2">
                                                <span>{item.date} | {item.time}</span>
                                            </p>
                                        )}

                                        <div >
                                            <p className='md:hidden' >{timeSince(item.createdAt)}

                                                <span className="text-[13px] px-2 text-blue-700">
                                                    {item.addedByName}
                                                </span>
                                            </p>
                                            {
                                                !openAllRemarks ? (
                                                    <div className="lg:hidden">
                                                        <p
                                                            className={`text-base text-[#6f6b7d] ${expandedIndex === index ? "" : "line-clamp-2"
                                                                }`}
                                                        >
                                                            {item.remarks}
                                                        </p>

                                                        {item.remarks?.length > 80 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setExpandedIndex(
                                                                        expandedIndex === index ? null : index
                                                                    )
                                                                }
                                                                className="mt-1 text-sm cursor-pointer text-[#7367f0] hover:underline"
                                                            >
                                                                {expandedIndex === index ? "Read Less" : "Read More"}
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : ("")
                                            }

                                        </div>


                                        {(item.isPublic || Number(item.addedById) === Number(id)) && (

                                            !openAllRemarks ? (
                                                <div className="hidden lg:block">
                                                    <p
                                                        className={`text-base text-[#6f6b7d] ${expandedIndex === index ? "" : "line-clamp-2"
                                                            }`}
                                                    >
                                                        {item.remarks}
                                                    </p>

                                                    {item.remarks?.length > 200 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setExpandedIndex(
                                                                    expandedIndex === index ? null : index
                                                                )
                                                            }
                                                            className="mt-1 text-sm cursor-pointer text-[#7367f0] hover:underline"
                                                        >
                                                            {expandedIndex === index ? "Read Less" : "Read More"}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : ("")

                                        )}

                                    </div>

                                    <div className=' hidden md:flex   flex-col  shrink-0'>
                                        <span className="text-[13px] text-[#a5a3ae]">
                                            {timeSince(item.createdAt)}
                                        </span>
                                        <span className="text-[13px] text-blue-700">
                                            {item.addedByName}
                                        </span>

                                        {isWithinLastMinute(item.createdAt) && (
                                            <Link href={`${url}/${inquiryId}/${item.id}`}><FaRegEdit className="text-blue-600 cursor-pointer" /></Link>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                ) : (
                    <div className="text-center text-[#a5a3ae] py-20 font-medium">
                        No follow-up history found.
                    </div>
                )}
            </div>
        </div>
    );
}