"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pencil, EllipsisVertical, Upload, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import DateRangeFilter from "@/app/components/DateBasedSearch";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import SliderPanel from "@/app/components/SideSlider";
import Link from "next/link";
import { mutate } from "swr";
import { confirmAction } from "@/app/components/ConfirmSooner";
import { toast } from "sonner";
import CopyText from "@/app/components/CopyText";
import RightSideDrawerInquiry from "./add-inquiry";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

type DataItem = {
  id: string | number;
  domain_id: string | number;
  name: string;
  email: number;
  phone: string;
  followUpStatus: string;
  createdAt: string;
  domain: {
    logo: string;
  }
};

type DataTableProps = {
  title?: string;
  data: DataItem[];
  onEdit?: (item: DataItem) => void;
  onDelete?: (item: DataItem) => void;
  OnExcel?: () => void;
  onPdf?: () => void;
  onAdd?: () => void;
  domainId?: number;
  onBulkDelete?: (ids: (string | number)[]) => void;

};

export default function DataTable({
  title = "Data Table",
  data,
  onEdit,
  onDelete,
  onBulkDelete,
  onPdf,
  domainId,

  onAdd,
  OnExcel,
}: DataTableProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [entitiesPerPage, setEntitiesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [keys, setKeys] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [toDate, setToDate] = useState("");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
  const [add, setAdd] = useState(false);


  const params = useParams();
  const id = params.id;



  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ? true : Object.values(item).some(v => String(v).toLowerCase().includes(q));
      if (!matchesSearch) return false;

      const created = dayjs.utc(item.createdAt);
      let matchesFromDate = true;
      let matchesToDate = true;
      let matchesBranch = true;

      if (fromDate) {
        matchesFromDate = created.isSameOrAfter(dayjs.utc(fromDate).startOf("day"));
      }

      if (toDate) {
        matchesToDate = created.isSameOrBefore(dayjs.utc(toDate).endOf("day"));
      }

      if (keys.length > 0) {

        matchesBranch = item.response?.body?.some((field: any) => {
          const cleanKey = field.key
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          const selectedKey = keys[0]
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          const fieldValue = field.value?.toString().toLowerCase().trim();
          const selectedValue = value?.toString().toLowerCase().trim();

          return cleanKey === selectedKey && fieldValue === selectedValue;
        }
        ) ?? false;
      }
      return matchesFromDate && matchesToDate && matchesBranch;
    });

  }, [data, fromDate, toDate, search, keys, value]);

  const branches = data?.flatMap((item: any) =>
    item.response?.body?.map((field: { key: string }) => field.key)
  );

  const uniqueKeyNames = [...new Set(branches)];


  const totalPages = Math.max(1, Math.ceil(filteredData.length / entitiesPerPage));
  const startIndex = (currentPage - 1) * entitiesPerPage;
  const endIndex = Math.min(startIndex + entitiesPerPage, filteredData.length);
  const currentData = filteredData.slice(startIndex, endIndex);

  const toggleSelectAll = (checked: boolean) => {
    const newSelection: Record<string | number, boolean> = {};
    if (checked) {
      currentData.forEach((item) => {
        newSelection[item.id] = true;
      });
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectRow = (id: string | number, checked: boolean) => {
    setSelectedRows((prev) => ({ ...prev, [id]: checked }));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const totalNumbers = 5;
    let start = Math.max(currentPage - Math.floor(totalNumbers / 2), 1);
    let end = Math.min(start + totalNumbers - 1, totalPages);
    start = Math.max(end - totalNumbers + 1, 1);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSearch("");
    setCurrentPage(1);
    setKeys([])
    setValue("")
  };

  const handleDelete = async (item: DataItem) => {
    confirmAction({
      title: `Delete "${item.name}"?`,
      description: "Are you sure you want to delete it?",
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/inquiries/deleted-inquiries`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: [item.id] })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete user");
        }

        toast.success(`Deleted successfully..!`);
        mutate(`/api/admin/inquiries/view/${id}`);
      },
    });
  };

  
  const selectedIds = Object.keys(selectedRows).filter((id) => selectedRows[id]).map(Number)
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one record");
      return;
    }

    confirmAction({
      title: `Delete ${selectedIds.length} record(s)?`,
      description: "Are you sure you want to delete it?",
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
    
        const res = await fetch(`/api/admin/inquiries/deleted-inquiries`, {
         method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids : selectedIds })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Bulk delete failed");
        }

        toast.success(`Deleted successfully..!`);
        setSelectedRows({});
        mutate(`/api/admin/inquiries/view/${id}`);
      },
    });
  };

  return (
    <div>
      <div className="flex justify-end m-2">
        <CustomBreadcrumb paths={[{ label: "View", href: "/admin/dashboard/inquiry/view" }, { label: "Records", isPage: true }]} />
      </div>
      <div className="bg-white overflow-x-auto w-full rounded-sm px-2 sm:px-4 relative shadow-[0_0_20px_rgba(0,0,0,0.15)]">
        <div>
          <div className="flex flex-col md:flex-row items-center justify-between px-5 py-8 md:px-0 md:py-4 border-b border-gray-200 gap-8 lg:gap-0">
            <div className="text-2xl text-gray-700 ">{title}</div>
            <div className="flex flex-wrap gap-3  lg:gap-6">

              {onAdd && (
                <Button
                  size="lg"
                  className="bg-[#7367f0] hover:bg-[#7a2d99] cursor-pointer rounded-sm px-4 py-3 text-base font-semibold"
                  onClick={() => setAdd(true)}
                >
                  Add New Inquiry
                </Button>
              )}
              {domainId !== undefined && (
                <RightSideDrawerInquiry
                  open={add}
                  onClose={() => setAdd(false)}
                  domainId={domainId}
                />
              )}


              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-[#e9e7fd] text-purple-500  cursor-pointer hover:bg-purple-200 rounded-sm px-4 py-3 text-base font-semibold flex items-center gap-2"
                  >
                    <Upload className="w-6 h-6 text-purple-500" /> <span>Export{" "}</span>
                    <ChevronDown size={28} className="w-6 h-6 text-purple-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white text-black shadow-lg z-50  border-none rounded-xl"
                >
                  <DropdownMenuItem className="flex items-center gap-3 cursor-pointer px-4 py-3 text-lg"
                    onClick={onPdf}
                  >
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 cursor-pointer px-4 py-3 text-lg">
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 cursor-pointer px-4 py-3 text-lg"
                    onClick={OnExcel}
                  >
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                className="bg-[#ff4c51] hover:bg-[#e64449] cursor-pointer  rounded-sm px-4 py-3 text-base font-semibold flex items-center gap-2 text-white"
                onClick={handleBulkDelete}

              >
                Delete
              </Button>

              <Button className="border bg-[#00bad1] hover:bg-[#11c4db] rounded-sm px-4 py-3 text-base font-semibold flex items-center gap-2 cursor-pointer" onClick={handleReset}>
                Reset
              </Button>
              <Button className="bg-[#7367f0] hover:bg-[#584ec2] text-white  rounded-sm px-4 py-3 text-base font-semibold flex items-center gap-2 cursor-pointer" onClick={() => setIsSliderOpen(true)}>
                Search
              </Button>
            </div>

            <SliderPanel isOpen={isSliderOpen} onClose={() => setIsSliderOpen(false)} >
              <div>
                <h3 className="text-lg font-semibold mb-4">Filter By Date</h3>
                <DateRangeFilter
                  branch={keys}
                  setBranch={setKeys}
                  value={value}
                  setValue={setValue}
                  branchOptions={uniqueKeyNames}
                  fromDate={fromDate}
                  toDate={toDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                  onApply={() => {
                    setCurrentPage(1);
                    setIsSliderOpen(false);
                  }}
                />
              </div>
            </SliderPanel>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-7 py-6 border-b border-gray-200 md:px-0 gap-3">
            <div className="flex items-center gap-3 text-xl mx-auto lg:m-0">
              <span className="text-gray-500 text-base">Show</span>
              <select
                value={entitiesPerPage}
                onChange={(e) => {
                  setEntitiesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              <span className="text-gray-500 text-base">entries</span>
            </div>


            <div className="w-full sm:w-auto flex items-center">
              <label className="text-gray-400 font-medium p-4 text-base">Search:</label>
              <input
                type="text"
                placeholder="   search name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 h-10 border text-black border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>
          </div>

          {/* desktop version  */}
          <div className="hidden md:block  overflow-x-auto">
            <table className="w-full min-w-150 text-left table-auto border-collapse text-black">
              <thead className="sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050] flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#7367f0] mx-2 cursor-pointer"
                      checked={currentData.length > 0 && currentData.every(item => selectedRows[item.id])}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                    SL NO
                  </th>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">NAME</th>

                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">PHONE</th>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">STATUS</th>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">ADDED ON </th>
                  <th className="px-4 py-6 text-sm text-center font-medium text-[#444050]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="text-base font-medium text-gray-600 border-b border-gray-200"  >
                      <td className="px-4 py-8 flex items-center gap-2 ">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#7367f0] m-2 cursor-pointer"
                          checked={!!selectedRows[item.id]}
                          onChange={(e) => toggleSelectRow(item.id, e.target.checked)}
                        />
                        {startIndex + index + 1}
                      </td>
                      <td  >
                        <div className="flex items-center gap-1 group">
                          <Link
                            href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}

                          >
                            {item.name ? item.name : "-"}
                          </Link>
                          {item.name && <CopyText text={item.name} />}
                        </div>
                      </td>

                      <td  >
                        <div className="flex items-center    gap-1 group">
                          <Link
                            href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}
                          >
                            {item.phone ? item.phone : "-"}
                          </Link>
                          {item.phone && <CopyText text={item.phone} />}
                        </div></td>

                      <td  >
                        <div className="flex items-center  gap-1 group">
                          <Link
                            href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}
                          >
                            {item.followUpStatus ? item.followUpStatus : "-"}
                          </Link>

                        </div>
                      </td>
                      <td className="px-2 py-6 whitespace-nowrap "><Link href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}>{dayjs.utc(item.createdAt).format("DD-MM-YYYY : hh:mm A")}</Link></td>

                      <td className="px-4 py-6">
                        <div className="flex items-center justify-center gap-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="bg-white hover:bg-gray-200 cursor-pointer rounded-full" size="icon">
                                <EllipsisVertical className="w-8 h-8 text-gray-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white text-black shadow-lg z-50 border-none">
                              <DropdownMenuItem className="px-4 py-3 text-lg cursor-pointer" onClick={() => router.push(`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`)}>
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {onDelete && (
                                <DropdownMenuItem className="px-4 py-3 text-lg text-red-600 cursor-pointer" onClick={() => handleDelete(item)}>
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {onEdit && (
                            <Button className="p-3 bg-white cursor-pointer hover:bg-gray-100 rounded-full" onClick={() => router.push(`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}/edit`)}>
                              <Pencil className="text-gray-500 w-6 h-6" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center py-6 text-black">No records found 😶</td></tr>
                )}
              </tbody>
            </table>
          </div>


          {/* mobile version  */}
          <div className="block md:hidden">
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <div key={item.id} className="mb-4 ">
                  <div className="relative border rounded-lg p-2 bg-white shadow-sm">

                    {/* Actions */}
                    <div className="absolute bottom-0 right-3 py-2  flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {startIndex + index + 1}
                      </span>

                      <input
                        type="checkbox"
                        checked={!!selectedRows[item.id]}
                        onChange={(e) => toggleSelectRow(item.id, e.target.checked)}
                        className="w-5 h-5 accent-[#7367f0] cursor-pointer"
                      />


                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="bg-white hover:bg-gray-200 rounded-full"

                          >
                            <EllipsisVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-40 bg-white text-black border-none"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`
                              )
                            }
                          >
                            Details
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {onDelete && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(item)}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {onEdit && (
                        <button
                          className="bg-white hover:bg-gray-100 "

                          onClick={() =>
                            router.push(
                              `/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}/edit`
                            )
                          }
                        >
                          <Pencil className="w-4 h-5 text-gray-600" />
                        </button>
                      )}
                    </div>

                    {/* Data */}
                    <div className="space-y-2 pb-6">

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-700">Name</span>

                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}
                            className="text-right"
                          >
                            {item.name || "-"}
                          </Link>

                          {item.name && <CopyText text={item.name} />}
                        </div>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-700">Phone</span>

                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}
                          >
                            {item.phone || "-"}
                          </Link>

                          {item.phone && <CopyText text={item.phone} />}
                        </div>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-700">Status</span>

                        <Link
                          href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}
                        >
                          {item.followUpStatus || "-"}
                        </Link>
                      </div>

                      <div className="flex justify-between   ">
                        <span className="font-medium text-gray-700 ">Added On</span>

                        <Link
                          href={`/admin/dashboard/inquiry/view/${item.domain_id}/${item.id}`}
                          className="shrink-0"
                        >
                          {dayjs
                            .utc(item.createdAt)
                            .format("DD-MM-YYYY : hh:mm A")}
                        </Link>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-black">
                No records found 😶
              </p>
            )}
          </div>



          <div className="flex flex-col sm:flex-row items-center text-gray-500 justify-between px-6 py-8 bg-white border-t border-gray-200">
            <div className="text-base">
              Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{filteredData.length}</span> entries
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0 flex-wrap">
              <Button variant="ghost" className="px-4 py-3 text-2xl rounded-sm bg-gray-200" onClick={() => goToPage(1)} disabled={currentPage === 1}>«</Button>
              <Button variant="ghost" className="px-4 py-3 text-2xl rounded-sm bg-gray-200" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>‹</Button>
              {getPageNumbers().map((page) => (
                <Button key={page} className={`px-4 py-3 text-base font-semibold rounded-md transition-all ${currentPage === page ? "bg-[#7367f0] text-white shadow-lg scale-105" : "hover:bg-gray-200"}`} onClick={() => goToPage(page)}>{page}</Button>
              ))}
              <Button variant="ghost" className="px-4 py-3 text-2xl rounded-sm bg-gray-200" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>›</Button>
              <Button variant="ghost" className="px-4 py-3 text-2xl rounded-sm bg-gray-200" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>»</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}