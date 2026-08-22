'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import Link from "next/link";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { timeSince } from "@/lib/time-ago";
import { userExcelData } from "@/lib/export-excel-data";


dayjs.extend(utc);


type DataItem = {
    id: number;
    inquiry: { id: number, name: string, companyName: string, phone: number , domain : {
        domainName : string,
    }};
    addedByUser : { id : number , name : string}
    date: string;
    time: string;
    remarks: string;
    createdAt: string;
    followUpStatus: string;
    assignToName: string;
    
};

export default function Page() {



    const { data, error, isLoading } = useSWR(`/api/admin/dashboard/todays-followup`, fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/todays-followup/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.name}</span>
                    </Link>

                    <CopyText text={item.inquiry?.name} />
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item.inquiry?.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/todays-followup/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.phone}</span>

                    </Link>

                    <CopyText text={item.inquiry?.phone} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "company Name",
            accessor: (item) => (
                item.inquiry?.companyName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/todays-followup/${item.inquiry.id}`}>

                        <span className="truncate">{item.inquiry?.companyName}</span>
                    </Link>

                    <CopyText text={item.inquiry?.companyName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Domain Name",
            accessor: (item) => (
                item.inquiry?.domain?.domainName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/todays-followup/${item.inquiry.id}`}>

                        <span className="truncate">{ item.inquiry?.domain?.domainName}</span>
                    </Link>

                    <CopyText text={ item.inquiry?.domain?.domainName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Added By",
            accessor: (item) => (
                item.addedByUser?.name ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/todays-followup/${item.inquiry.id}`}>

                        <span className="truncate">{ item.addedByUser?.name }</span>
                    </Link>

                    <CopyText text={ item.addedByUser?.name  } />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Status",
            accessor: (item) => (
                <div className="flex items-center gap-2 group relative ">
                    <div >
                        <Link href={`/admin/dashboard/todays-followup/${item.inquiry.id}`}>
                            <span className="truncate text-green-500">{item.followUpStatus === "Assign To" ? `Assign To ${item.assignToName}` : item.followUpStatus}</span>
                            <div className="flex gap-2">
                                <span className="truncate text-green-500">{item.date}</span>
                                <span className="truncate text-green-500">{item.time}</span>
                            </div>
                            <span>{timeSince(item.createdAt)}</span>
                        </Link>

                    </div>

                    <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-17">
                        {item.remarks}
                    </div>
                </div>
            ),
        },
    ];


    return (
        <section className="px-3">

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/admin/dashboard/` },
                        { label: "Today's follow up", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                    title="Today's Follow Up"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item) => `/admin/dashboard/todays-followup/${item.inquiry.id}` }
                    onExcel={() => userExcelData(data, "Todays follow up")}
                    whatsapp={(item) => item?.inquiry?.phone}

                />
            </div>
        </section>
    )
}