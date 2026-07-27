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
    status: string;
    inquiryDomain: { domainName: string }
    added_on: string;
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/block-user", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: "Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <span className="truncate">{item.name}</span>
                    <CopyText text={item.name} />
                </div>
            ),
        },
        {
            header: "Email",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <span className="truncate">{item.email}</span>
                    <CopyText text={String(item.email)} />
                </div>
            ),
        },
        {
            header: "Status", accessor: (item) => (
                <div className="text-red-600">{item.status}</div>
            )
        },

        {
            header: "Domain", accessor: (item) => (
                <div>{item.inquiryDomain?.domainName}</div>
            )
        },

        {
            header: "Added On",
            accessor: (item) => dayjs(item.added_on).utc().format('DD-MM-YYYY h:mm A'),
            className: "truncate"
        },
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
                        { label: "Blocked User", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                    title="Blocked Users"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onEdit={(item) => `/admin/dashboard/block-user/${item.id}/edit`}
                    onBlock={handleUndo}
                    detail={(item) => `/admin/dashboard/block-user/${item.id}/detail`}
                />
            </div>
        </section>
    )
}