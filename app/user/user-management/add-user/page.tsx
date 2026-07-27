'use client';

import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import DataTableComponent from "@/app/components/DataTable";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import CopyText from "@/app/components/CopyText";
import Link from "next/link";
import AddSubUserForm from "./add-sub-user";

dayjs.extend(utc);


type DataItem = {
    id: string | number;
    username: string;
    status?: string;
    domain: string[];
    added_on: string;
    email: string;
};

export default function Page() {

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { data, error, isLoading } = useSWR(`/api/user/user-management`, fetcher);

    if (isLoading) return <SpinnerCircle4 />

    const subUsersList = Array.isArray(data) ? data : data?.subUsers || [];

    const columns = [
        {
            header: "Name",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/user-management/add-user/${item.id}/detail`}> <span className="truncate">{item.username}</span></Link>
                    <CopyText text={item.username} />
                </div>
            ),
        },
        {
            header: "Email",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/user-management/add-user/${item.id}/detail`}><span >{item.email ? item.email : "-"}</span></Link>
                    {item.email ? <CopyText text={item.email} /> : ""}
                </div>
            ),
        },
        {
            header: "status",
            accessor: (item: DataItem) => (
                <div className="flex items-center gap-2 group">
                    <Link href={`/user/user-management/add-user/${item.id}/detail`}><span className={`truncate ${item.status === "Active" ? "text-[#00bad1]" : "text-red-600"}`}>{item.status}</span></Link>
                </div>
            ),
        },
        {
            header: "Added On",
            accessor: (item: DataItem) => (
                <div className="flex items-center">
                    <Link href={`/user/user-management/add-user/${item.id}/detail`}>{dayjs.utc(item.added_on).format('DD-MM-YYYY h:mm A')}</Link>
                </div>
            ),
            className: "truncate"
        },
    ];

    if (error) return <div className="p-4 text-red-500">Failed to load users.</div>;

    return (
        <section className="">

            <DataTableComponent
                title="Users"
                placeholder="Search by name.."
                columns={columns}
                data={subUsersList}
                onAdd={() => setIsAddOpen(true)}
                addButtonDisabled={!data?.canCreateSubuser}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onEdit={(item: DataItem) => `/user/user-management/add-user/${item.id}/edit`}

                detail={(item: DataItem) => `/user/user-management/add-user/${item.id}/detail`}

            />

            {
                isAddOpen && (
                    <AddSubUserForm
                        isOpen={isAddOpen}
                        onClose={() => setIsAddOpen(false)}
                        onSuccess={() => {
                            setIsAddOpen(false);
                        }}
                    />
                )
            }

        </section>
    );
}