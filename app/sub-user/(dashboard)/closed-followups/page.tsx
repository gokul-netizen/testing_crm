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
import { userExcelData } from "@/lib/export-excel-data";
import { timeSince } from "@/lib/time-ago";

dayjs.extend(utc);


type Followup = {
    date: string | null;
    time: string | null;
    remarks: string;
    followUpStatus: string;
    createdAt: string;
    assignToName: string | null;
    addedBy: number;
    isPublic: boolean;
};


type DataItem = {
    id: number;
    name: string;
    companyName: string;
    phone: string;
    createdAt: string;
    followups: Followup[];
};


export default function Page() {

    const params = useParams();
    const { id } = params;

    const { data, error, isLoading } = useSWR(`/api/sub-user/dashboard/closed-followups`, fetcher);

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});


    if (isLoading) return <SpinnerCircle4 />;

    if (error) return <div> Error : {error.message}</div>;


  
    const tableData: DataItem[] = data?.inquiryDomain?.domainResponse ?? [];


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/closed-followups/${item.id}`}>
                        <span className="truncate">{item.name}</span>
                    </Link>
                    <CopyText text={item.name} />
                </div>
            ),
        },
        {
            header: "company Name",
            mobileHeader: "CN",
            accessor: (item) => (
                item.companyName ? (
                    <div className="flex items-center gap-2 group">
                        <Link href={`/sub-user/closed-followups/${item.id}`}>
                            <span className="truncate">{item.companyName}</span>
                        </Link>
                        <CopyText text={item.companyName} />
                    </div>
                ) : "_"
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item.phone ? (
                    <div className="flex items-center gap-2 group">
                        <Link href={`/sub-user/closed-followups/${item.id}`}>
                            <span className="truncate">{item.phone}</span>
                        </Link>
                        <CopyText text={item.phone} />
                    </div>
                ) : "_"
            ),
        },
        {
            header: "Status",
            accessor: (item: DataItem) => {

                const followup = item.followups?.[0];

                if (!followup) return "_";

                return (
                    <div className="flex items-center gap-2 group relative">

                        <Link href={`/sub-user/closed-followups/${item.id}`}>

                            <span className="truncate text-red-500">
                                {followup.followUpStatus === "Assign To"
                                    ? `Assign To ${followup.assignToName}`
                                    : followup.followUpStatus}
                            </span>

                            <div className="flex gap-2">{timeSince(followup.createdAt)} </div>

                        </Link>


                        {(followup.isPublic || Number(followup.addedBy) === Number(id)) && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10 max-w-xs">
                                {followup.remarks}
                            </div>
                        )}

                    </div>
                );
            },
        },

    ];


    return (
        <section>

            <div className="flex justify-end py-2 px-3">

                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/sub-user/${id}` },
                        { label: "Closed", isPage: true },
                    ]}
                />

            </div>


            <div>

                <DataTableComponent
                    title="Closed"
                    columns={columns}
                    data={tableData}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item: DataItem) => `/sub-user/closed-followups/${item.id}`}
                  
             
                    whatsapp={(item) => Number(item?.phone)}
                    mobileCall={(item) => String(item?.phone)}
                />

            </div>

        </section>
    );
}