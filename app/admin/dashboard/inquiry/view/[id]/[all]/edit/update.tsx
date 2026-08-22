'use client';
import { FiGlobe, FiKey, FiLock, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue
} from "@/components/ui/multi-select";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import { useRouter } from "next/navigation";

export default function Update({ inquiry, domainId, inquiryID }: { inquiry: any, domainId: number, inquiryID: number }) {

  const { data } = useSWR(`/api/admin/master/source`, fetcher);
  const [inquiryData, setInquiryData] = useState(inquiry);
  const [source, setSource] = useState<string[]>([]);

  const route = useRouter();




  useEffect(() => {
    const defaultSource = inquiryData.find((item: any) => item.key === "Source")?.value;
    if (defaultSource) {
      setSource([defaultSource]);
    }
  }, [inquiryData]);





  const sourcehandling = (newValues: string[]) => {
    if (newValues.length > 1) {
      toast.error("You cannot select more than one source");
      return;
    }
    setSource(newValues);
  }

  const handleChange = (key: string, value: string) => {
    setInquiryData((prev: any[]) =>
      prev.map((item) =>
        item.key === key ? { ...item, value } : item
      )
    );
  };

  const handleUpdate = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {

      const payload = inquiryData.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, any>);


      payload["Source"] = source[0] || "";

      const res = await fetch(`/api/create-post/${inquiryID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Update failed");
        return;
      }

      toast.success("Updated successfully");
      route.push(`/dashboard/inquiry/view/${domainId}`)
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };


  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">

      <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:text-left">
        Edit Inquiry
      </h1>

      <form className="space-y-6" onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-1  gap-4">
          {
            inquiryData.filter((item: any) => item.key !== "Added By" && item.key !== "IP Address" && item.key !== "Source").map((item: any, index: number) => (
              <div className="flex flex-col gap-1"
                key={index}
              >
                <label className="text-sm text-gray-500">{item.key}</label>
                <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                  <div className="px-3 text-gray-500 flex items-center">
                    <FiGlobe size={20} />
                  </div>
                  <div className="h-10 w-px bg-gray-300" />
                  {item.key === "Message" ? (
                    <textarea
                      value={item?.value}
                      className="w-full px-3 py-2 bg-transparent focus:outline-none resize-none"
                      rows={6}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={item?.value}
                      className="w-full px-3 py-2 bg-transparent focus:outline-none"
                      onChange={(e) => handleChange(item.key, e.target.value)}
                    />
                  )}
                </div>
              </div>
            ))
          }
        </div>

        <div>
          <label className="text-sm text-gray-500 font-medium"> Source</label>
          <MultiSelect values={source} onValuesChange={sourcehandling} single>
            <MultiSelectTrigger className="w-full">
              <MultiSelectValue placeholder="Select Source..." />
            </MultiSelectTrigger>
            <MultiSelectContent>
              <MultiSelectGroup>
                {data?.map((item: any, index: number) => (
                  <MultiSelectItem key={index} value={item.source}>
                    {item.source}
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>
        </div>



        <div className="flex justify-start gap-2 pt-4">
          <button
            type="submit"
            className="bg-[#7367f0] text-white px-6 py-2 cursor-pointer rounded-sm hover:bg-[#4f43cf] transition"
          >
            Update
          </button>
          <Link
            href={`/admin/dashboard/inquiry/view/${domainId}`}
            className="inline-flex bg-[#00bad1] text-white justify-center gap-0.5 items-center px-6 py-2 rounded-sm transition hover:bg-[#009fb3]"
          >
            Go Back
            <IoIosArrowRoundBack size={24} />
          </Link>
        </div>
      </form>
    </div>
  );
}