'use client';

import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import {   useRouter } from 'next/navigation';
import DataTableComponent from "@/app/components/DataTable";
import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";

dayjs.extend(utc);

type DataItem = {
    id: string | number;
    _count: { domainResponse: number };
    domainName: string | number;
};

export default function Page() {

    const router = useRouter();

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    const { data, error, isLoading } = useSWR(`/api/user/inquiry/view`, fetcher);


    const domainList: DataItem[] = useMemo(() => {
        if (!data) return [];
        return Array.isArray(data) ? data : data?.subUsers || [];
    }, [data]);

    useEffect(() => {
        if (domainList.length === 1) {
            router.replace(`/user/inquiry/view/${domainList[0].id}`)
        }
    }, [domainList]);


    if (isLoading) return <SpinnerCircle4 />;

    if (error) return <div className="p-4 text-red-500">Failed to load users.</div>;

 
    const columns = [
        {
            header: "Name",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/inquiry/view/${item.id}`}>
                        <span className="truncate">{item.domainName}</span>
                    </Link>
                    <CopyText text={String(item.domainName)} />
                </div>
            ),
        },
        {
            header: "Count",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/inquiry/view/${item.id}`}>
                        <span className="truncate">{item._count.domainResponse}</span>
                    </Link>
                </div>
            ),
        },
    ];

    



    return (
        <section className="">
            <DataTableComponent
                title="Domain"
                placeholder="Search By Domain"
                columns={columns}
                data={domainList}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                
            />
        </section>
    );
}