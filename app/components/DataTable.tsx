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
import { useState, useMemo, ReactNode } from "react";
import dayjs from "dayjs";
import SliderPanel from "./SideSlider";
import DateRangeFilter from "./DateBasedSearch";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { IoMenuOutline } from "react-icons/io5";
import { MdAddCall } from "react-icons/md";



dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  mobileHeader?: string;
};

type DataTableProps<T> = {
  title?: string;
  placeholder?: string;
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => string;
  onUndo?: () => void;
  undoById?: (item: T) => void;
  onActivate?: () => void;
  onBlock?: () => void;
  onExcel?: () => void;
  onAdd?: () => void;
  onSearch?: () => void;
  onReset?: () => void;
  detail?: (item: T) => string;
  onDelete?: () => void;
  deleteById?: (item: T) => void;
  whatsapp?: (item: T) => number;
  mobileCall?: (item : T) => string;
  selectedRows: Record<string | number, boolean>;
  enableSearch?: boolean;
  setSelectedRows: React.Dispatch<React.SetStateAction<Record<string | number, boolean>>>;
  rowKey?: keyof T;
  addButtonDisabled?: boolean;

};

export default function DataTableComponent<T extends { [key: string]: any }>({
  title = "Data Table",
  placeholder = "Search by name,company name",
  data,
  columns,
  onEdit,
  onUndo,
  undoById,
  onActivate,
  onSearch,
  onBlock,
  whatsapp,
  mobileCall,
  onReset,
  onAdd,
  deleteById,
  onExcel,
  detail,
  selectedRows,
  onDelete,
  setSelectedRows,
  enableSearch = false,
  rowKey = "id" as keyof T,
  addButtonDisabled,

}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [entitiesPerPage, setEntitiesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const [keys, setKeys] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const router = useRouter();


  // ---------------------------
  // FILTER DATA (SEARCH + DATE)
  // ---------------------------

  const filteredData = useMemo(() => {
    let tableData = data || [];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      tableData = tableData.filter((item) =>

        item.inquiry?.name?.toLowerCase().includes(q) ||
        item?.name?.toLowerCase().includes(q) ||
        item?.companyName?.toLowerCase().includes(q) ||
        item.inquiry?.companyName?.toLowerCase().includes(q) ||
        item.inquiry?.phone?.includes(q) ||
        item?.service?.toLowerCase().includes(q) ||
        item?.username?.toLowerCase().includes(q) ||
        item?.jobTitle?.toLowerCase().includes(q) ||
        item?.domainName?.toLowerCase().includes(q)

      );
    }

    // Date filter
    const from = fromDate ? dayjs(fromDate).startOf("day") : null;
    const to = toDate ? dayjs(toDate).endOf("day") : null;

    if (from) {
      tableData = tableData.filter(item => dayjs(item.createdAt).isSameOrAfter(from));
    }
    if (to) {
      tableData = tableData.filter(item => dayjs(item.createdAt).isSameOrBefore(to));
    }

    if (keys.length > 0) {
      tableData = tableData?.filter((item: any) => (
        item.response?.body?.some((field: any) => {
          const cleanKey = field.key
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          const selectedKey = keys[0]
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          const fieldValue = field.value?.toString().toLowerCase().trim();
          const selectedValue = value?.toString().toLowerCase().trim();

          return cleanKey === selectedKey && fieldValue === selectedValue;

        })
      ))
    }


    return tableData;
  }, [data, search, fromDate, toDate, keys, value]);


  const allKeys = data?.flatMap((item: any) =>
    item.response?.body?.map((field: { key: string }) => field.key)
  );

  const uniqueKeyNames = [...new Set(allKeys)];

  // ---------------------------
  // PAGINATION LOGIC
  // ---------------------------
  const totalPages = Math.max(1, Math.ceil(filteredData.length / entitiesPerPage));
  const startIndex = (currentPage - 1) * entitiesPerPage;
  const endIndex = Math.min(startIndex + entitiesPerPage, filteredData.length);
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const totalNumbers = 5;
    let start = Math.max(currentPage - Math.floor(totalNumbers / 2), 1);
    let end = Math.min(start + totalNumbers - 1, totalPages);
    start = Math.max(end - totalNumbers + 1, 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div>

      <div className=" bg-white   w-full rounded-sm px-2 sm:px-4 relative shadow-[0_0_20px_rgba(0,0,0,0.15)]">

        <div className="flex flex-col md:flex-row items-start sm:items-center justify-between px-7 py-5 md:px-0 md:py-4 border-b border-gray-200 gap-4">
          <div className="text-2xl text-gray-700 mx-auto lg:mx-0">{title}</div>
          <div className="flex flex-wrap gap-3 sm:gap-6">

            {onUndo && (
              <Button size="lg" className="bg-[#00bad1] hover:bg-[#1591a1] cursor-pointer rounded-sm px-4 py-3 text-base font-semibold" onClick={onUndo}>
                Undo Record
              </Button>
            )}
            {onActivate && (
              <Button size="lg" className="bg-[#00bad1] hover:bg-[#1591a1] cursor-pointer rounded-sm px-4 py-3 text-base font-semibold" onClick={onActivate}>
                Active Record
              </Button>
            )}
            {onBlock && (
              <Button size="lg" className="bg-[#ff4c51] hover:bg-[#c50e0e] cursor-pointer rounded-sm px-4 py-3 text-base font-semibold" onClick={onBlock}>
                Block Record
              </Button>
            )}
            {onDelete && (
              <Button size="lg" className="bg-[#ff4c51] hover:bg-[#c50e0e] cursor-pointer rounded-sm px-4 py-3 text-base font-semibold" onClick={onDelete}>
                Delete Record
              </Button>
            )}

            {onSearch && (
              <Button 
              size="lg"
              onClick={onSearch}
              
              className="bg-[#3d8ae0f5] hover:bg-[#857ed8] text-white cursor-pointer rounded-sm px-4 py-3 text-base font-semibold" >
                Search Records
              </Button>
            )}

            {onReset && (
              <Button size="lg" className=" bg-[#00bad1] hover:bg-[#11c4db] cursor-pointer rounded-sm px-4 py-3 text-base font-semibold" onClick={onReset}>
                Reset Record
              </Button>
            )}
            {onAdd && (
              <Button
                size="lg"
                onClick={onAdd}
                disabled={addButtonDisabled}
                className={`bg-[#7367f0] hover:bg-[#7a2d99] cursor-pointer rounded-sm px-4 py-3 text-base font-semibold`}
              >
                {"Add New Record"}
              </Button>
            )}



            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="bg-[#e9e7fd] text-purple-500 cursor-pointer hover:bg-purple-200 rounded-sm px-4 py-3 text-base font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  <span>Export</span>
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white text-black shadow-lg z-50 border-none rounded-xl">
                <DropdownMenuItem className="px-4 py-3 text-lg cursor-pointer">Export as PDF</DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 text-lg cursor-pointer">Export as CSV</DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 text-lg cursor-pointer" onClick={onExcel}>Export as Excel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


            
          </div>
        </div>


        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-7 py-7 border-b border-gray-200 gap-5 sm:gap-6">
          <div className="flex items-center gap-3 text-xl mx-auto lg:m-0">
            <span className="text-gray-500 text-base">Show</span>
            <select
              value={entitiesPerPage}
              onChange={(e) => { setEntitiesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-3 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {[10, 20, 30].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <span className="text-gray-500 text-base">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 font-medium">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={placeholder}
              className="w-full sm:w-64 h-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 px-2"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="hidden md:block  overflow-x-auto">
          <table className="w-full min-w-[600px] text-left table-auto border-collapse text-black">
            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-white">
              <tr>
                <th className="px-3 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={currentData.length > 0 && currentData.every(item => selectedRows[item[rowKey]])}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const newSelection = { ...selectedRows };
                      currentData.forEach(item => newSelection[item[rowKey]] = checked);
                      setSelectedRows(newSelection);
                    }}
                    className="w-5 h-5 border-2 border-gray-400 accent-purple-600 cursor-pointer"
                  />
                </th>
                <th className="px-3 py-4 text-sm font-medium text-[#444050]">SL NO</th>
                {columns.map((col, i) => (
                  <th key={i} className={`px-3 py-4 text-sm font-medium text-[#444050] ${col.className || ""}`}>
                    {col.header.toUpperCase()}
                  </th>
                ))}
                <th className="px-3 py-4 text-sm text-center font-medium text-[#444050]">ACTIONS</th>
              </tr>
            </thead>
            <tbody  >
              {
                currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={index} className="text-base font-medium text-gray-600 border-b border-gray-200" style={{ height: "60px" }}>
                      <td className="px-3 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={!!selectedRows[item[rowKey]]}
                          onChange={(e) => setSelectedRows({ ...selectedRows, [item[rowKey]]: e.target.checked })}
                          className="w-5 h-5 accent-purple-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-4">{startIndex + index + 1}</td>
                      {columns.map((col, i) => (
                        <td key={i} className={`px-3 py-4 text-sm ${col.className || ""}`}>
                          {typeof col.accessor === "function" ? col.accessor(item) : item[col.accessor as string]}
                        </td>
                      ))}
                      <td className="px-3 py-4 flex justify-center items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="bg-white hover:bg-gray-200 cursor-pointer rounded-full" size="icon">
                              <EllipsisVertical className="w-6 h-6 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-white text-black shadow-lg z-50 border-none">

                            {detail && (
                              <DropdownMenuItem onClick={() => router.push(detail(item))} className="px-4 py-3 text-lg cursor-pointer">Detail</DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            {onUndo && (
                              <DropdownMenuItem onClick={() => undoById?.(item)} className="px-4 py-3 text-lg text-blue-600 cursor-pointer"   >
                                Undo
                              </DropdownMenuItem>
                            )}

                            {whatsapp && (
                              <DropdownMenuItem className="px-4 py-3   text-green-600  cursor-pointer flex items-center gap-2" asChild>
                                <Link href={`https://wa.me/${whatsapp(item)}?text=${encodeURIComponent("Hi there! This is from Marsweb Solutions")}`} target="_blank" >
                                  <FaWhatsapp className="text-xl" />
                                  <span>WhatsApp</span>
                                </Link>
                              </DropdownMenuItem>
                            )}

                            {onDelete && (
                              <DropdownMenuItem onClick={() => deleteById?.(item)} className="px-4 py-3 text-lg text-red-600 cursor-pointer"  >
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {onEdit && (
                          <Button className="p-2 bg-white cursor-pointer hover:bg-gray-100 rounded-full" onClick={() => router.push(onEdit(item))}>
                            <Pencil className="text-gray-500 w-5 h-5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 3} className="text-center py-6 text-black">No records found 😶</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        <div className="block md:hidden">
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="relative border rounded-lg p-2 bg-white shadow-sm">

                  <div className="absolute bottom-0 right-3  flex gap-2 rounded-md hover:bg-gray-100">

                    <div className=" flex gap-2 items-center">
                      <p>{startIndex + index + 1}</p>

                      <input
                        type="checkbox"
                        checked={!!selectedRows[item[rowKey]]}
                        onChange={(e) =>
                          setSelectedRows({
                            ...selectedRows,
                            [item[rowKey]]: e.target.checked,
                          })
                        }
                        className="w-5 h-5 accent-purple-600 cursor-pointer"
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="bg-white hover:bg-gray-200 cursor-pointer rounded-full" size="icon">
                          <IoMenuOutline className="w-6 h-6 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-white text-black shadow-lg z-50 border-none">

                        {detail && (
                          <DropdownMenuItem onClick={() => router.push(detail(item))} className="px-4 py-3 text-lg cursor-pointer">Detail</DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        {onUndo && (
                          <DropdownMenuItem onClick={() => undoById?.(item)} className="px-4 py-3 text-lg text-blue-600 cursor-pointer"  >
                            Undo
                          </DropdownMenuItem>
                        )}

                        {whatsapp && (
                          <DropdownMenuItem className="px-4 py-3   text-green-600  cursor-pointer flex items-center gap-2" asChild>
                            <Link href={`https://wa.me/${whatsapp(item)}?text=${encodeURIComponent("Hi there! This is from Marsweb Solutions")}`} target="_blank" >
                              <FaWhatsapp className="text-xl" />
                              <span>WhatsApp</span>
                            </Link>
                          </DropdownMenuItem>
                        )}

                        {mobileCall && (
                          <DropdownMenuItem className="px-4 py-3   text-blue-600  cursor-pointer flex items-center gap-2" asChild>
                            <Link href={`tel:${mobileCall(item)}`}>
                              <MdAddCall  className="text-xl" />
                              <span>Call</span>
                            </Link>
                          </DropdownMenuItem>
                        )}

                         

                        {onDelete && (
                          <DropdownMenuItem onClick={() => deleteById?.(item)} className="px-4 py-3 text-lg text-red-600 cursor-pointer"  >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="pb-6">
                    {columns.map((col, i) => (
                      <div
                        key={i}
                        className={`flex justify-between px-2 items-start last:border-b-0 ${col.className || ""}`}
                      >
                        <span className="font-medium text-sm text-gray-700">
                          {col.mobileHeader ?? col.header}
                        </span>

                        <span className="text-right truncate text-sm ">
                          {typeof col.accessor === "function"
                            ? col.accessor(item)
                            : String(item[col.accessor as string]).length > 14
                              ? `${String(item[col.accessor as string]).slice(0, 18)}...`
                              : String(item[col.accessor as string])
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-black">No records found 😶</p>
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
              <Button key={page} className={`px-4 py-3 text-base font-semibold rounded-md transition-all ${currentPage === page ? "bg-[#7367f0] text-white shadow-lg scale-105" : "hover:bg-gray-200"}`} onClick={() => goToPage(page)}>
                {page}
              </Button>
            ))}
            <Button variant="ghost" className="px-4 py-3 text-2xl rounded-sm bg-gray-200" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>›</Button>
            <Button variant="ghost" className="px-4 py-3 text-2xl rounded-sm bg-gray-200" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>»</Button>
          </div>
        </div>
      </div>

    </div>
  );
} 