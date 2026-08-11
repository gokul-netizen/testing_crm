'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

dayjs.extend(utc);

type DataItem = {
    id: number;
    domainName: string;
    _count: { domainResponse: number };
};

export default function Page() {

    const params = useParams();
    const { id } = params;
    const router = useRouter();

    const { data, error, isLoading } = useSWR(`/api/sub-user/inquiry/view`, fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});


    const domainList: DataItem[] = useMemo(() => {
        if (!data) return [];
        return Array.isArray(data) ? data : data?.subUsers || [];
    }, [data]);
    

    useEffect(() => {
        if (domainList.length === 1) {
            router.replace(`/sub-user/inquiry/view/${domainList[0].id}`)
        }
    }, [domainList, id])

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Domain Name",
            accessor: (item) => (
                item.domainName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/inquiry/view/${item.id}`}><span className="truncate">{item.domainName}</span></Link>
                    <CopyText text={item.domainName} />
                </div>) : "-"
            ),
        },


        {
            header: "count", accessor: (item) => (
                item._count.domainResponse ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/inquiry/view/${item.id}`}><span className="truncate">{item._count.domainResponse}</span></Link>

                </div>) : "0"
            )
        },

    ];

    return (
        <section>
            <div className="p-4">
                <DataTableComponent
                    title="Domain List"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onEdit={() => "edit page"}


                />
            </div>
        </section>
    )
}