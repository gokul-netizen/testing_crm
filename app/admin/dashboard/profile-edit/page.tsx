'use client';

import SpinnerCircle4 from "@/components/spinner-10";
import { fetcher } from "@/lib/fetcherSwr";
import Link from "next/link";
import {usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPhone, FiUser } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

interface IncomingData {
    Label: string;
    value: string;
    icon: React.ReactNode;
    name: string;
}

export default function Page() {
 
    const pathname = usePathname();
 

    const { data, error, isLoading } = useSWR(`/api/admin-profile`, fetcher);

    const adminDetail = data?.data
     
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        mobile_no: "",
        image: ""
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setFormData({
                name: adminDetail.name ?? "",
                username: adminDetail.username ?? "",
                email: adminDetail.email ?? "",
                mobile_no: adminDetail.phoneNumber ?? "",
                image: adminDetail.user_image ?? ""
            });
        }
    }, [data]);

    if (isLoading) return <SpinnerCircle4 />;

    const detail: IncomingData[] = [
        { Label: "Name", value: formData.name, icon: <FiUser />, name: "name" },
        { Label: "User Name", value: formData.username, icon: <FiUser />, name: "username" },
        { Label: "Email", value: formData.email, icon: <MdOutlineMailOutline />, name: "email" },
        { Label: "Mobile No", value: formData.mobile_no, icon: <FiPhone />, name: "mobile_no" },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const form = new FormData();

        form.append("name", formData.name);
        form.append("username", formData.username);
        form.append("email", formData.email);
        form.append("phoneNumber", formData.mobile_no);

        if (selectedFile) {
            form.append("user_image", selectedFile);
        }

        const res = await fetch("/api/admin-profile", {
            method: "PATCH",
            credentials: "include",
            body: form,
        });

        const result = await res.json();

        if (!res.ok) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        
        mutate("/api/admin-profile");
        
        setSelectedFile(null);

    } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
    }
};

    const handleCancel = () => {
        if (data) {
            setFormData({
                name: adminDetail.name ?? "",
                username: adminDetail.username ?? "",
                email: adminDetail.email ?? "",
                mobile_no: adminDetail.phoneNumber ?? "",
                image: adminDetail?.user_image ?? ""
            });
            setPreviewImage(null);
            setSelectedFile(null);
        }
    };

    const isActive = (path: string) => pathname === path;

    return (
        <section className="p-4">
            <div>
                 
                <div className="flex gap-4">
                    <Link
                        href={`/admin/dashboard/profile`}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-gray-600 hover:bg-purple-100 ${isActive(`/admin/dashboard/profile`) ? "bg-[#7367f0] text-white" : ""
                            }`}
                    >
                        <LuUsers size={20} />
                        <span className="font-semibold">Overview</span>
                    </Link>

                    <Link
                        href={`/admin/dashboard/profile-edit`}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md ${isActive(`/admin/dashboard/profile-edit`) ? "bg-[#7367f0] text-white" : ""
                            }`}
                    >
                        <LuUsers size={20} />
                        <span className="font-semibold">Account</span>
                    </Link>
                </div>

                <div className="bg-white shadow-xl rounded-md p-8 my-6">
                    {/* Image Upload */}
                    <div className="rounded mb-4 flex gap-8 items-center">

                        <img
                            src={
                                previewImage
                                    ? previewImage
                                    : formData?.image
                                        ? `/${formData.image.replace(/\\/g, "/")}`
                                        : "/admin_profile.webp"
                            }
                            alt={data?.username}
                            className="w-28 h-28"
                        />

                        <label className="cursor-pointer  md:font-semibold h-10 gap-2 px-4 py-4 rounded-md bg-[#7367f0] text-white inline-flex items-center">
                            Upload New Image
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

               
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {detail.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="mb-1 text-gray-700">{item.Label}</label>
                                <div className="flex  items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                                    <span className="px-3 text-gray-500 border-r h-10 flex items-center">{item.icon}</span>
                                    <input
                                        type="text"
                                        name={item.name}
                                        value={item.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, [item.name]: e.target.value }))}
                                        className="flex-1 p-2 outline-none text-gray-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                   
                    <div className="flex flex-wrap gap-4 my-6">
                        <button
                            onClick={handleSubmit}
                            className="flex items-center font-semibold gap-2 px-6 py-2 rounded-md bg-[#7367f0] text-white cursor-pointer"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            type="button"
                            className="flex items-center font-semibold gap-2 px-6 py-2 rounded-md bg-gray-200 text-gray-600 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <Link
                            href={`/admin/dashboard/profile`}
                            className="flex items-center cursor-pointer font-semibold gap-2 px-6 py-2 rounded-md bg-[#00BDD6] hover:bg-[#00a8bf] text-white"
                        >
                            Back ←
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}