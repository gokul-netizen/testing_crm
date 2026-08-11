'use client';

import { useState } from "react";
import { fetcher } from "@/lib/fetcherSwr";
import useSWR, { mutate } from "swr";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";
import RightSideDrawerSource from "./add-source";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from "sonner";
dayjs.extend(utc);;

type DataItem = {
    id: number;
    source: string;
    status: string;
    createdAt: string;
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/admin/master/source", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const [openDrawer, setOpenDrawer] = useState(false);

    if (isLoading) return <SpinnerCircle4 />;
    if (error) return <p>Failed to load domains </p>;
    if (!data) return <p>No data</p>;

    const getSelectedIds = () => {
        return Object.keys(selectedRows).filter((id) => selectedRows[Number(id)]).map(Number)
    }

    const columns: Column<DataItem>[] = [
        {
            header: "source",
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
            header: "status",
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

    const handleDeleteById = async(id : number | string)=>{
        try {

        const response = await fetch(`/api/admin/master/source`, {
            method : "Delete",
            body : JSON.stringify({ ids : [Number(id)]})

        });

        const data = await response.json();
        toast.success(data.message);
        mutate(`/api/admin/master/source`)
            
        } catch (error) {
            toast.error("Something went wrong");   
        }
    }

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
                    deleteById={(item)=> handleDeleteById(item.id)}
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