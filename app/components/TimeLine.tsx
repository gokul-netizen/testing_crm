'use client';

import { MoreVertical } from 'lucide-react';
import { fetcher } from '@/lib/fetcherSwr';
import useSWR from 'swr';
import { LuLayoutList } from 'react-icons/lu';
import SpinnerCircle4 from '@/components/spinner-10';
import { timeSince } from '@/lib/time-ago';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FollowUpPanel from './FollowUpPanel';
import { useState } from 'react';

dayjs.extend(utc);

type Props = {
    inquiryId: string | number;
    apiUrl?: string;
};

export default function TimeLine({ inquiryId, apiUrl }: Props) {
    const [openAllRemarks, setOpenAllRemarks] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const { data, isLoading, error } = useSWR(
        `/api/user/inquiry/view/inquiry/${inquiryId}/timeline`,
        fetcher
    );

    console.log("Data :", data);

    const timeLine = data?.history;
    const inquiryDetail = data?.inquiryDetail;

    if (isLoading) return <SpinnerCircle4 />;

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">
                Error loading data.
            </div>
        );
    }

    const getDotColor = (index: number) => {
        const colors = [
            'bg-[#7367f0]',
            'bg-[#28c76f]',
            'bg-[#00cfe8]',
        ];

        return colors[index % colors.length];
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-[0_2px_10px_0_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col min-h-[600px]">

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    <LuLayoutList
                        size={22}
                        className="text-[#6f6b7d]"
                    />

                    <h2 className="text-[18px] font-semibold text-[#5d596c]">
                        Follow Up Timeline
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-[#a5a3ae] hover:text-gray-600">
                        <MoreVertical size={20} />
                    </button>

                    <FollowUpPanel
                        inquiryId={inquiryId}
                        usersApi={apiUrl}
                    />
                </div>
            </div>


            <div className="bg-[#7367f0] p-4 rounded grid grid-cols-1 md:grid-cols-3 gap-1 text-white/90">
                <p>
                    <span className="text-white font-semibold">
                        Company:
                    </span>{' '}
                    {inquiryDetail?.companyName}
                </p>

                <p>
                    <span className="text-white font-semibold">
                        Name:
                    </span>{' '}
                    {inquiryDetail?.name}
                </p>

                <p>
                    <span className="text-white font-semibold">
                        Phone:
                    </span>{' '}
                    {inquiryDetail?.phone}
                </p>

                <p>
                    <span className="text-white font-semibold">
                        Email:
                    </span>{' '}
                    {inquiryDetail?.email || 'No email'}
                </p>

                <p>
                    <span className="text-white font-semibold">
                        Added On:
                    </span>{' '}
                    {dayjs(inquiryDetail?.createdAt)
                        .utc()
                        .format('DD-MM-YYYY hh:mm A')}
                </p>

                <p>
                    <span className="text-white font-semibold">
                        Domain Name:
                    </span>{' '}
                    {inquiryDetail?.domain?.domainName || 'No Domain'}
                </p>

                <div className="  space-y-2 ">


                    {inquiryDetail?.address?.trim() && (
                        <p className="text-gray-700">
                            <span className="font-semibold text-white">
                                Address:
                            </span>{' '}

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    inquiryDetail.address.trim()
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white "
                            >
                                {inquiryDetail.address.trim()}
                            </a>
                        </p>
                    )}


                    {inquiryDetail?.followups?.[0]?.address?.trim() && (
                        <p className="text-gray-700">
                            <span className="font-semibold text-white">
                                Visit Address:
                            </span>{' '}

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    inquiryDetail.followups[0].address.trim()
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="   text-white"
                            >
                                {inquiryDetail.followups[0].address.trim()}
                            </a>
                        </p>
                    )}

                </div>
            </div>




            {/* Remarks Toggle */}
            <div className="flex justify-end m-2">
                <button
                    type="button"
                    onClick={() =>
                        setOpenAllRemarks((prev) => !prev)
                    }
                    className="w-30 p-0.5 cursor-pointer rounded-md bg-[#7367f0] text-white text-sm font-medium transition-all duration-200 hover:bg-[#6254e8] active:scale-95 shadow-md"
                >
                    {openAllRemarks
                        ? 'See All Remarks'
                        : 'Close All Remarks'}
                </button>
            </div>

            {/* Timeline */}
            <div className="px-2 py-4 md:px-8 md:py-0 pb-8 flex-1">

                {timeLine?.length > 0 ? (
                    timeLine.map(
                        (item: any, index: number) => (
                            <div
                                key={item.id || index}
                                className="flex gap-5 relative group"
                            >

                                {/* Timeline Dot */}
                                <div className="flex flex-col items-center">

                                    <div
                                        className={`w-3.5 h-3.5 rounded-full mt-1.5 z-10 ${getDotColor(
                                            index
                                        )} border-2 border-white ring-1 ring-gray-100`}
                                    />

                                    {index !==
                                        timeLine.length - 1 && (
                                            <div className="w-[1px] h-full bg-[#dbdade] absolute top-4 left-[6.5px]" />
                                        )}
                                </div>

                                {/* Timeline Content */}
                                <div className="flex-1 pb-8">

                                    <div className="flex justify-between items-start">

                                        <div className="flex flex-col gap-1">

                                            {/* Status */}
                                            <h3 className="text-[15px] font-bold text-[#5d596c] uppercase">
                                                {item.type === 'assign' ||
                                                    item.followUpStatus ===
                                                    'Assign To'
                                                    ? `Assign To ${item.assignedToName}`
                                                    : item.followUpStatus}
                                            </h3>

                                            {/* Date & Time */}
                                            {item.date && (
                                                <div>
                                                    <p className="text-[14px] text-[#a5a3ae] font-medium">
                                                        {item.date} |{' '}
                                                        {item.time}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Mobile Timeline Info */}
                                            <div className="md:hidden">

                                                <p>
                                                    {timeSince(
                                                        item.createdAt
                                                    )}

                                                    <span className="text-[13px] px-2 text-blue-700">
                                                        {item.addedByName}
                                                    </span>
                                                </p>

                                                {!openAllRemarks && (
                                                    <div>
                                                        <p
                                                            className={`text-base text-[#6f6b7d] ${expandedIndex ===
                                                                    index
                                                                    ? ''
                                                                    : 'line-clamp-2'
                                                                }`}
                                                        >
                                                            {item.remarks}
                                                        </p>

                                                        {item.remarks
                                                            ?.length >
                                                            80 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setExpandedIndex(
                                                                            expandedIndex ===
                                                                                index
                                                                                ? null
                                                                                : index
                                                                        )
                                                                    }
                                                                    className="mt-1 text-sm cursor-pointer text-[#7367f0] hover:underline"
                                                                >
                                                                    {expandedIndex ===
                                                                        index
                                                                        ? 'Read Less'
                                                                        : 'Read More'}
                                                                </button>
                                                            )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Desktop Remarks */}
                                            {!openAllRemarks && (
                                                <div>
                                                    <p
                                                        className={`hidden md:flex text-base text-[#6f6b7d] ${expandedIndex ===
                                                                index
                                                                ? ''
                                                                : 'line-clamp-2'
                                                            }`}
                                                    >
                                                        {item.remarks}
                                                    </p>

                                                    {item.remarks
                                                        ?.length >
                                                        200 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setExpandedIndex(
                                                                        expandedIndex ===
                                                                            index
                                                                            ? null
                                                                            : index
                                                                    )
                                                                }
                                                                className="mt-1 text-sm cursor-pointer text-[#7367f0] hover:underline"
                                                            >
                                                                {expandedIndex ===
                                                                    index
                                                                    ? 'Read Less'
                                                                    : 'Read More'}
                                                            </button>
                                                        )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Desktop User Info */}
                                        <div className="hidden md:flex flex-col shrink-0">
                                            <span className="text-[13px] text-[#a5a3ae]">
                                                {timeSince(
                                                    item.createdAt
                                                )}
                                            </span>

                                            <span className="text-[13px] text-blue-700">
                                                {item.addedByName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className="text-center text-[#a5a3ae] py-20 font-medium">
                        No follow-up history found.
                    </div>
                )}

            </div>
        </div>
    );
}