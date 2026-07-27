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
    domainName: string;
    accessToken: string;
    status: string;
    addedOn: string;
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/active-domain", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: "Domain Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/active-domain/${item.id}/detail`}>
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
                    <Link href={`/admin/dashboard/active-domain/${item.id}/detail`}>
                        <span className="truncate">{item.accessToken}</span>

                    </Link>
                    <CopyText text={String(item.accessToken)} />
                </div>
            ),
        },
        {
            header: "Status", accessor: (item) => (
                <Link href={`/admin/dashboard/active-domain/${item.id}/detail`}>

                    <div className="text-blue-400">{item.status}</div>
                </Link>
            )
        },
        {
            header: "Added On",
            accessor: (item) => (
                <Link href={`/admin/dashboard/active-domain/${item.id}/detail`}>

                    <span>{dayjs(item.addedOn).utc().format('DD-MM-YYYY h:mm A')}</span>
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
                        { label: "Active Domain", isPage: true },
                    ]}
                />
            </div>
            <div >
                <DataTableComponent
                    title="Active Domains"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onEdit={(item) => `/admin/dashboard/active-domain/${item.id}/edit`}
                    detail={(item) => `/admin/dashboard/active-domain/${item.id}/detail`}
                    placeholder="Seach By Domain"
                />
            </div>
        </section>
    )
}