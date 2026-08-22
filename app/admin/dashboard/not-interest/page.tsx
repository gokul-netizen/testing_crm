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

dayjs.extend(utc);


type DataItem = {

    inquiry: {
        id: number, name: string, companyName: string, phone: number, domain: {
            domainName: string,
        }
    };
    date: string;
    time: string;
    remarks: string;
    followUpStatus: string;
    createdAt: string;
    assignToName: string;
    addedByUser: { id: number, name: string }
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/admin/dashboard/not-interested", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/not-interest/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry.name}</span>
                    </Link>
                    <CopyText text={item.inquiry.name} />
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item.inquiry.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/not-interest/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry.phone}</span>

                    </Link>
                    <CopyText text={item.inquiry.phone} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Company Name",
            accessor: (item) => (
                item.inquiry.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/not-interest/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry.companyName}</span>

                    </Link>
                    <CopyText text={item.inquiry.companyName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Domain Name",
            accessor: (item) => (
                item.inquiry?.domain?.domainName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/not-interest/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.domain?.domainName}</span>

                    </Link>
                    <CopyText text={item.inquiry?.domain?.domainName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Added By",
            accessor: (item) => (
                item.addedByUser?.name ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/not-interest/${item.inquiry.id}`}>
                        <span className="truncate">{item.addedByUser?.name}</span>

                    </Link>
                    <CopyText text={item.addedByUser?.name} />
                </div>
                ) : "_"
            ),
        },


        {
            header: "Status", accessor: (item) => (
                <Link href={`/admin/dashboard/not-interest/${item.inquiry.id}`}>

                    <span className="text-orange-600 shrink-0">{item.followUpStatus}</span>
                </Link>
            )
        },

    ];

     

    return (
        <section className="p-4">


            <div className="flex justify-end">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/admin/dashboard` },
                        { label: "Not-interested", href: `/admin/dashboard/not-interest` },

                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                    title="Not Interested"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item) => `/admin/dashboard/not-interest/${item.inquiry.id}`}
                    whatsapp={(item) => item.inquiry.phone}


                />
            </div>
        </section>
    )
}