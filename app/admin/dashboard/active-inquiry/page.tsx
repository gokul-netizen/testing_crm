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

dayjs.extend(utc);


type DataItem = {
    id: number;
    name: string;
    email: string;
    phone: string;
    domain: { domainName: string }
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/active-inquiry", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                item.name ? (<div className="flex items-center gap-2 group">
                    <span className="truncate">{item.name}</span>
                    <CopyText text={item.name} />
                </div>) : "-"
            ),
        },
        {
            header: "Domain",
            accessor: (item) => (
                item.domain ? (<div className="flex items-center gap-2 group">
                    <span className="truncate">{item.domain?.domainName} </span>
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
                        <span className="truncate">{item.email} </span>
                        <CopyText text={String(item.email)} />
                    </div>
                ) : "-"
            ),
        },
        { header: "phone", accessor: "phone" },

    ];

    const handleUndo = async () => {
        console.log("Undo")
    }

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
                    onEdit={() => "edit page"}
                    onActivate={handleUndo}
                />
            </div>
        </section>
    )
}