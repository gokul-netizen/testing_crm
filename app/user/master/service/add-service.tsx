'use client'
import { IoClose } from "react-icons/io5";
import { useState, useCallback } from "react";
import { FiGlobe } from "react-icons/fi";
import { toast } from "sonner";
import { mutate } from "swr";
import DomainList from "@/app/components/DomainList";

type Domain = {
    id: number;
    domainName: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
   
};

export default function RightSideDrawerservice({ open, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [multiLoading, multiSetLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
    const [service, setService] = useState("");
    const [status, setStatus] = useState("Active");
    const [selectedDomains, setSelectedDomains] = useState<number[]>([]);
    const [domain , setDomain] = useState<number | null>(null);

    
    const handleDomainDataLoaded = useCallback((domains: Domain[]) => {
        if (domains.length === 1) {
            setSelectedDomains([domains[0].id]);
        }
    }, []);

    const handleCancel = () => {
        onClose();
        setService('');
        setMessage(null);
    };

    const serviceSubmit = async () => {
        try {
            const domainId = selectedDomains[0];

            if (!service) {
                toast.error("Service Name Is Required");
                return false;
            }

            const res = await fetch(`/api/user/service`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service, status, domainId: Number(domainId) })
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("Saved Successfully");
                mutate(`/api/user/service`);
                return true;
            } else {
                setMessage({
                    text: json.message || json.error || "Something went wrong",
                    error: true
                });
                return false;
            }
        } catch (error) {
            toast.error("Something went wrong..!");
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await serviceSubmit();
            if (success) {
                onClose();
                setService("");
                setStatus("Active");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMutliSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        multiSetLoading(true);
        try {
            const success = await serviceSubmit();
            if (success) {
                setService("");
                setStatus("Active");
                setMessage(null);
            }
        } finally {
            multiSetLoading(false);
        }
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
            )}
            <div
                className={`fixed top-0 right-0 h-full w-105 bg-white z-50 transform transition-transform duration-300
                            ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center ml-10 md:ml-0 border-b-2 border-gray-200">
                    <h2 className="text-xl font-semibold mx-6 my-6 text-gray-500">
                        Add New Service
                    </h2>
                    <IoClose size={30} className="cursor-pointer mx-6 text-gray-400" onClick={onClose} />
                </div>
                <div className="my-6 mx-5  flex flex-col h-full">
                    <form className="flex flex-col h-full px-10 lg:px-0">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-gray-500 text-sm font-medium mb-1">Service</label>
                                <div className="relative flex items-center border rounded-sm">
                                    <span className="px-3 text-gray-400 flex items-center">
                                        <FiGlobe />
                                    </span>
                                    <span className="h-10 w-px bg-gray-300" />
                                    <input
                                        required
                                        type="text"
                                        name="domainName"
                                        value={service}
                                        onChange={(e) => setService(e.target.value)}
                                        placeholder="Enter service"
                                        className="w-full px-3 py-2   focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-r-sm "
                                    />
                                </div>
                            </div>

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
                                {message && (
                                    <p className={`text-sm mt-4 ${message.error ? "text-red-600" : "text-green-600"}`}>
                                        {message.text}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className={`py-2 rounded-sm cursor-pointer font-semibold text-white ${loading ? "bg-gray-400" : "bg-[#7367f0] hover:bg-[#7a2d99]"}`}
                                >
                                    {loading ? "Submitting..." : "Submit"}
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
                                    {multiLoading ? "Submitting..." : "Multi Submit"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}