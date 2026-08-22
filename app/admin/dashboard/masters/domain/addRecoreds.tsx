'use client'

import { IoClose } from "react-icons/io5";
import { useRef, useState } from "react";
import { FiGlobe, FiImage } from "react-icons/fi";
import { toast } from "sonner";
import { mutate } from "swr";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function RightSideDrawer({ open, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [multiLoading, multiSetLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [domainName, setDomainName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [status, setStatus] = useState("Active");


    const handleCancel = () => {
        onClose();
        setDomainName('');
        setLogo(null);
        setMessage(null);
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("domainName", domainName);
        formData.append("status", status);
        if (logo) formData.append("logo", logo);

        try {
            const res = await fetch("/api/admin/master/domain", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (res.ok) {
                toast.success("Saved Successfully");
                mutate("/api/admin/master/domain");
                onClose();
                setDomainName("");
                setLogo(null);
                setStatus("Active");
                if (fileRef.current) fileRef.current.value = "";
            } else {
                setMessage({ text: json.message, isError: true });
            }
        } finally {
            setLoading(false);

        }
    };

    const handleMutliSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        multiSetLoading(true);

        const formData = new FormData();
        formData.append("domainName", domainName);
        formData.append("status", status);
        if (logo) formData.append("logo", logo);

        try {
            const res = await fetch("/api/admin/master/domain", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (res.ok) {
                toast.success("Saved Successfully");
                mutate("/api/admin/master/domain");
                setDomainName("");
                setLogo(null);
                setStatus("Active");
                setMessage(null);
                if (fileRef.current) fileRef.current.value = "";

            } else {
                setMessage({ text: json.message, isError: true });
            }
        } finally {
            multiSetLoading(false);

        }
    };

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={onClose}
                />
            )}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[580px] space-y-8 bg-white z-50 transform transition-transform duration-300
                            ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Title */}
                <div className="flex justify-between items-center ml-10 md:ml-0 border-b-2 border-gray-200 ">
                    <h2 className="text-xl font-semibold mx-6 my-6 text-gray-500" >
                        Add New Domain
                    </h2>
                    <IoClose size={30} className="cursor-pointer mx-6 text-gray-400" onClick={onClose} />
                </div>

                <div className="my-6 mx-5 flex flex-col h-full">
                    <form className="flex flex-col h-full px-10 lg:px-0"  >
                        <div className="flex-1 space-y-4">
                            {/* Domain Field */}
                            <div>
                                <label className="block text-gray-500 text-sm font-medium mb-1">Domain</label>
                                <div className="relative flex items-center border rounded-sm">
                                    <span className="px-3 text-gray-400 flex items-center">
                                        <FiGlobe />
                                    </span>
                                    <span className="h-10 w-px bg-gray-300" />
                                    <input
                                        required
                                        type="text"
                                        name="domainName"
                                        value={domainName}
                                        onChange={(e) => setDomainName(e.target.value)}
                                        placeholder="Enter domain"
                                        className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-r-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-500 text-sm font-medium mb-1">Logo</label>
                                <div className="relative flex items-center border rounded-sm transition-all focus-within:ring-2 focus-within:ring-purple-500">
                                    <span className="px-3 text-gray-400 flex items-center">
                                        <FiImage />
                                    </span>
                                    <span className="h-10 w-px bg-gray-300" />
                                    <input
                                        required
                                        type="file"
                                        name="logo"
                                        ref={fileRef}
                                        accept="image/*"
                                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                                        className="w-full px-3 py-2 focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Status Field */}
                            <div>
                                <label className="block text-gray-500 text-sm font-medium my-2">Status</label>
                                <div className="flex gap-5 flex-col md:flex-row">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="status" value="Active" checked={status === "Active"} onChange={() => setStatus("Active")} className="accent-purple-600 w-4 h-5 cursor-pointer" />
                                        Active
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="status" value="Blocked" checked={status === "Blocked"} onChange={() => setStatus("Blocked")} className="accent-red-600 w-4 h-5 cursor-pointer" />
                                        Blocked
                                    </label>
                                </div>

                                {/* Response Message */}
                                {message && (
                                    <p className={`text-sm mt-4 ${message.isError ? "text-red-600" : "text-green-600"}`}>
                                        {message.text}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className={`py-2 rounded-sm cursor-pointer font-semibold text-white ${loading ? "bg-gray-400" : "bg-[#7367f0] hover:bg-[#7a2d99]"}`}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="border border-gray-500 text-gray-500 py-2 rounded-sm font-semibold cursor-pointer"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="border py-2 rounded-sm text-white font-semibold cursor-pointer bg-[#00bad1]"
                                    onClick={handleMutliSubmit}
                                >
                                    {multiLoading ? "Saving..." : "Save And Create"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}