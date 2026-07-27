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


type DataItem = {

    inquiry: { id: number, name: string, companyName: string, phone: number };
    date: string;
    time: string;
    remarks: string;
    followUpStatus: string;
    createdAt: string;
    assignToName: string,
    isPublic: string,
    addedBy: string,

};

export default function Page() {

    const params = useParams();
    const { id } = params;

    const { data, error, isLoading } = useSWR(`/api/sub-user/dashboard/upcoming-followups`, fetcher);

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>

    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/upcoming-followups/${item.inquiry.id}`}><span className="truncate">{item.inquiry?.name}</span></Link>
                    <CopyText text={item.inquiry?.name} />
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item.inquiry?.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/upcoming-followups/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.phone}</span>
                    </Link>
                    <CopyText text={item.inquiry?.phone} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "company Name",
            mobileHeader: "CN",
            accessor: (item) => (
                item.inquiry?.companyName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/upcoming-followups/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.companyName}</span>
                    </Link>
                    <CopyText text={item.inquiry?.companyName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Status",
            accessor: (item) => (
                <div className="flex items-center gap-2 group relative ">
                    <Link href={`/sub-user/upcoming-followups/${item.inquiry.id}`}>
                        <span className="truncate text-purple-500">{item.followUpStatus === "Assign To" ? `Assign To ${item.assignToName}` : item.followUpStatus}</span>
                        <div className="flex gap-2">
                            <span className="truncate text-purple-500">{item.date}</span>
                            <span className="truncate text-purple-500">{item.time}</span>
                        </div>
                        <span >{timeSince(item.createdAt)}</span>
                    </Link>

                    {(item.isPublic || Number(item.addedBy) === Number(id)) && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10">
                                {item?.remarks}
                            </div>
                        )}
                        
                </div>
            ),
        },
    ];


    return (
        <section>

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/sub-user/${id}/` },
                        { label: "Upcoming", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                    title="Upcoming"
                    columns={columns}
                    data={data?.upcoming ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item) =>  `/sub-user/upcoming-followups/${item.inquiry.id}`}
                    onExcel={() => userExcelData(data, "Todays follow up")}
                    whatsapp={(item)=> item?.inquiry?.phone}    
                     mobileCall={(item)=> String(item?.inquiry?.phone)}

                />
            </div>
        </section>
    )
}