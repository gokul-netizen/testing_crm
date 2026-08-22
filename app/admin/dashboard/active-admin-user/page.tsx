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
    id: number;
    name: string;
    email: string;
    status: string;
    inquiryDomain: { domainName: string }
    added_on: string;
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/admin/dashboard/active-admin-user", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>

   

    const columns: Column<DataItem>[] = [
        {
            header: "Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/active-admin-user/${item.id}/detail`}><span className="truncate">{item.name}</span></Link>

                    <CopyText text={item.name} />
                </div>
            ),
        },
        {
            header: "Email",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/active-admin-user/${item.id}/detail`}>

                        <span className="truncate">{item.email}</span>
                    </Link>
                    <CopyText text={String(item.email)} />
                </div>
            ),
        },
        {
            header: "Status", accessor: (item) => (
                <Link href={`/admin/dashboard/active-admin-user/${item.id}/detail`}>

                    <div className="text-blue-400">{item.status}</div>
                </Link>
            )
        },

        {
            header: "Domain",

            accessor: (item) => (
                <Link href={`/admin/dashboard/active-admin-user/${item.id}/detail`}>

                    <div>{item.inquiryDomain?.domainName}</div>
                </Link>
            )
        },

        {
            header: "Added On",
            accessor: (item) => (
                <Link href={`/admin/dashboard/active-admin-user/${item.id}/detail`}>
                    {dayjs(item.added_on).utc().format('DD-MM-YYYY h:mm A')}
                </Link>
            ),
            className: "truncate"
        },
    ];

    return (
        <section className="p-4">
            
            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/admin/dashboard/` },
                        { label: "Active Admin   User", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                    title="Active Admin Users"
                    columns={columns}
                    data={data ?? []}
                    placeholder="Search name"
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onEdit={(item) => `/admin/dashboard/active-admin-user/${item.id}/edit`}

                    detail={(item) => `/admin/dashboard/active-admin-user/${item.id}/detail`}
                />
            </div>
        </section>
    )
}