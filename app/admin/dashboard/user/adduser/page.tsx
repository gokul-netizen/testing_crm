"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import { confirmAction } from "@/app/components/ConfirmSooner";
import { toast } from "sonner";
import SpinnerCircle4 from "@/components/spinner-10";
import DataTableComponent, { Column } from "@/app/components/DataTable";
import Link from "next/link";
import CopyText from "@/app/components/CopyText";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { AddUser } from "./add-user";
dayjs.extend(utc);

type DataItem = {
  id: number;
  name: string;
  email: string;
  status: string;
  added_on: string;
  inquiryDomain: { domainName: string };
};



export default function Page() {

  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [openDrawer, setOpenDrawer] = useState(false);

  const { data, error, isLoading } = useSWR("/api/admin/user-management/add-user", fetcher);

  if (isLoading) return <SpinnerCircle4 />;
  if (error) return <p className="p-4 text-red-500">Error loading data</p>;

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

      const response = await fetch(`/api/admin/user-management/add-user`,{
       method: "PATCH",
       body: JSON.stringify({ ids, status : "Active"}),
      });

      if (!response.ok){
        toast.error("Error occured. Can't delete the user");
      }

      setSelectedRows({});
      mutate("/api/admin/user-management/add-user");
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleBlock = async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) {
      return toast.error("Selection Required", {
        description: "Please select at least one record to update.",
      });
    }
    try {

      const response = await fetch(`/api/admin/user-management/add-user`,{
       method: "PATCH",
       body: JSON.stringify({ ids, status : "Blocked"}),
      });

      if (!response.ok){
        toast.error("Error occured. Can't delete the user");
      }

      setSelectedRows({});
      mutate("/api/admin/user-management/add-user");
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return toast.error("No users selected");

    confirmAction({
      title: `Are you sure you want to delete the users?`,
      description: "",
      confirmLabel: "Delete All",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/user-management/add-user`, {
          method: "DELETE",
          body: JSON.stringify({ ids }),
        });

        if (!res.ok) throw new Error("Failed to delete users");

        mutate("/api/admin/user-management/add-user");
        setSelectedRows({});
        toast.success(`Users Deleted Successfully`);
      },
    });
  };

  const handleDeleteUserById = async (item: DataItem) => {
    confirmAction({
      title: `Delete user "${item.name}"?`,
      description: "",
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/user-management/add-user`, {
          method: "DELETE",
          body : JSON.stringify({ids : [item.id]})
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete user");
        }

        mutate("/api/admin/user-management/add-user");
        toast.success("Deleted Successfully");
      },
    });
  };

  const columns: Column<DataItem>[] = [
    {
      header: "Name",
      accessor: (item) => (
        <div className="flex items-center gap-2 group">
          <Link href={`/admin/dashboard/user/adduser/${item.id}/detail`}>
            <span className="truncate">{item.name}</span>
          </Link>
          <CopyText text={item.name} />
        </div>
      ),
    },
    {
      header: "Domain Name",
      mobileHeader: "DN",
      accessor: (item) => (
        <div className="flex items-center gap-2 group">
          <Link href={`/admin/dashboard/user/adduser/${item.id}/detail`}>
            <span className="truncate">{item.inquiryDomain?.domainName}</span>

          </Link>
          <CopyText text={String(item.inquiryDomain?.domainName)} />
        </div>
      ),
    },
    {
      header: "Status", accessor: (item) => (
        <Link href={`/admin/dashboard/user/adduser/${item.id}/detail`}>

          <div className="text-blue-400">{item.status}</div>
        </Link>
      )
    },
    {
      header: "Added On",
      accessor: (item) => (
        <Link href={`/admin/dashboard/user/adduser/${item.id}/detail`}>

          <span>{dayjs(item.added_on).utc().format('DD-MM-YYYY h:mm A')}</span>
        </Link>
      ),
      className: "truncate"
    },
  ];

  return (
    <section className="p-4">
      <DataTableComponent
        title="User List"
        columns={columns}
        data={data ?? []}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onEdit={(item) => `/admin/dashboard/user/adduser/${item.id}/edit`}
        detail={(item) => `/admin/dashboard/user/adduser/${item.id}/detail`}
        placeholder="Seach By Name"
        onAdd={() => setOpenDrawer(true)}
        onDelete={handleDelete}
        onBlock={handleBlock}
        onActivate={handleActive}
        deleteById={(item) => handleDeleteUserById(item)}
      />


      <div>
        <AddUser
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />
      </div>
    </section>
  );
}