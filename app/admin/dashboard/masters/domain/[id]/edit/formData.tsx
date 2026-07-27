"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiGlobe, FiLock } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { toast } from "sonner";
import SpinnerCircle4 from "@/components/spinner-10";
import { FaRegImage } from "react-icons/fa";

type Domain = {
    id: number;
    domainName: string;
    accessToken: string;
    status: string;
    subscription: number;
    logo: File | string | null;
    addedOn: Date;
    addedBy: number | null;
    updatedOn: Date | null;
    updatedBy: string | null;
    isDeleted: boolean;
    isDeletedOn: Date | null;
    isDeletedBy: string | null;
};


type Props = {
    domain: Domain;
};

export default function EditDomainForm({ domain }: Props) {
    
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        domainName: domain.domainName,
        accessToken: domain.accessToken,
        status: domain.status,
        logo: domain.logo,
        subscription: domain.subscription,
    });

    const [preview, setPreview] = useState<string | null>( typeof domain.logo === "string" ? `/${domain.logo.replace(/\\/g, "/")}`  : null);      

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFormData(prev => ({ ...prev, logo: selectedFile }));
        const imagePreview = URL.createObjectURL(selectedFile);
        setPreview(imagePreview)
    };



    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
         
        try {
            const fd = new FormData();
            fd.append("domainName", formData.domainName)
            fd.append("accessToken", formData.accessToken)
            fd.append("subscription", String(formData.subscription))
            fd.append("status", formData.status)

            if (formData.logo instanceof File) {
                fd.append("logo", formData.logo);
                }

            const res = await fetch(`/api/records/${domain.id}`, {
                method: "PUT",
                credentials: "include",
                body:  fd,
            });

            if (res.ok) {
                 
                router.push(`/admin/dashboard/masters/domain`);
                toast.success("updated successful");
                
            } else {
                toast.error("Failed to update domain");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("A network error occurred");
        }
         
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-6">
            {
                loading && (
                    <SpinnerCircle4 />
                )
            }

            <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:text-left">
                Edit Domain
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Domain Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Domain Name</label>
                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 text-gray-500 flex items-center">
                                <FiGlobe size={20} />
                            </div>
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                name="domainName"
                                value={formData.domainName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-transparent focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Access Token</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 text-gray-500 flex items-center">
                                <FiLock size={20} />
                            </div>

                            {/* Divider */}
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                name="accessToken"
                                value={formData.accessToken}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-transparent focus:outline-none"
                            />

                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Domain Logo</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 text-gray-500 flex items-center">
                                <FaRegImage size={20} />
                            </div>

                            {/* Divider */}
                            <div className="h-10 w-px bg-gray-300" />
                            <img  src={preview || '/mars_logo.png'} onError={(e)=> {e.currentTarget.src = '/mars_logo.png'}} alt="logo"className="h-32 w-36 md:h-40 md:w-36" />
                        </div>
                        <input type="file" name="logo" accept="image/*" onChange={onChangeFile} />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500">Status</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Active"
                                    checked={formData.status === "Active"}
                                    onChange={handleChange}
                                    className="accent-[#7367f0]"
                                />
                                Active
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Blocked"
                                    checked={formData.status === "Blocked"}
                                    onChange={handleChange}
                                    className="accent-red-600"
                                />
                                Blocked
                            </label>
                        </div>
                    </div>
                    
                    {/* Subscription */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Subscription</label>

                        <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
                            <div className="px-3 text-gray-500 flex items-center">
                                <FiLock size={20} />
                            </div>

                            {/* Divider */}
                            <div className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                name="subscription"
                                value={formData.subscription}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-transparent focus:outline-none"
                            />
                            
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-start gap-2 ">
                    <button
                        type="submit"
                        className="bg-[#7367f0] text-white px-6 py-2 cursor-pointer rounded-sm hover:bg-[#4f43cf] transition"
                    >
                        Update Domain
                    </button>
                    <Link
                        href="/admin/dashboard/masters/domain"
                        className="inline-flex bg-[#00bad1] text-white justify-center  gap-0.5 items-center  px-6 py-2 rounded-sm  transition"
                    >
                        Go Back
                        <IoIosArrowRoundBack />
                    </Link>
                </div>
            </form>
        </div>
    );
}
