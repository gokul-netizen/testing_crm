'use client';

import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import { useParams } from 'next/navigation';
import DataTableComponent from "@/app/components/DataTable";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";

import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { exportExcelDataInquiry } from "@/lib/export-excel-data";
import { timeSince } from "@/lib/time-ago";

dayjs.extend(utc);

type DataItem = {
    id: string | number;
    name: string;
    companyName: string;
    phone: number;
    followUpStatus: string;
    createdAt: string;
    service: string;
    phoneSecondary: string;
    response: any;

    followups: {
        date: string;
        time: string;
        createdAt: string;
        remarks: string;
        assignToName: string;
        addedByUser: { name: string }
    }[]
    assigns: {
        assignDate: string;
        assignTime: string;
        createdAt: string;
        remarks: string;
    }[]
};

export default function Page() {

    const params = useParams();
    const user_id = params.user_id;

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    const { data, error, isLoading } = useSWR(`/api/user/dashboard/total-followups`, fetcher);

 

    if (isLoading) return <SpinnerCircle4 />;

    if (error) return <div className="p-4 text-red-500">Failed to load users.</div>;

    const detailLink = (id: string | number) => `/user/total-followups/${id}`;

    const columns = [
        {
            header: "Name",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={detailLink(item.id)}>
                        <span className="truncate">{item.name}</span>
                    </Link>
                    <CopyText text={item.name} />
                </div>
            ),
        },
        {
            header: "company Name",
            mobileHeader: "CN",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={detailLink(item.id)}>
                        <span>{item.companyName || "-"}</span>
                    </Link>
                    {item.companyName && <CopyText text={item.companyName} />}
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={detailLink(item.id)}>
                        <span>{item.phone || "-"}</span>
                    </Link>
                    {item.phone && <CopyText text={String(item.phone)} />}
                </div>
            ),
        },
        {
            header: "added by",
            accessor: (item: DataItem) =>
                item.followups?.[0]?.addedByUser?.name ? (
                    <div className="flex items-center gap-2 group">
                        <Link href={detailLink(item.id)}>
                            <span>{item.followups[0].addedByUser.name}</span>
                        </Link>

                        <CopyText text={item.followups[0].addedByUser.name} />
                    </div>
                ) : (
                    "-"
                ),

        },
        {
            header: "Status",
            accessor: (item: DataItem) => {
                const statusColors: Record<string, string> = {
                    "Follow Up": "text-green-600 font-medium",
                    "Not Interested": "text-orange-500 font-medium",
                    "Closed": "text-red-600 font-medium",
                    "Assign To": "text-blue-500 font-medium"
                };

                const colorClass = statusColors[item.followUpStatus] || "text-gray-500";

                const isFollowUp = item.followUpStatus === "Follow Up" || item.followUpStatus === "Assign To";
                const remarks = item.followups?.[0]?.remarks || item.assigns?.[0]?.remarks;

                return (
                    <div className="group relative">
                        <Link className="truncate flex flex-col" href={detailLink(item.id)}>

                            <span className={colorClass}> {item.followUpStatus === "Assign To" ? `${item.followUpStatus} ${item.followups[0]?.assignToName.slice(0, 10) ?? ""}...` : item.followUpStatus}</span>


                            <div className="flex gap-2">
                                <span>
                                    {isFollowUp && item.followups?.[0]?.date && item.followups[0].date !== "Invalid Date"
                                        ? item.followups[0].date
                                        : isFollowUp && item.assigns?.[0]?.assignDate
                                            ? <span className="text-blue-600">{item.assigns[0].assignDate}</span>
                                            : null}
                                </span>

                                <span>
                                    {isFollowUp && item.followups?.[0]?.time && item.followups[0].time !== "Invalid Date"
                                        ? item.followups[0].time
                                        : isFollowUp && item.assigns?.[0]?.assignTime
                                            ? <span className="text-blue-600">{item.assigns[0].assignTime}</span>
                                            : null}
                                </span>

                            </div>


                            <span>
                                {timeSince(
                                    item.followups?.[0]?.createdAt ??
                                    item.assigns?.[0]?.createdAt ??
                                    item.createdAt
                                )}
                            </span>

                        </Link>

                        {remarks && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10">
                                {remarks}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Added On",
            accessor: (item: DataItem) => (
                <Link className="truncate " href={detailLink(item.id)}>
                    {dayjs.utc(item.createdAt).format("DD-MM-YYYY hh:mm A")}
                </Link>
            ),
        },
    ];


    return (
        <section className="">

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/user` },
                        { label: "Records", isPage: true },
                    ]}
                />
            </div>

            <DataTableComponent
                title="Total Followups"
                columns={columns}
                data={data ?? []}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                detail={(item) => `/user/total-followups/${item.id}`}
                
                onExcel={() => exportExcelDataInquiry(data ?? [])}
                whatsapp={(item) => item?.phone}
                mobileCall={(item) => String(item?.phone)}
            />

        </section>
    );
}