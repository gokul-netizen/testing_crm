'use client';

import CopyText from "@/app/components/CopyText";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import { useParams } from "next/navigation";
import Link from "next/link";
import CustomBreadcrumb from "@/app/components/BreadCrumb";

import { timeSince } from "@/lib/time-ago";
import Inquiry from "./add-inquriy";
import Search from "./search";
import SliderPanel from "@/app/components/SideSlider";
import { ExportInquiryData } from "@/lib/inquiriesExportExcel";


dayjs.extend(utc);


type DataItem = {
    id: string | number;
    name: string;
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

};

export default function Page() {

    const params = useParams();
    const { domainId , id} = params;

    const [open, setOpen] = useState(false);

    const { data, error, isLoading } = useSWR(`/api/sub-user/inquiry/view/${domainId}`, fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const [openSearch, setOpenSearch] = useState(false);
    const [searchData, setSearchData] = useState<any[]>([]);

    const tableData = searchData.length > 0 ? searchData : data;

    if (isLoading) return <SpinnerCircle4 />

    if (error) return <div> Error : {error.message}</div>

    const columns: Column<DataItem>[] = [

        {
            header: "  Name",
            accessor: (item) => (
                item.name ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/inquiry/view/${domainId}/${item.id}`}><span className="truncate">{item.name}</span> </Link>
                    <CopyText text={item.name} />
                </div>) : "-"
            ),
        },
        {
            header: "company Name",
            mobileHeader: "CN",
            accessor: (item) => (
                item.companyName ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/inquiry/view/${domainId}/${item.id}`}>
                        <span className="truncate">{item.companyName}</span>
                    </Link>
                    <CopyText text={item.companyName} />
                </div>) : "-"
            ),
        },
        {
            header: "  phone",
            accessor: (item) => (
                item.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/inquiry/view/${domainId}/${item.id}`}>
                        <span className="truncate">{item.phone}</span>
                    </Link>
                    <CopyText text={item.phone} />
                </div>) : "-"
            ),
        },
        {
            header: "Service",
            accessor: (item) => (
                item.phone ? (<div className="flex items-center gap-2 group">
                    <Link href={`/sub-user/inquiry/view/${domainId}/${item.id}`}>
                        <span className="truncate">{item.service}</span>
                    </Link>
                    <CopyText text={item.service} />
                </div>) : "-"
            ),
        },
        {
            header: "Status",
            accessor: (item: DataItem) => {
                const statusColors: Record<string, string> = {
                    "Follow Up": "text-green-600 font-medium",
                    "Not Interested": "text-orange-500 font-medium",
                    "Closed": "text-red-600 font-medium",
                    "Assign To": "text-blue-500 font-medium"
                };

                const colorClass = statusColors[item.followUpStatus] || "text-gray-500";
                const remarks = item.followups?.[0]?.remarks;

                return (
                    <div className="group relative">
                        <Link className="truncate flex flex-col" href={`/sub-user/inquiry/view/${domainId}/${item.id}`}>

                            {/* Status */}
                            <span className={colorClass}>
                                {
                                    item?.followUpStatus === "Assign To"
                                        ? item?.followups?.[0]?.assignToName
                                            ? `Assign To ${item.followups[0].assignToName}`
                                            : "Assign To"
                                        : item?.followUpStatus
                                }
                            </span>

                            {/* Date & Time */}
                            <div className="flex gap-2">

                                <span>
                                    {item.followups?.[0]?.date && item.followups[0].date !== "Invalid Date" ? item.followups[0].date : null}
                                </span>

                                <span>
                                    {item.followups?.[0]?.time && item.followups[0].time !== "Invalid Date" ? item.followups[0].time : null}
                                </span>

                            </div>

                            {/* Time since */}
                            <span>
                                {timeSince(item.followups?.[0]?.createdAt ?? item.createdAt)}
                            </span>

                        </Link>


                        {(item.followups?.[0]?.isPublic || Number(item.followups?.[0]?.addedBy) === Number(id)) && (
                            <div className="absolute hidden group-hover:block bg-gray-900/80 text-white text-sm p-2 rounded shadow-xl z-50 bottom-10">
                                {remarks}
                            </div>
                        )}

                    </div>
                );
            },
        },
    ];



    return (
        <section>
            <div className="p-4">
                <div className="flex justify-end m-2">
                    <CustomBreadcrumb
                        paths={[
                            { label: "View", href: `/sub-user/inquiry/view` },
                            { label: "All Inquiry", isPage: true },
                        ]}
                    />
                </div>
                <DataTableComponent
                    title="All Inquiry "
                    columns={columns}
                    data={tableData ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    onReset={() => setSearchData([])}
                    onSearch={() => setOpenSearch(true)}
                    onExcel={()=> ExportInquiryData(tableData)}
                    onAdd={() => setOpen(true)}
                    whatsapp={(item) => item.phone}
                    mobileCall={(item) => String(item.phone)}
                    detail={(item) => `/sub-user/inquiry/view/${domainId}/${item.id}`}

                />

                {open && (
                    <Inquiry
                        open={open}
                        onClose={() => setOpen(false)}
                    />
                )}

                {openSearch && (
                    <SliderPanel

                        isOpen={openSearch}
                        onClose={() => setOpenSearch(false)}

                    >

                        <Search
                            searchData={searchData}
                            setSearchData={setSearchData}
                            setOpenSearch={setOpenSearch}

                        />

                    </SliderPanel>
                )}

            </div>
        </section>
    )
}