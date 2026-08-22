'use client';

import { useState } from "react";
import { fetcher } from "@/lib/fetcherSwr";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { confirmAction } from "@/app/components/ConfirmSooner";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);


type DataItem = {
  id: number;
  name: string;
  email: string;
  isDeletedOn: string;
   
};

export default function Page() {

    const { data, error, isLoading } = useSWR("/api/admin/user-management/deleted-user", fetcher);
    const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

    if (isLoading)
        return <SpinnerCircle4 />;

    if (error)
        return <p className="p-8 text-red-500">Failed to load data.</p>;

    if (!data)
        return <p className="p-8 text-gray-600">No data found.</p>;

    const getSelectedIds = () => {
        return Object.keys(selectedRows).filter((id) => selectedRows[Number(id)]).map(Number)
    }


     const columns: Column<DataItem>[] = [
        {
          header: "Name",
          accessor: (item) => (
            <div className="flex items-center gap-2 group">
              <Link href={`/admin/dashboard/user/deleted-user/${item.id}/detail`}>
                <span className="truncate">{item.name}</span>
              </Link>
              <CopyText text={item.name} />
            </div>
          ),
        },
        {
          header: "email",
          accessor: (item) => (
            <div className="flex items-center gap-2 group">
              <Link href={`/admin/dashboard/user/deleted-user/${item.id}/detail`}>
                <span className="truncate">{item.email}</span>
              </Link>
              <CopyText text={item.email} />
            </div>
          ),
        },
         
         
        {
          header: "Added On",
          accessor: (item) => (
            <Link href={`/admin/dashboard/user/deleted-user/${item.id}/detail`}>
    
              <span>{dayjs(item.isDeletedOn).utc().format('DD-MM-YYYY h:mm A')}</span>
            </Link>
          ),
          className: "truncate"
        },
      ];


    const handleUndo = async () => {
        const ids = getSelectedIds();

        if (ids.length === 0) {
            return toast.error("Please select a record first");
        }

        confirmAction({
            title: "Undo Record",
            description: "Are you sure you want to undo this record?",
            confirmLabel: "Confirm",
            variant: "primary",
            onConfirm: async () => {
                const res = await fetch(`/api/admin/user-management/deleted-user`, {
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
                mutate(`/api/admin/user-management/deleted-user`);
            }
        });
    };

     const handleUndoById = async (item: DataItem) => {
        confirmAction({
          title: "Undo Record",
          description: `Are you sure you want to restore "${item.name || 'this record'}"?`,
          confirmLabel: "Confirm",
          variant: "primary",
          onConfirm: async () => {
            const res = await fetch(`/api/admin/user-management/deleted-user`, {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json',
              },
    
              body: JSON.stringify({ ids: [item.id] })
            });
    
            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.error || "Failed to undo");
            }
    
            toast.success("Record restored successfully");
            mutate(`/api/admin/user-management/deleted-user`);
          },
        });
      };


   



    return (
        <section className="p-4">
            <DataTableComponent
                title="Deleted Users"
                columns={columns}
                data={data?.data ?? []}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                
              
                placeholder="Seach By Name"
                onUndo={handleUndo}
                undoById={(item) => handleUndoById(item)}
                onEdit={(item) => `/admin/dashboard/user/deleted-user/${item.id}/edit`}
                detail={(item) => `/admin/dashboard/user/deleted-user/${item.id}/detail`}
            />
        </section>
    )
}