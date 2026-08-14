'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import { useParams } from "next/navigation";
import Link from "next/link";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { timeSince } from "@/lib/time-ago";
import { userExcelData } from "@/lib/export-excel-data";


dayjs.extend(utc);


type FollowUp = {

    date: string;
    time: string;
    remarks: string;
    followUpStatus: string;
    createdAt: string;
    assignToName: string,
    addedBy: string;
    isPublic: boolean;

}

type DataItem = {

    id: number,
    name: string,
    companyName: string,
    phone: number | string
    followups: FollowUp[]

};


export default function Page() {

    const params = useParams();
    const { id } = params;

    const { data, error, isLoading } = useSWR(`/api/sub-user/dashboard/newly-assigned-followups`, fetcher);

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>

    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/new-assigned-followups/${item.id}`}><span className="truncate">{item?.name}</span></Link>
                    <CopyText text={item?.name} />
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item?.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/new-assigned-followups/${item.id}`}>
                        <span className="truncate">{item?.phone}</span>
                    </Link>
                    <CopyText text={item?.phone} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "company Name",
            mobileHeader: "CN",
            accessor: (item) => (
                item?.companyName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/new-assigned-followups/${item.id}`}>
                        <span className="truncate">{item?.companyName}</span>
                    </Link>
                    <CopyText text={item?.companyName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Status",
            accessor: (item) => {
                const followup = item.followups[0];

                if (!followup) return "_";

                return (
                    <div className="flex items-center gap-2 group relative">
                        <Link href={`/sub-user/new-assigned-followups/${item.id}`}>
                            <span className="truncate text-blue-500">
                                {followup.followUpStatus === "Assign To"
                                    ? `Assign To ${followup.assignToName}`
                                    : followup.followUpStatus}
                            </span>

                            <div className="flex gap-2">
                                <span>{followup.date}</span>
                                <span>{followup.time}</span>
                            </div>

                            <span>{timeSince(followup.createdAt)}</span>
                        </Link>

                        {(followup.isPublic ||
                            Number(followup.addedBy) === Number(id)) && (
                                <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10">
                                    {followup.remarks}
                                </div>
                            )}
                    </div>
                );
            },
        }
    ];


    return (
        <section>

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/sub-user` },
                        { label: "Assigned", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent

                    title="Newly Assigned Follow up"
                    columns={columns}
                    data={data?.data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item) => `/sub-user/new-assigned-followups/${item.id}`}
                    onExcel={() => userExcelData(data, "Todays follow up")}
                    
                    mobileCall={(item) => String(item?.phone)}

                />
            </div>
        </section>
    )
}