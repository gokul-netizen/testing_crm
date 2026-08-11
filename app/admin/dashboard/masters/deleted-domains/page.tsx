"use client";

import { fetcher } from "@/lib/fetcherSwr";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { confirmAction } from "@/app/components/ConfirmSooner";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import CopyText from "@/app/components/CopyText";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);



type DataItem = {
  id: number;
  domainName: string;
  accessToken: string;
  status: string;
  isDeletedOn: string;
};


export default function Page() {

  const { data, error, isLoading } = useSWR("/api/admin/master/deleted-domain", fetcher);
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
        const res = await fetch(`/api/admin/master/deleted-domain`, {
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
        mutate(`/api/admin/master/deleted-domain`);
      }
    });
  };

  const handleUndoById = async (item : DataItem) => {

    confirmAction({
      title: "Undo Record",
      description: "Are you sure you want to undo this record?",
      confirmLabel: "Confirm",
      variant: "primary",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/master/deleted-domain`, {
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

        toast.success("Record undo successfully");
        mutate(`/api/admin/master/deleted-domain`);
      }
    });
  };

  const columns: Column<DataItem>[] = [
    {
      header: "Domain Name",
      accessor: (item) => (
        <div className="flex items-center gap-2 group">

          <span className="truncate">{item.domainName}</span>

          <CopyText text={item.domainName} />
        </div>
      ),
    },
    {
      header: "Access Token",
      accessor: (item) => (
        <div className="flex items-center gap-2 group">

          <span className="truncate">{item.accessToken}</span>


          <CopyText text={String(item.accessToken)} />
        </div>
      ),
    },

    {
      header: "Deleted On",
      accessor: (item) => (


        <span>{dayjs(item.isDeletedOn).utc().format('DD-MM-YYYY h:mm A')}</span>

      ),
      className: "truncate"
    },
  ];

  return (
    <section className="p-4">

      <div className="flex justify-end py-2 px-3">
        <CustomBreadcrumb
          paths={[
            { label: "Dashboard", href: `/admin/dashboard/` },
            { label: "Active Domain", isPage: true },
          ]}
        />
      </div>

      <div >
        <DataTableComponent
          title="Deleted Domains"
          columns={columns}
          data={data?.data ?? []}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          placeholder="Seach By Domain"
          onUndo={handleUndo}
          undoById={(item) => handleUndoById(item)}
          detail={(item)=> `/admin/dashboard/masters/deleted-domains/${item.id}/detail`}
          onEdit={(item)=> `/admin/dashboard/masters/deleted-domains/${item.id}/edit`}

        />
      </div>
    </section>
  )
}