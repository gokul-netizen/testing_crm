'use client';

import { fetcher } from "@/lib/fetcherSwr";
import useSWR, { mutate } from "swr";
import { useParams } from 'next/navigation';
import DataTableComponent from "@/app/components/DataTable";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";

import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { exportExcelDataInquiry } from "@/lib/export-excel-data";
import { timeSince } from "@/lib/time-ago";
import { toast } from "sonner";

dayjs.extend(utc);

type DataItem = {
    id: string | number;
    name: string;
    email: string;
    companyName: string;
    phone: number;
    followUpStatus: string;
    createdAt: string;
    service: string;
    phoneSecondary: string;


    followups: {
        date: string;
        time: string;
        createdAt: string;
        remarks: string;
        assignToName: string;
        addedBy: string;
        isPublic: string;
    }[]
    assigns: {
        assignDate: string;
        assignTime: string;
        createdAt: string;
        remarks: string;
    }[]
};

export default function Page() {

    const { data, error, isLoading } = useSWR(`/api/sub-user/dashboard/total-followups`, fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

 
    const params = useParams();
    const user_id = params.id;
    

    const inquiryIds = Object.keys(selectedRows)
        .filter(key => selectedRows[key])
        .map(Number);


    if (isLoading) return <SpinnerCircle4 />;

    if (error) return <div className="p-4 text-red-500">Failed to load users.</div>;

    const detailLink = (id: string | number) => `/sub-user/total-followups/${id}`;

    const columns = [
        {
            header: "Name",
            mobileHeader: "Name",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={detailLink(item.id)}>
                        <span className="truncate">{item.name}</span>
                    </Link>
                    <CopyText text={item.name} />
                </div>
            ),
        },
        {
            header: "Company Name",
            mobileHeader: "CN",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={detailLink(item.id)}>
                        <span>{item.companyName || "-"}</span>
                    </Link>
                    {item.companyName && <CopyText text={item.companyName} />}
                </div>
            ),
        },
        {
            header: "Phone",
            mobileHeader: "Phone",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={detailLink(item.id)}>
                        <span>{item.phone || "-"}</span>
                    </Link>
                    {item.phone && <CopyText text={String(item.phone)} />}
                </div>
            ),
        },
        {
            header: "Service",
            mobileHeader: "Service",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={detailLink(item.id)}>
                        <span>{item.service || "-"}</span>
                    </Link>
                    {item.service && <CopyText text={String(item.service)} />}
                </div>
            ),
        },
        {
            header: "Status",
            mobileHeader: "Status",
            accessor: (item: DataItem) => {
                const statusColors: Record<string, string> = {
                    "Follow Up": "text-green-600 font-medium",
                    "Not Interested": "text-orange-500 font-medium",
                    "Closed": "text-red-600 font-medium",
                    "Assign To": "text-blue-500 font-medium"
                };

                const colorClass = statusColors[item.followUpStatus] || "text-gray-500";
                const remarks = item.followups?.[0]?.remarks || item.assigns?.[0]?.remarks;

                return (
                    <div className="group relative">
                        <Link className="truncate flex flex-col" href={detailLink(item.id)}>


                            <span className={colorClass}>
                                {
                                    item?.followUpStatus === "Assign To"
                                        ? item?.followups?.[0]?.assignToName
                                            ? `Assign To ${item.followups[0].assignToName}`
                                            : "Assign To"
                                        : item?.followUpStatus
                                }
                            </span>


                            <div className={`flex gap-2 ${colorClass}`}>

                                <span>
                                    {item.followups?.[0]?.date && item.followups[0].date !== "Invalid Date" ? item.followups[0].date : null}
                                </span>

                                <span>
                                    {item.followups?.[0]?.time && item.followups[0].time !== "Invalid time" ? item.followups[0].time : null}
                                </span>

                            </div>


                            <span>
                                {timeSince(
                                    item.followups?.[0]?.createdAt ??
                                    item.assigns?.[0]?.createdAt ??
                                    item.createdAt
                                )}
                            </span>

                        </Link>

                        {(item.followups?.[0]?.isPublic || Number(item.followups?.[0]?.addedBy) === Number(user_id)) && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10">
                                {remarks}
                            </div>
                        )}

                    </div>
                );
            },
        },
        {
            header: "Added On",
            mobileHeader: "AddedOn",
            accessor: (item: DataItem) => (
                <Link className="truncate " href={detailLink(item.id)}>
                    {dayjs.utc(item.createdAt).format("DD-MM-YYYY hh:mm A")}
                </Link>
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
            mutate("/api/sub-user/dashboard/total-followups");
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
            mutate("/api/sub-user/dashboard/total-followups");

        } catch (error) {
            toast.error("Failed to delete the inquiry")
        }
    }


    return (
        <section >

            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/sub-user` },
                        { label: "Records", isPage: true },
                    ]}
                />
            </div>
            <DataTableComponent
                title="Total Followups"
                columns={columns}
                data={data ?? []}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onDelete={() => handleDelete(inquiryIds)}
                deleteById={(item) => handleDeleteById(item.id)}
                onExcel={() => exportExcelDataInquiry(data ?? [])}
                detail={(item) => `/sub-user/total-followups/${item.id}`}
                whatsapp={(item) => item.phone}
                mobileCall={(item) => String(item.phone)}
            />


        </section>
    );
}