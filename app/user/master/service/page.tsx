'use client';

import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import DataTableComponent from "@/app/components/DataTable";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import CopyText from "@/app/components/CopyText";
import RightSideDrawerservice from "./add-service";
import Link from "next/link";

dayjs.extend(utc);

interface Service {
    id: string | number;
    service: string;
    status: string;
    createdAt: string;
    domainId: string | number;
}

type ResponseData = Service[];

export default function Page() {
    const { data, error, isLoading } = useSWR<ResponseData>(
        "/api/user/service",
        fetcher
    );

     

    const [open, setOpen] = useState(false);

    const [selectedRows, setSelectedRows] = useState<
        Record<string | number, boolean>
    >({});

    if (isLoading) {
        return <SpinnerCircle4 />;
    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Failed to load services.
            </div>
        );
    }

    const columns = [
        {
            header: "Service",
            accessor: (item: Service) => (
                <div className="flex items-center gap-2 group">
                    <Link
                        href={`/user/master/service/${item.id}/detail`}
                    >
                        <span className="truncate">
                            {item.service}
                        </span>
                    </Link>

                    <CopyText text={item.service} />
                </div>
            ),
        },

        {
            header: "Status",
            accessor: (item: Service) => (
                <div className="flex items-center gap-2 group">
                    <Link
                        href={`/user/master/service/${item.id}/detail`}
                    >
                        <span
                            className={`truncate ${
                                item.status === "Active"
                                    ? "text-[#00bad1]"
                                    : "text-red-600"
                            }`}
                        >
                            {item.status}
                        </span>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <section>
            <DataTableComponent
                title="Service"
                columns={columns}
                data={data || []}
                placeholder="Search by service.."
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onEdit={(item: Service) =>
                    `/user/master/service/${item.id}/edit`
                }
                onAdd={() => setOpen(true)}
                detail={(item: Service) =>
                    `/user/master/service/${item.id}/detail`
                }
            />

            {open && (
                <RightSideDrawerservice
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}
        </section>
    );
}