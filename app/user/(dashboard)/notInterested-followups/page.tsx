'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { userExcelData } from "@/lib/export-excel-data";



dayjs.extend(utc);


type DataItem = {
    id: number;
    name: string;
    companyName: string;
    phone: number;
    followUpStatus: string;
    followups: [{ remarks: string, createdAt: string , addedByUser : { name : string}}];
};

export default function Page() {


    const { data, error, isLoading } = useSWR(`/api/user/dashboard/notinterested-followups`, fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/notInterested-followups/${item.id}`}>
                        <span className="truncate">{item.name}</span>
                    </Link>
                    <CopyText text={item.name} />
                </div>
            ),
        },
        {
            header: "company Name",
            mobileHeader: "CN",
            accessor: (item) => (
                item.companyName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/user/notInterested-followups/${item.id}`}>
                        <span className="truncate">{item.companyName}</span>
                    </Link>
                    <CopyText text={item.companyName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "phone",
            accessor: (item) => (
                item.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/user/notInterested-followups/${item.id}`}>
                        <span className="truncate">{item.phone}</span>
                    </Link>
                    <CopyText text={item.phone} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "added by",
            accessor: (item) => (
                item.followups[0]?.addedByUser?.name ? (<div className="flex items-center gap-2 group">
                    <Link href={`/user/notInterested-followups/${item.id}`}>
                        <span className="truncate">{ item.followups[0]?.addedByUser?.name }</span>
                    </Link>
                    <CopyText text={ item.followups[0]?.addedByUser?.name } />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Status",
            accessor: (item) => (
                <div className="flex items-center gap-2 group relative  ">
                    <Link href={`/user/notInterested-followups/${item.id}`} className="flex flex-col shrink-0">
                        <span className="truncate text-orange-500">{item.followUpStatus}</span>

                        <span>
                            {item.followups[0]
                                ? dayjs.utc(item.followups[0].createdAt).format("DD-MM-YYYY hh:mm A")
                                : "-"}
                        </span>
                    </Link>

                    {
                        item.followups[0].remarks && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-17">
                                {item.followups[0].remarks}
                            </div>
                        )
                    }

                </div>
            ),
        },
    ];



    return (
        <section>
            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/user` },
                        { label: "Not Interested", isPage: true },
                    ]}
                />
            </div>

            <div  >
                <DataTableComponent
                    title="Not Interested"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item) =>  `/user/notInterested-followups/${item.id}`}
                    onExcel={() => userExcelData(data, "Not Interested")}
                    whatsapp={(item)=> item?.phone}
                    mobileCall={(item)=> String(item?.phone)}

                />
            </div>
        </section>
    )
}