'use client';

import { useState } from "react";
 
import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import dayjs from "dayjs";
import CopyText from "@/app/components/CopyText";
 
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


type DataItem = {
    id: number;
    source: string;
    
    status: string;
    createdAt: string;
};


export default function Page() {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const { data, error, isLoading } = useSWR("/api/admin/dashboard/source", fetcher);

    if (isLoading) return <SpinnerCircle4 />;
    if (error) return <p>Failed to load domains </p>;
  

        const columns: Column<DataItem>[] = [
            {
                header: "Domain Name",
                accessor: (item) => (
                    <div className="flex items-center gap-2 group">
                        <Link href={`/admin/dashboard/source/${item.id}/detail`}>
                            <span className="truncate">{item.source}</span>
                        </Link>
                        <CopyText text={item.source} />
                    </div>
                ),
            },
             
            {
                header: "Status", accessor: (item) => (
                    <Link href={`/admin/dashboard/source/${item.id}/detail`}>
    
                        <div className="text-blue-400">{item.status}</div>
                    </Link>
                )
            },
            {
                header: "Added On",
                accessor: (item) => (
                    <Link href={`/admin/dashboard/source/${item.id}/detail`}>
    
                        <span>{dayjs(item.createdAt).utc().format('DD-MM-YYYY h:mm A')}</span>

                    </Link>
                ),
                className: "truncate"
            },
        ];
    

    return (
        <section className="p-4">

             <DataTableComponent
                title="Source"
                columns={columns}
                placeholder="search by source"
                data={data ?? []}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onEdit={(item) => `/admin/dashboard/source/${item.id}/edit`}
                detail={(item) => `/admin/dashboard/source/${item.id}/detail`}
            />
            
        </section>
    )
}