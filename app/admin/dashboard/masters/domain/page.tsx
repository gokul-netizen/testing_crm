'use client';


import useSWR, { mutate } from "swr";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import { useState } from "react";
import RightSideDrawer from "./addRecoreds";
import { toast } from "sonner";
import { updateDomainStatus } from "@/lib/update-status";
import { confirmAction } from "@/app/components/ConfirmSooner";
dayjs.extend(utc);



type DataItem = {
  id: number;
  domainName: string;
  accessToken: string;
  status: string;
  addedOn: string;
};


const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page() {

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

  const { data, error, isLoading } = useSWR("/api/admin/master/domain", fetcher);

  if (isLoading) return <SpinnerCircle4 />;
  if (error) return <p>Failed to load domains {error.message}</p>;
  if (!data) return <p>No data</p>;

 

  const getSelectedIds = () => {
    return Object.keys(selectedRows).filter((id) => selectedRows[Number(id)]).map(Number)
  }

  const handleActive = async () => {

    const ids = getSelectedIds();

    if (ids.length === 0) {
      return toast.error("Selection Required", {
        description: "Please select at least one record to update.",
      });
    }
    try {
      await updateDomainStatus(ids, "Active");
      mutate("/api/admin/master/domain");
      setSelectedRows({});
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleBlock = async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) {
      return toast.error("Selection Required", {
        description: "Please select at least one record to update.",
      });
    }
    try {
      await updateDomainStatus(ids, "Blocked");
      mutate("/api/admin/master/domain");
      setSelectedRows({});
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status")
    }
  }


  const handleDelete = async (item: DataItem) => {
      confirmAction({
        title: `Delete "${item.domainName}"?`,
        description: "",
        confirmLabel: "Delete",
        variant: "danger",  
        onConfirm: async () => {
          const res = await fetch(`/api/records/${item.id}`, {
            method: "DELETE",
          });
  
          if (!res.ok) {
            throw new Error("Failed to delete record");
          }
          mutate("/api/admin/master/domain");
          toast.success(`Domain "${item.domainName}" deleted`);
        },
      });
    };

  const handleAllDelete = async () => {
    const ids = getSelectedIds();
    confirmAction({
      title: `Are you sure want to delete these domains?`,
      description: "",
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/records/", {
            method: "PATCH",
            body: JSON.stringify({ ids }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            throw new Error("Failed to delete record");
          }

          mutate("/api/admin/master/domain");
          toast.success("Domain deleted");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete domain");
        }
      },
    });
  }

  const columns: Column<DataItem>[] = [
    {
      header: "Domain Name",
      accessor: (item) => (
        <div className="flex items-center gap-2 group">
          <Link href={`/admin/dashboard/masters/domain/${item.id}/detail`}>
            <span className="truncate">{item.domainName}</span>
          </Link>
          <CopyText text={item.domainName} />
        </div>
      ),
    },
    {
      header: "Access Token",
      accessor: (item) => (
        <div className="flex items-center gap-2 group">
          <Link href={`/admin/dashboard/masters/domain/${item.id}/detail`}>
            <span className="truncate">{item.accessToken}</span>

          </Link>
          <CopyText text={String(item.accessToken)} />
        </div>
      ),
    },
    {
      header: "Status", accessor: (item) => (
        <Link href={`/admin/dashboard/masters/domain/${item.id}/detail`}>

          <div className="text-blue-400">{item.status}</div>
        </Link>
      )
    },
    {
      header: "Added On",
      accessor: (item) => (
        <Link href={`/admin/dashboard/masters/domain/${item.id}/detail`}>

          <span>{dayjs(item.addedOn).utc().format('DD-MM-YYYY h:mm A')}</span>
        </Link>
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
          title="Active Domains"
          columns={columns}
          data={data?.data ?? []}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onEdit={(item) => `/admin/dashboard/masters/domain/${item.id}/edit`}
          detail={(item) => `/admin/dashboard/masters/domain/${item.id}/detail`}
          placeholder="Seach By Domain"
          onAdd={() => setOpenDrawer(true)}
          onDelete={handleAllDelete}
          onBlock={handleBlock}
          onActivate={handleActive}
          deleteById={(item) => handleDelete(item)}
        />

        <RightSideDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />

      </div>
    </section>
  )
}