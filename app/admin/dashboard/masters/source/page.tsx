'use client';

import { useState } from "react";
import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";
import RightSideDrawerSource from "./add-source";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);;




type DataItem = {
    id: number;
    source: string;
    status: string;
    createdAt: string;
};



export default function Page() {

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const [openDrawer, setOpenDrawer] = useState(false);

    const { data, error, isLoading } = useSWR("/api/source", fetcher);

   

    if (isLoading) return <SpinnerCircle4 />;
    if (error) return <p>Failed to load domains </p>;
    if (!data) return <p>No data</p>;

    const getSelectedIds = () => {
        return Object.keys(selectedRows).filter((id) => selectedRows[Number(id)]).map(Number)
    }


    const columns: Column<DataItem>[] = [
        {
            header: "Domain Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/masters/source/${item.id}/detail`}>
                        <span className="truncate">{item.source}</span>
                    </Link>
                    <CopyText text={item.source} />
                </div>
            ),
        },
        {
            header: "Access Token",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/masters/source/${item.id}/detail`}>
                        <span className="truncate">{item.status}</span>

                    </Link>
                    <CopyText text={String(item.status)} />
                </div>
            ),
        },

        {
            header: "Added On",
            accessor: (item) => (
                <Link href={`/admin/dashboard/masters/source/${item.id}/detail`}>

                    <span>{dayjs(item.createdAt).utc().format('DD-MM-YYYY h:mm A')}</span>
                </Link>
            ),
            className: "truncate"
        },
    ];



    return (
        <section className="p-4">

            <div >
                <DataTableComponent
                    title="Source"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    placeholder="Seach By Source"
                    onEdit={(item) => `/admin/dashboard/masters/source/${item.id}/edit`}
                    detail={(item) => `/admin/dashboard/masters/source/${item.id}/detail`}
                    onAdd={() => setOpenDrawer(true)}

                />
            </div>

            <RightSideDrawerSource
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            />
            
        </section>
    )
}