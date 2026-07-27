import { prisma } from "@/lib/prisma";
import { IoIosArrowRoundBack } from "react-icons/io";
import CustomBreadcrumb from "@/app/components/BreadCrumb";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    domain_id: string;
    detail: string;
  }>;
}

interface KeyValue {
  key: string;
  value: string | number | boolean;
}

interface ResponseObject {
  Domain_Name?: string;
  body?: KeyValue[];
}

export default async function Page({ params }: PageProps) {
  const { domain_id, detail } = await params;

  

  const result = await prisma.domainResponse.findUnique({
    where: { id: Number(detail) },
    select: { response: true },
  });

  if (!result || !result.response) {
    return (
      <div className="p-6 text-center text-gray-500">
        Response not found.
      </div>
    );
  }

  const responseObject = result.response as ResponseObject;

  const responseData: KeyValue[] = Array.isArray(responseObject.body)
    ? responseObject.body
    : [];

  return (
    <section className="p-4 mx-auto">
      {/* Breadcrumb */}
      <div className="flex justify-end m-2">
        <CustomBreadcrumb
          paths={[
            { label: "View", href: "/dashboard/inquiry/deleted-view" },
            {
              label: "Records",
              href: `/dashboard/inquiry/deleted-view/${domain_id}`,
            },
            { label: "Detail", isPage: true },
          ]}
        />
      </div>

      {/* Response Container */}
      <div className="bg-white p-6 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.15)] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h1 className="text-2xl text-gray-700 mx-auto lg:mx-0 px-4">
            Detail Page
          </h1>
        </div>

        {/* Response Body */}
        {responseData.length > 0 ? (
          responseData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-gray-100 pb-2 px-4"
            >
              <span className="text-base font-bold text-[#00bad1]">
                {item.key} :
              </span>
              <p className="text-gray-700 mt-1">
                {String(item.value)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">
            Response not found.
          </div>
        )}

        {/* Domain Name */}
        {responseObject.Domain_Name && (
          <div className="flex items-center gap-3 border-b border-gray-100 pb-2 px-4">
            <span className="text-base font-bold text-[#00bad1]">
              Domain Name :
            </span>
            <p className="text-gray-700">
              {responseObject.Domain_Name}
            </p>
          </div>
        )}

        {/* Back Button */}
        <Link
          href={`/dashboard/inquiry/deleted-view/${domain_id}`}
          className="inline-flex bg-[#00bad1] text-white items-center gap-1 px-4 mx-3 py-2 rounded-md hover:opacity-90 transition"
        >
          <IoIosArrowRoundBack size={24} />
          Go Back
        </Link>
      </div>
    </section>
  );
}
