"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pencil, EllipsisVertical, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import DateRangeFilter from "@/app/components/DateBasedSearch";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import SliderPanel from "@/app/components/SideSlider";
import Link from "next/link";
import { mutate } from "swr";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

type DataItem = {
  id: string | number;
  domain_id: string | number;
  name: string;
  email: number;
  phone: string;
  createdAt: string;
};

type DataTableProps = {
  title?: string;
  data: DataItem[];
  onEdit?: (item: DataItem) => void;
  onDelete?: (item: DataItem) => void;
  onBulkDelete?: (ids: (string | number)[]) => void;
};

export default function DataTable({
  title = "Data Table",
  data,
  onEdit,
  onDelete,
  onBulkDelete,
}: DataTableProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [entitiesPerPage, setEntitiesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ? true : 
        item.name.toLowerCase().includes(q) || 
        String(item.email).toLowerCase().includes(q) || 
        item.phone.includes(q);

      if (!matchesSearch) return false;

      const created = dayjs.utc(item.createdAt);
      let matchesFromDate = true;
      let matchesToDate = true;

      if (fromDate) {
        matchesFromDate = created.isSameOrAfter(dayjs.utc(fromDate).startOf("day"));
      }
      if (toDate) {
        matchesToDate = created.isSameOrBefore(dayjs.utc(toDate).endOf("day"));
      }

      return matchesFromDate && matchesToDate;
    });
  }, [data, fromDate, toDate, search]);

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
  };

  const handleDelete = async (item: DataItem) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/days/${item.id}/${item.domain_id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete");
      }
      alert("Record deleted successfully");
      mutate(`/api/days/${item.domain_id}`);
    } catch (err: any) {
      console.error("Delete failed:", err.message);
      alert("Failed to delete record");
    }
  };

  const handleBulkDelete = () => {
    const idsToDelete = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (idsToDelete.length === 0) return alert("Please select records to delete");
    if (confirm(`Are you sure you want to delete ${idsToDelete.length} records?`)) {
        if (onBulkDelete) onBulkDelete(idsToDelete);
    }
  };

  return (
    <div>
      <div className="flex justify-end m-2">
        <CustomBreadcrumb paths={[{ label: "View", href: "/dashboard/inquiry/deleted-view" }, { label: "Records", isPage: true }]} />
      </div>
      <div className="bg-white overflow-x-auto w-full rounded-sm px-2 sm:px-4 relative shadow-[0_0_20px_rgba(0,0,0,0.15)]">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-7 py-8 md:px-0 md:py-4 border-b border-gray-200">
            <div className="text-2xl text-gray-700 mx-auto lg:mx-0">{title}</div>
            <div className="flex gap-4">
              <Button 
                className="bg-[#ff4c51] hover:bg-[#e64449] text-white flex items-center gap-2 rounded-sm font-semibold"
                onClick={handleBulkDelete}
                
              >
                  Delete 
              </Button>
              <Button className="border bg-[#00bad1] hover:bg-[#11c4db] py-2 rounded-sm font-semibold cursor-pointer" onClick={handleReset}>
                Rest
              </Button>
              <Button className="bg-[#7367f0] hover:bg-[#584ec2] text-white mt-4 sm:mt-0 px-6 cursor-pointer" onClick={() => setIsSliderOpen(true)}>
                Seach
              </Button>
            </div>
            <SliderPanel isOpen={isSliderOpen} onClose={() => setIsSliderOpen(false)}>
              <div>
                <h3 className="text-lg font-semibold mb-4">Filter By Date</h3>
                <DateRangeFilter
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
            <div className="flex items-center gap-3 text-xl">
              <span className="text-gray-500 text-base">Show</span>
              <select
                value={entitiesPerPage}
                onChange={(e) => {
                  setEntitiesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-black text-base"
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
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 h-10 border text-black border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-700 px-3"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left table-auto border-collapse text-black">
              <thead className="sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#7367f0] cursor-pointer"
                        checked={currentData.length > 0 && currentData.every(item => selectedRows[item.id])}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                      />
                      SL NO
                    </div>
                  </th>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">NAME</th>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">EMAIL</th>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">PHONE</th>
                  <th className="px-4 py-6 text-sm font-medium text-[#444050]">ADDED ON</th>
                  <th className="px-4 py-6 text-sm text-center font-medium text-[#444050]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="text-base font-medium text-gray-600 border-b border-gray-200" style={{ height: "60px" }}>
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#7367f0] cursor-pointer"
                            checked={!!selectedRows[item.id]}
                            onChange={(e) => toggleSelectRow(item.id, e.target.checked)}
                          />
                          {startIndex + index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-6"><Link href={`/dashboard/inquiry/deleted-view/${item.domain_id}/${item.id}`}>{item.name}</Link></td>
                      <td className="px-4 py-6"><Link href={`/dashboard/inquiry/deleted-view/${item.domain_id}/${item.id}`}>{item.email}</Link></td>
                      <td className="px-4 py-6"><Link href={`/dashboard/inquiry/deleted-view/${item.domain_id}/${item.id}`}>{item.phone}</Link></td>
                      <td className="px-4 py-6"><Link href={`/dashboard/inquiry/deleted-view/${item.domain_id}/${item.id}`}>{dayjs.utc(item.createdAt).format("DD-MM-YYYY : HH mm A")}</Link></td>
                  
                      <td className="px-4 py-6">
                        <div className="flex items-center justify-center gap-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="bg-white hover:bg-gray-200 cursor-pointer rounded-full" size="icon">
                                <EllipsisVertical className="w-8 h-8 text-gray-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white text-black shadow-lg z-50 border-none">
                              <DropdownMenuItem className="px-4 py-3 text-lg cursor-pointer" onClick={() => router.push(`/dashboard/inquiry/view/${item.domain_id}/${item.id}`)}>
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
                            <Button className="p-3 bg-white cursor-pointer hover:bg-gray-100 rounded-full">
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