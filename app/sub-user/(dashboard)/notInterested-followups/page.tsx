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
    time: string;
    companyName: string;
    phone: number;
    followUpStatus: string;
    followups : [{
        remarks : string;
        createdAt : string;
        isPublic: string,
        addedBy: string,
    }]
     
};
export default function Page() {

 
    const params = useParams();
    const { id } = params;

    const { data, error, isLoading } = useSWR(`/api/sub-user/dashboard/notInterested-followups`, fetcher);


    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/notInterested-followups/${item.id}`}>
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
                  <Link href={`/sub-user/notInterested-followups/${item.id}`}>
                        <span className="truncate">{item.companyName}</span>
                    </Link>
                    <CopyText text={item.companyName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/notInterested-followups/${item.id}`}>
                        <span className="truncate">{item.phone}</span>
                    </Link>
                    <CopyText text={item.phone} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Status",
            accessor: (item) => (
                <div className="flex items-center gap-2 group relative ">
                   <Link href={`/sub-user/notInterested-followups/${item.id}`}>
                        <span className="truncate text-orange-500">{item.followUpStatus}</span>
                        <div >

                        <span>{dayjs.utc(item.followups[0]?.createdAt).format("DD-MM-YYYY h:m A")}</span>
                        </div>
                    </Link>

                    {(item.followups?.[0]?.isPublic || Number(item.followups?.[0]?.addedBy) === Number(id)) && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10">
                                {item.followups?.[0]?.remarks}
                            </div>
                        )}

                </div>
            ),
        },

    ];

   

    return (
        <section>

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/sub-user` },
                        { label: "Closed", isPage: true },
                    ]}
                />
            </div>

            <div  >
                <DataTableComponent
                    title="Not Interested "
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    detail={(item) => `/sub-user/notInterested-followups/${item.id}`}
                    
                    onExcel={()=> userExcelData(data,"Closed")}
                    whatsapp={(item)=> item?.phone}    
                    mobileCall={(item)=> String(item?.phone)}    
                />
            </div>
        </section>
    )
}