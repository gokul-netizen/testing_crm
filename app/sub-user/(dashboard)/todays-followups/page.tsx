'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { timeSince } from "@/lib/time-ago";
import { userExcelData } from "@/lib/export-excel-data";
import { toast } from "sonner";

dayjs.extend(utc);

type DataItem = {

    
    inquiry: { id: number, name: string, companyName: string, phone: number };
    date: string;
    time: string;
    remarks: string;
    followUpStatus: string;
    createdAt: string;
    assignToName: string;
    addedBy: string;
    isPublic: string;
    
};

export default function Page() {
    
    const { data, error, isLoading } = useSWR(`/api/sub-user/dashboard/todays-followups`, fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    const params = useParams();
    const { id } = params;

    const inquiryIds = Object.keys(selectedRows)
        .filter(key => selectedRows[key])
        .map(Number);

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>


    const columns: Column<DataItem>[] = [
        {
            header: " Name",
             
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/todays-followups/${item.inquiry.id}`}><span className="truncate">{item.inquiry?.name}</span></Link>
                    <CopyText text={item.inquiry?.name} />
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: (item) => (
                item.inquiry?.phone ? (<div className="flex items-center gap-2 group">
                    <Link  href={`/sub-user/todays-followups/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.phone}</span>
                    </Link>
                    <CopyText text={item.inquiry?.phone} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "company Name",
            mobileHeader: "CN",
            accessor: (item) => (
                item.inquiry?.companyName ? (<div className="flex items-center gap-2 group">
                    <Link  href={`/sub-user/todays-followups/${item.inquiry.id}`}>
                        <span className="truncate">{item.inquiry?.companyName}</span>
                    </Link>
                    <CopyText text={item.inquiry?.companyName} />
                </div>
                ) : "_"
            ),
        },
        {
            header: "Status",
            accessor: (item) => (
                <div className="flex items-center gap-2 group relative ">
                    <Link  href={`/sub-user/todays-followups/${item.inquiry.id}`}>
                        <span className="truncate text-green-500">{item.followUpStatus === "Assign To" ? `Assign To ${item.assignToName}` : item.followUpStatus}</span>
                        <div className="flex gap-2">
                            <span className="truncate text-green-500">{item.date}</span>
                            <span className="truncate text-green-500">{item.time}</span>
                        </div>
                        <span>{timeSince(item.createdAt)}</span>
                    </Link>

                        {(item.isPublic || Number(item.addedBy) === Number(id)) && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10">
                                {item?.remarks}
                            </div>
                        )}
                    
                </div>
            ),
        },
    ];


    const handleDelete = async (inquiryIds: number[]) => {
        try {

            const response = await fetch('/api/sub-user/inquiry/delete-inquiry', {
                method: "DELETE",
                body: JSON.stringify({ ids: inquiryIds })
            });

            const data = await response.json();
            toast.success(data.message);
            mutate("/api/sub-user/dashboard/todays-followups");
            setSelectedRows({});


        } catch (error) {

            toast.error("Failed to delete the inquiry")

        }
    }

    const handleDeleteById = async (inquiryId: string | number) => {
        try {

            const response = await fetch('/api/sub-user/inquiry/delete-inquiry', {
                method: "DELETE",
                body: JSON.stringify({ ids: [inquiryId] })
            });

            const data = await response.json();
            toast.success(data.message);
           mutate("/api/sub-user/dashboard/todays-followups");

        } catch (error) {
            toast.error("Failed to delete the inquiry")
        }
    }


    return (
        <section>

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/sub-user` },
                        { label: "Today's follow up", isPage: true },
                    ]}
                />
            </div>

            <div >
                <DataTableComponent
                    title="Today's Follow Up"
                    columns={columns}
                    data={data?.todaysfollowup ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onDelete={() => handleDelete(inquiryIds)}
                    deleteById={(item) => handleDeleteById(item.inquiry?.id)}
                    detail={(item) => `/sub-user/todays-followups/${item.inquiry.id}`}
                    onExcel={() => userExcelData(data, "Todays follow up")}
                    whatsapp={(item)=> item?.inquiry?.phone}
                     mobileCall={(item)=> String(item?.inquiry?.phone)}

                />
            </div>
        </section>
    )
}