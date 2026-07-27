'use client';


import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { FiKey } from "react-icons/fi";
 
import { IoTrendingUpOutline } from "react-icons/io5";
import { MdOutlineDelete, MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import { FaRegImage } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import SpinnerCircle4 from "@/components/spinner-10";

dayjs.extend(utc);
dayjs.extend(customParseFormat);



export default function UserDetailPage() {


    const params = useParams();

    const { user_id, id } = params;

    const { data, error, isLoading } = useSWR(`/api/user/user-management/${id}`, fetcher);

    const detail = data;

    if (isLoading) return <SpinnerCircle4 />



    if (!detail) {
        return <p>User not found</p>;
    }

    const fields = [


        { label: "Name", value: detail.name, icon: <BiUser size={20} /> },
        { label: "UserName", value: detail.username, icon: <BiUser size={20} /> },
        { label: "Password", value: detail.show_password, icon: <FiKey size={20} /> },
        { label: "Status", value: detail.status, icon: <IoTrendingUpOutline size={20} /> },
        { label: "Email_Trigger", value: detail.emailTriggerOption, icon: <IoTrendingUpOutline size={20} /> },
        { label: "Email", value: detail.email ?? "-", icon: <MdOutlineMailOutline size={20} /> },

        {
            label: "Added_on",
            value: detail.added_on ? dayjs.utc(detail?.added_on).format("DD-MM-YYYY hh:mm A") : "-",
            icon: <AiOutlineClockCircle size={20} />,
        },

        {
            label: "Joining_date",
            value: detail.joining_date
                ? dayjs.utc(detail.joining_date).format("DD-MM-YYYY")
                : "-",
            icon: <AiOutlineClockCircle size={20} />,
        },

        { label: "Mobile_no", value: detail.mobile_no ?? "-", icon: <MdOutlinePhone size={20} /> },
        { label: "Added_by", value: detail.added_by ?? "-", icon: <BiUser size={20} /> },

        {
            label: "Last_login",
            value: detail.last_login
                ? dayjs.utc(detail.last_login).format("DD-MM-YYYY hh:mm A")
                : "-",
            icon: <AiOutlineClockCircle size={20} />,
        },

        {
            label: "Domain",
            value: detail.inquiryDomain?.domainName ?? "-",
            icon: <TbWorld size={20} />,
        },

        { label: "Login_ip", value: detail.last_loginip ?? "-", icon: <TbWorld size={20} /> },

        {
            label: "Updated_on",
            value: detail.updated_on
                ? dayjs.utc(detail.updated_on).format("DD-MM-YYYY hh:mm A")
                : "-",
            icon: <AiOutlineClockCircle size={20} />,
        },

        { label: "Updated_by", value: detail.updated_by ?? "-", icon: <BiUser size={20} /> },

        { label: "Deleted", value: String(detail.isDeleted), icon: <MdOutlineDelete size={20} /> },
        { label: "Deleted_by", value: detail.isDeletedBy ?? "-", icon: <BiUser size={20} /> },

        {
            label: "Deleted_on",
            value: detail.isDeletedOn
                ? dayjs.utc(detail.isDeletedOn).format("DD-MM-YYYY hh:mm A")
                : "-",
            icon: <MdOutlineDelete size={20} />,
        },

        { label: "User Image", value: detail.user_image ?? "-", icon: <FaRegImage size={20} /> },
    ];

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full bg-white rounded-lg shadow-xl p-6">

                <h1 className="text-xl text-gray-600 font-medium mb-6">
                    User Detail
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {fields.map((field) => (
                        <div key={field.label} className="flex flex-col gap-1">

                            <label className="text-gray-500 text-sm">
                                {field.label}
                            </label>

                            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">

                                <div className="px-3 flex items-center">
                                    {field.icon}
                                </div>

                                <div className="h-10 w-px bg-gray-300" />

                                {field.label === "User Image" ? (
                                    field.value ? (
                                        <img
                                            src={`/${field.value}`}
                                            alt="user"
                                            className="h-32 w-36 m-4 object-cover"
                                        />
                                    ) : (
                                        <p className="text-gray-500 px-3 py-2">
                                            No image available
                                        </p>
                                    )
                                ) : (
                                    <input
                                        type="text"
                                        value={field.value ?? "-"}
                                        readOnly
                                        className="w-full px-3 py-2 bg-transparent text-gray-800 focus:outline-none"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Link
                        href={`/user/user-management/add-user`}
                        className="inline-flex bg-[#00bad1] text-white items-center gap-1 px-6 py-2 rounded-sm"
                    >
                        Go Back
                        <IoIosArrowRoundBack />
                    </Link>
                </div>

            </div>
        </div>
    );
}