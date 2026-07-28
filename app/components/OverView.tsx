'use client';

import { fetcher } from "@/lib/fetcherSwr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import useSWR from "swr";

interface KeyValue {
  key: string;
  value: string | number | boolean;
}

interface ResponseObject {
  Domain_Name?: string;
  body?: KeyValue[];
}

 
interface APIResponse {
  response?: ResponseObject;
}

interface IDsProps {
     
    id : string | number;
    back : string;
}

export default function OverView({ id ,back } : IDsProps) {
   
  const { data, error, isLoading } = useSWR<APIResponse>(
    `/api/user/inquiry/view/inquiry/${id}`,
    fetcher
  );

 

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load response.</div>;
  }

 
  const responseObject: ResponseObject = data?.response || {};
  const responseData: KeyValue[] = Array.isArray(responseObject.body)
    ? responseObject.body
    : [];

  return (
    <section className="">
      <div className="bg-white p-8 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.15)] space-y-6">
        {responseData.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <h1 className="text-2xl text-gray-700 mx-auto lg:mx-0">Detail Page</h1>
            </div>

            {responseData.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-gray-100 pb-2"
              >
                <span className="text-base font-bold text-[#00bad1]">{item?.key} :</span>
                <p className="text-gray-700 mt-1">{String(item?.value)}</p>
              </div>
            ))}

            {responseObject.Domain_Name && (
              <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <span className="text-base font-bold text-[#00bad1]">Domain Name :</span>
                <p className="text-gray-700">{responseObject.Domain_Name}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 italic">No response data</div>
        )}

        <Link
          href={back}
          className="inline-flex bg-[#00bad1] text-white items-center gap-1 px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          <IoIosArrowRoundBack size={24} />
          Go Back
        </Link>
      </div>
    </section>
  );
}