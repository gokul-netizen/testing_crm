"use client";

import SpinnerCircle4 from "@/components/spinner-10";
import useSWR from "swr";
import { exportExcelData } from "@/lib/export-excel-data";
import { exportPfd } from "@/lib/export-pdf";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
dayjs.extend(utc);;

const fetcher = (url: string) => fetch(url).then(res => res.json());

type DataItem = {

    id: number;
    domainName: string;
    logo: string | null;
    _count: { domainResponse: number; };

    };




export default function DomainsPage() {



    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const { data, error, isLoading } = useSWR("/api/admin/inquiries/view", fetcher);

    if (isLoading)
        return <SpinnerCircle4 />;

    if (error)
        return <p className="p-8 text-red-500">Failed to load data.</p>;

    if (!data)
        return <p className="p-8 text-gray-600">No data found.</p>;


    const handleDomainClick = (item: DataItem) => {
        const logo = item.logo
            ? "/" + item.logo.replace(/\\/g, "/")
            : "/mars_logo.png";

        localStorage.setItem("selectedDomainLogo", logo);
        localStorage.setItem("selectedDomainName", item.domainName);
    };


    const columns: Column<DataItem>[] = [
        {
            header: "Domain Name",
            mobileHeader : "DN",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/inquiry/view/${item.id}`}
                        onClick={() => handleDomainClick(item)}
                    >
                        <span className="truncate">{item.domainName}</span>
                    </Link>
                    <CopyText text={item.domainName} />
                </div>
            ),
        },
        {
            header: "Count",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/admin/dashboard/inquiry/view/${item.id}`}
                     onClick={() => handleDomainClick(item)}
                    >
                        <span className="truncate">{item._count.domainResponse}</span>

                    </Link>

                </div>
            ),
        },


    ];



    return (
        <div className="p-6">
            <div >
                <DataTableComponent
                    title="Domian List"
                    columns={columns}
                    data={data?.data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    placeholder="Seach By Domain Name"
                    detail={(item) => `/admin/dashboard/inquiry/view/${item.id}`}

                />
            </div>
        </div>
    );
}
