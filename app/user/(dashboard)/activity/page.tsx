'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { timeSince } from "@/lib/time-ago";
import { userExcelData } from "@/lib/export-excel-data";
 

dayjs.extend(utc);


type DataItem = {
    id: number;
    inquiry: { id: number, name: string, email: string, phone: number };
    date: string;
    time: string;
    remarks: string;
    createdAt: string;
    followUpStatus: string;
    assignToName: string;
    addedByUser : { name : string}
};

export default function Page() {

    const params = useParams();
    const { user_id } = params;

    const { data, error, isLoading } = useSWR(`/api/user/dashboard/activity`, fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/activity/${item.inquiry.id}`}><span className="truncate">{item.inquiry?.name}</span></Link>
                    <CopyText text={item.inquiry?.name} />
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item.inquiry?.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/user/activity/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.phone}</span>
                    </Link>
                    <CopyText text={item.inquiry?.phone} />
                </div>
                ) : "_"
            ),
        },
        
        {
            header: "added by",
            mobileHeader: "AddedBy",
            accessor: (item) => (
                item?.addedByUser?.name ? (<div className="flex items-center gap-2 group">
                    <Link href={`/user/activity/${item.inquiry.id}`}>
                        <span className="truncate">{item?.addedByUser?.name}</span>
                    </Link>
                    <CopyText text={item?.addedByUser?.name} />
                </div>
                ) : "_"
            ),
        },
        
        {
            header: "Status",
            accessor: (item) => (
                <div className="flex items-center gap-2 group relative ">
                    <Link href={`/user/activity/${item.inquiry.id}`}>
                        <span className="truncate text-green-500">{item.followUpStatus === "Assign To" ? `Assign To ${item.assignToName.slice(0,10)}...` : item.followUpStatus}</span>
                        <div className="flex gap-2">
                            <span className="truncate text-green-500">{item.date}</span>
                            <span className="truncate text-green-500">{item.time}</span>
                        </div>
                        <span>{timeSince(item.createdAt)}</span>
                    </Link>

                    <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-17">
                        {item.remarks}
                    </div>
                </div>
            ),
        },
    ];

 
    return (
        <section>

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/user` },
                        { label: "Today Activity", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                
                    title="Today Activity"
                    columns={columns}
                    data={data?.data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item) => `/user/activity/${item.inquiry.id}`}
                    onExcel={()=> userExcelData(data , "Todays follow up")}
                    whatsapp={(item)=> item?.inquiry?.phone}
                     mobileCall={(item)=> String(item?.inquiry?.phone)}

                     
                />
            </div>
        </section>
    )
}