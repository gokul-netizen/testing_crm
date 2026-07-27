import { prisma } from "@/lib/prisma";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IoIosArrowRoundBack } from "react-icons/io";

dayjs.extend(utc);

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DomainDetailPage({ params }: Props) {
  const { id } = await params;

  const detail = await prisma.inquiryDomain.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!detail) {
    return <p>Domain not found</p>;
  }

  const detailData = {
    "Domain Name": detail.domainName,
    "Access Token": detail.accessToken,
    Status: detail.status,
    "Updated On": detail.updatedOn ? dayjs.utc(detail.updatedOn).format("DD-MM-YYYY hh:mm A") : "-",
    "Created At": dayjs.utc(detail.addedOn).format("DD-MM-YYYY hh:mm A"),
    Subscription: detail.subscription ?? "-",
  };

  return (
    <section className="px-3">
      <div className="bg-white p-8 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.15)] space-y-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h1 className="text-2xl text-gray-700 mx-auto lg:mx-0">Domain Detail</h1>
        </div>

        <div>
          {Object.entries(detailData).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-6 my-8 border-b border-gray-100 pb-2"
            >
              <span className="text-base font-bold text-[#00bad1]">
                {key}:
              </span>
              <p className="text-gray-700 mt-1">
                {String(value)}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/admin/dashboard/masters/domain"
          className="inline-flex bg-[#00bad1] text-white items-center gap-1 px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          <IoIosArrowRoundBack size={24} />
          Go Back
        </Link>

      </div>
    </section>
  );
}