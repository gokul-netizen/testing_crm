'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import Link from "next/link";

dayjs.extend(utc);


type DataItem = {
    id: number;
    name: string;
    email: string;
    phone: string;
    domain: { domainName: string }
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/admin/dashboard/active-inquiries", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                item.name ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/active-inquiry/${item.id}`}><span className="truncate">{item.name}</span></Link>
                    <CopyText text={item.name} />
                </div>) : "-"
            ),
        },
        {
            header: "Domain",
            accessor: (item) => (
                item.domain ? (<div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/active-inquiry/${item.id}`}><span className="truncate">{item.domain?.domainName} </span></Link>

                    <CopyText text={String(item.domain?.domainName)} />
                </div>
                ) : "-"
            ),
            className: "truncate"
        },
        {
            header: "email",
            accessor: (item) => (
                item.email ? (
                    <div className="flex items-center gap-2 group">
                        <Link href={`/admin/dashboard/active-inquiry/${item.id}`}><span className="truncate">{item.email} </span></Link>

                        <CopyText text={String(item.email)} />
                    </div>
                ) : "-"
            ),
        },

       { 
        header: "phone", 
        accessor: (item) => (
            item.phone ? (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/active-inquiry/${item.id}`}>
                        <span className="truncate">{item.phone}</span>
                    </Link>
                    <CopyText text={String(item.phone)} />
                </div>
            ) : "-"
        ),
    },
    ];


    return (
        <section className="p-4">

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/admin/dashboard/` },
                        { label: "Active Inquiry", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                    title="Active Inquiries"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    
                    detail={(item)=> `/admin/dashboard/active-inquiry/${item.id}`}

                />
            </div>
        </section>
    )
}