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
import RightSideDrawerservice from "./add-service";
import Link from "next/link";

dayjs.extend(utc);

type DataItem = {
    id: string | number;
    service: string;
    status: string;
    createdAt: string;
    domain : {domainName : string}
};

export default function Page() {

    const params = useParams();
    const [open, setOpen] = useState(false);
    const user_id = params.user_id as string | number;
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const { data, error, isLoading } = useSWR(`/api/user/service`, fetcher);

   
    if (isLoading) return <SpinnerCircle4 />;

    if (error) return <div className="p-4 text-red-500">Failed to load users.</div>;

    const columns = [
        {
            header: "Service",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/master/service/${item.id}/detail`}>
                     <span className="truncate">{item.service}</span>
                     </Link>
                   
                    <CopyText text={String(item.service)} />
                </div>
            ),
        },
        {
            header: "Domain Name",
            mobileHeader: "DN",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/master/service/${item.id}/detail`}>
                    <span className="truncate">{item.domain.domainName}</span>
                    </Link>
                     
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/master/service/${item.id}/detail`}>
                    <span className={`truncate ${item.status === "Active" ? "text-[#00bad1]" : "text-red-600"}`}>{item.status}</span>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <section className="">
            <DataTableComponent
                title="Service"
                columns={columns}
                data={data || []}
                placeholder="Search by service.."
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onEdit={(item : DataItem)=> `/user/master/service/${item.id}/edit`}
                onAdd={() => setOpen(true)}
                detail={ (item : DataItem)=> `/user/master/service/${item.id}/detail`}
                
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