"use client"
import { useState } from "react";
import {
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectValue,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
} from "@/components/ui/multi-select";

import {
    FiUser,
    FiMail,
    FiLock,
    FiPhone,
    FiImage,
    FiCalendar,
    FiHash,
} from "react-icons/fi";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcherSwr";

interface AddUserProps {
    open: boolean;
    onClose: () => void;
}

export function AddUser({ open, onClose }: AddUserProps) {

    const [form, setForm] = useState({
        roleId: "12",
        name: "",
        password: "",
        email: "",
        userName: "",
        mobile_no: "",
        image: null as File | null,
        status: "Active",
        domains: [] as string[],
        joining_date: "",
        emailTriggerOption: "Yes"
    });

    const { data, error, isLoading } = useSWR("/api/admin/drop-down-domain", fetcher);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm(prev => ({ ...prev, image: file }));
    };

    const submitUser = async (closeAfterSubmit: boolean) => {

        const formData = new FormData();

        formData.append("roleId", form.roleId);
        formData.append("name", form.name);
        formData.append("password", form.password);
        formData.append("email", form.email);
        formData.append("userName", form.userName);
        formData.append("mobile_no", form.mobile_no);
        formData.append("status", form.status);
        formData.append("emailTriggerOption", form.emailTriggerOption);
        formData.append("joining_date", form.joining_date);
        formData.append("domains", form.domains[0] || "");

        if (form.image) {
            formData.append("image", form.image);
        }

        try {
            const res = await fetch("/api/admin/user-management/add-user", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Something went wrong!");
                return;
            }

            toast.success(data.message || "User created successfully!");
            mutate(`/api/admin/user-management/add-user`);
            mutate(`/api/admin/drop-down-domain`);

            setForm({
                roleId: "",
                name: "",
                password: "",
                email: "",
                userName: "",
                mobile_no: "",
                image: null,
                status: "Active",
                domains: [],
                joining_date: "",
                emailTriggerOption: "Yes"
            });

            if (closeAfterSubmit) {
                onClose();
            }

        } catch (error) {
            toast.error("Network error. Please try again.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitUser(true);
    };

    const multiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitUser(false);
    };


    return (
        <div className="fixed inset-0 z-50 flex pointer-events-none">
         
            <div
                className={`fixed inset-0 bg-black/40 transition-opacity duration-300
                    ${open ? "opacity-100 pointer-events-auto" : "opacity-0"}
                `}
                onClick={onClose}
            ></div>

           
            <div
                className={`ml-auto w-full max-w-[580px] bg-white overflow-y-auto max-h-screen transition-transform duration-300 transform pointer-events-auto
                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="border-b-2 border-gray-300 relative mb-4">
                    <button
                        onClick={onClose}
                        className="absolute right-2 cursor-pointer text-gray-400 hover:text-gray-800 text-xl font-bold"
                    >
                        ✕
                    </button>
                    <h2 className="text-xl font-semibold mx-6 my-6 text-gray-500">Add New User</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">

             
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Role ID</label>
                        <div className="flex items-center border rounded">
                            <span className="px-3 text-gray-400"><FiHash /></span>
                            <span className="h-10 w-px bg-gray-300" />
                            <input
                                type="number"
                                name="roleId"
                                value={form.roleId}
                                onChange={handleChange}
                                placeholder="Enter role ID"
                                className="flex-1 p-2 border-none focus:outline-none"
                                required
                            />
                        </div>
                    </div>

            
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Name</label>
                        <div className="flex items-center border rounded">
                            <span className="px-3 text-gray-400"><FiUser /></span>
                            <span className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                className="flex-1 p-2 border-none focus:outline-none"
                                required
                            />
                        </div>
                    </div>

            
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Username</label>
                        <div className="flex items-center border rounded">
                            <span className="px-3 text-gray-400"><FiUser /></span>
                            <span className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                name="userName"
                                value={form.userName}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="flex-1 p-2 border-none focus:outline-none"
                                required
                            />
                        </div>
                    </div>

        
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Email</label>
                        <div className="flex items-center border rounded">
                            <span className="px-3 text-gray-400"><FiMail /></span>
                            <span className="h-10 w-px bg-gray-300" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className="flex-1 p-2 border-none focus:outline-none"
                                required
                            />
                        </div>
                    </div>

               
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Wants to trigger email notification for this profile?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="emailTriggerOption"
                                    value="Yes"
                                    checked={form.emailTriggerOption === "Yes"}
                                    onChange={handleChange}
                                    className="accent-purple-600 cursor-pointer"
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="emailTriggerOption"
                                    value="No"
                                    checked={form.emailTriggerOption === "No"}
                                    onChange={handleChange}
                                    className="accent-red-600 cursor-pointer"
                                />
                                No
                            </label>
                        </div>
                    </div>

             
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Password</label>
                        <div className="flex items-center border rounded">
                            <span className="px-3 text-gray-400"><FiLock /></span>
                            <span className="h-10 w-px bg-gray-300" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="flex-1 p-2 border-none focus:outline-none"
                                required
                            />
                        </div>
                    </div>

             
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Mobile No</label>
                        <div className="flex items-center border rounded">
                            <span className="px-3 text-gray-400"><FiPhone /></span>
                            <span className="h-10 w-px bg-gray-300" />
                            <input
                                type="text"
                                name="mobile_no"
                                value={form.mobile_no}
                                onChange={handleChange}
                                placeholder="Enter mobile number"
                                className="flex-1 p-2 border-none focus:outline-none"
                            />
                        </div>
                    </div>

                
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">User Image</label>
                        <div className="flex items-center border rounded px-3 py-2">
                            <FiImage className="text-gray-400 mr-2" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="flex-1 focus:outline-none"
                            />
                        </div>
                    </div>

              
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Joining Date</label>
                        <div className="flex items-center border rounded">
                            <span className="px-3 text-gray-400"><FiCalendar /></span>
                            <span className="h-10 w-px bg-gray-300" />
                            <input
                                type="date"
                                name="joining_date"
                                value={form.joining_date}
                                onChange={handleChange}
                                className="flex-1 p-2 border-none focus:outline-none"
                                required
                            />
                        </div>
                    </div>

          
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Status</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Active"
                                    checked={form.status === "Active"}
                                    onChange={handleChange}
                                    className="accent-purple-600 cursor-pointer"
                                />
                                Active
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Blocked"
                                    checked={form.status === "Blocked"}
                                    onChange={handleChange}
                                    className="accent-red-600 cursor-pointer"
                                />
                                Blocked
                            </label>
                        </div>
                    </div>



        
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1">Select Domains</label>
                        <MultiSelect
                            values={form.domains}
                            onValuesChange={(v: string[]) => setForm(prev => ({ ...prev, domains: v }))}
                            single
                        >
                            <MultiSelectTrigger className="w-full">
                                <MultiSelectValue placeholder="Select domains..." />
                            </MultiSelectTrigger>
                            <MultiSelectContent>
                                <MultiSelectGroup>
                                    {data?.unassignedDomains.map((domain: { id: number; domainName: string }) => (
                                        <MultiSelectItem key={domain.id} value={String(domain.id)}>
                                            {domain.domainName}
                                        </MultiSelectItem>
                                    ))}
                                </MultiSelectGroup>
                            </MultiSelectContent>
                        </MultiSelect>
                    </div>

          
                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-[#7367f0] font-semibold text-white py-2 rounded cursor-pointer transition-colors"
                        >
                            Create User
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1  py-2 rounded  border border-black transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={multiSubmit}
                            className="flex-1   bg-[#00bad1] font-semibold text-white py-2 rounded cursor-pointer transition-colors"
                        >
                            Save And Create
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
