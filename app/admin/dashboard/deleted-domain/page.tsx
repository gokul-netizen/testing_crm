"use client";

import { fetcher } from "@/lib/fetcherSwr";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import CustomBreadcrumb from "@/app/components/BreadCrumb";

dayjs.extend(utc);

type DataItem = {
    id: number;
    domainName: string;
    accessToken: string;
    status: string;
    addedOn: string;
};


export default function Page() {

    const { data, error, isLoading } = useSWR("/api/admin/dashboard/deleted-domain", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});


    if (isLoading)
        return <SpinnerCircle4 />;

    if (error)
        return <p className="p-8 text-red-500">Failed to load data.</p>;

    if (!data)
        return <p className="p-8 text-gray-600">No data found.</p>;


    const columns: Column<DataItem>[] = [
        {
            header: "Domain Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/deleted-domain/${item.id}/detail`}>
                        <span className="truncate">{item.domainName}</span>
                    </Link>
                    <CopyText text={item.domainName} />
                </div>
            ),
        },
        {
            header: "Access Token",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/deleted-domain/${item.id}/detail`}>
                        <span className="truncate">{item.accessToken}</span>

                    </Link>
                    <CopyText text={String(item.accessToken)} />
                </div>
            ),
        },
         
        {
            header: "Deleted On",
            accessor: (item) => (
                <Link href={`/admin/dashboard/deleted-domain/${item.id}/detail`}>

                    <span>{dayjs(item.addedOn).utc().format('DD-MM-YYYY h:mm A')}</span>
                </Link>
            ),
            className: "truncate"
        },
    ];

    return (
        <div className="p-4">

            
             <div className="flex justify-end py-2 px-3">
            <CustomBreadcrumb
                paths={[
                    { label: "Dashboard", href: `/admin/dashboard/` },
                     { label: "Deleted    Domain", isPage: true },
                ]}
            />
            </div>
 

            <DataTableComponent
                title="Deleted Domain"
                columns={columns}
                data={data?.data ?? []}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onEdit={(item) => `/admin/dashboard/deleted-domain/${item.id}/edit`}
                detail={(item) => `/admin/dashboard/deleted-domain/${item.id}/detail`}
                placeholder="Seach By Domain"
            />
        </div>
    )
}
