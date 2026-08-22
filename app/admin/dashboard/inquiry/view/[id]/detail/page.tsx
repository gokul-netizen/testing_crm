import { prisma } from "@/lib/prisma";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { FiGlobe, FiKey } from "react-icons/fi";
import { BsHash } from "react-icons/bs";
import { IoTrendingUpOutline } from "react-icons/io5";

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

  const fields = [
    { label: "Domain ID", value: id, icon: <BsHash size={20} /> },
    { label: "Domain Name", value: detail.domainName, icon: <FiGlobe size={20} /> },
    { label: "ADDED_BY", value: detail.addedBy, icon: <BiUser size={20} /> },
    { label: "Access Token", value: detail.accessToken, icon: <FiKey size={20} /> },
    { label: "Status", value: detail.status, icon: <IoTrendingUpOutline size={20} /> },
    { label: "updatedBy", value: detail.updatedBy ?? "-", icon: <BiUser size={20} /> },
    { label: "updatedOn", value: detail.updatedOn? dayjs.utc(detail.updatedOn?? "").format("DD-MM-YYYY hh:mm A") : "-", icon: <AiOutlineClockCircle size={20} /> },
    { label: "Created At", value: dayjs.utc(detail.addedOn).format("DD-MM-YYYY hh:mm A"), icon: <AiOutlineClockCircle size={20} /> },
  ];

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full  bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:flex lg:justify-start">Domain Detail</h1>
       

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-1">

              <label className="block text-gray-500 text-sm">
                {field.label}
              </label>

              <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">

                <div className="px-3   flex items-center">
                  {field.icon}
                </div>

                <div className="h-10 w-px bg-gray-300" />

                <input
                  type="text"
                  value={field.value as any}
                  readOnly
                  className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center flex justify-start ">
          <Link
            href="/admin/dashboard/inquiry/view"
            className="inline-flex bg-[#00bad1] text-white justify-center  gap-0.5 items-center  px-6 py-2 rounded-sm   transition"
          >
            Go Back
            <IoIosArrowRoundBack />
          </Link>
        </div>
      </div>
    </div>
  );
}
