'use client';

import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import CopyText from "@/app/components/CopyText";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from "sonner";
import { confirmAction } from "@/app/components/ConfirmSooner";
dayjs.extend(utc);

type DataItem = {
    id: number;
    domain: { domainName: string }
    email: string;
    name: string;
    phone: string;
};

export default function Page() {

    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
    const { data, error, isLoading } = useSWR("/api/admin/inquiries/deleted-inquiries", fetcher);

    if (isLoading)
        return <SpinnerCircle4 />;

    if (error)
        return <p className="p-8 text-red-500">Failed to load data.</p>;

    if (!data)
        return <p className="p-8 text-gray-600">No data found.</p>;

    const columns: Column<DataItem>[] = [
        {
            header: "  Name",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    
                        <span className="truncate">{item.name}</span>
                    
                    <CopyText text={item.name} />
                </div>
            ),
        },
        {
            header: "email",
            accessor: (item) => (
                item.email ? (
                    <div className="flex items-center gap-2 group">
                         
                            <span className="truncate">{item?.email}</span>

                      
                        <CopyText text={String(item?.email)} />
                    </div>
                ) : "_"
            ),
        },
        {
            header: "phone",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                    
                        <span className="truncate">{item?.phone}</span>

               
                    <CopyText text={String(item?.phone)} />
                </div>
            ),
        },
        {
            header: "domain",
            accessor: (item) => (
                <div className="flex items-center gap-2 group">
                   
                        <span className="truncate">{item?.domain?.domainName}</span>

                 
                    <CopyText text={String(item?.domain?.domainName)} />
                </div>
            ),
        },


    ];

    const selectedIds = () => Object.keys(selectedRows).filter((id) => selectedRows[id]).map((Number));

    const handleUndo = async () => {
        const ids = selectedIds();

        if (ids.length === 0) {
            return toast.error("Please select a record first");
        }

        confirmAction({
            title: "Undo Record",
            description: "Are you sure you want to undo this record?",
            confirmLabel: "Confirm",
            variant: "primary",
            onConfirm: async () => {
                const res = await fetch(`/api/admin/inquiries/revoke-inquiries`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ids })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Failed to undo");
                }

                toast.success("Record undo successfully");
                mutate(`/api/admin/inquiries/deleted-inquiries`);
            }
        });
    };

    const handleUndoById = async (item: DataItem) => {
        confirmAction({
            title: "Undo Record",
            description: `Are you sure you want to restore'}"?`,
            confirmLabel: "Confirm",
            variant: "primary",

            onConfirm: async () => {
                const res = await fetch(`/api/admin/inquiries/revoke-inquiries`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ids : [item.id] })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Failed to undo");
                }

                toast.success("Record restored successfully");
                mutate(`/api/admin/inquiries/deleted-inquiries`);
            },
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-end py-2 px-3">
                <CustomBreadcrumb
                    paths={[
                        { label: "Dashboard", href: `/admin/dashboard/` },
                        { label: "Deleted Inquiry", isPage: true },
                    ]}
                />
            </div>


            <div >
                <DataTableComponent
                    title="Deleted Inquiry"
                    columns={columns}
                    data={data ?? []}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    placeholder="Seach By Domain"
                    onUndo={handleUndo}
                    undoById={(item) => handleUndoById(item)}

                />
            </div>
        </div>
    )
}