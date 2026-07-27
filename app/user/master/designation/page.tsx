'use client';

import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import { useParams } from 'next/navigation';
import DataTableComponent from "@/app/components/DataTable";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import CopyText from "@/app/components/CopyText";
import RightSideDrawerservice from "./add-title";
import Link from "next/link";

dayjs.extend(utc);

type DataItem = {
    id: string | number;
    jobTitle: string;
    status: string;
    createdAt: string;
 
};

export default function Page() {

    const params = useParams();
    const [open, setOpen] = useState(false);
    const user_id = params.user_id as string | number;
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const { data, error, isLoading } = useSWR(`/api/user/designation`, fetcher);

   
    if (isLoading) return <SpinnerCircle4 />;

    if (error) return <div className="p-4 text-red-500">Failed to load users.</div>;

    const columns = [
        {
            header: "Designation",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/master/designation/${item.id}/detail`}>
                    <span className="truncate">{item.jobTitle}</span>
                    </Link>
                    <CopyText text={String(item.jobTitle)} />
                </div>
            ),
        },
         
        {
            header: "Status",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/master/designation/${item.id}/detail`}>
                    <span className={`truncate ${item.status === "Active" ? "text-[#00bad1]" : "text-red-600"}`}>{item.status}</span>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <section className="">
            <DataTableComponent
                title="Designation"
                columns={columns}
                placeholder="Search by designation "
                data={data || []}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onAdd={() => setOpen(true)}
                onEdit={(item : DataItem) => `/user/master/designation/${item.id}/edit`}
                detail={ (item : DataItem)=> `/user/master/designation/${item.id}/detail`}
               

            />

            {open && (
                <RightSideDrawerservice
                    open={open}
                    onClose={() => setOpen(false)}
                    userId={user_id}
                />
            )}

        </section>
    );
}