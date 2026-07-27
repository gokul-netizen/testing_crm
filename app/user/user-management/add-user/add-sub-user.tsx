'use client';

import SliderPanel from "@/app/components/SideSlider";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiImage,
  FiCalendar,
  FiHash
} from "react-icons/fi";
import DomainList from "./domain-list";

interface AddSubUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSubUserForm({ isOpen, onClose, onSuccess }: AddSubUserFormProps) {

 

  const [form, setForm] = useState({
    roleId: "12",
    name: "",
    userName: "",
    email: "",
    emailTriggerOption: "Yes",
    password: "",
    mobile_no: "",
    joining_date: "",
    status: "Active",
    image: null as File | null
  });

  const [domains, setDomains] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
  };

  const submitSubUser = async (closeAfterSubmit: boolean) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!form.name.trim()) {
      toast.error("Please fill Name");
      return false;
    }
    if (!form.userName.trim()) {
      toast.error("Please fill User Name ");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Please fill Email ");
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!form.password.trim()) {
      toast.error("Please fill Password ");
      return false;
    }

    if (!form.mobile_no.trim()) {
      toast.error("Please fill Password ");
      return false;
    }

    if (!form.joining_date.trim()) {
      toast.error("Please fill Joining Date ");
      return false;
    }

    if (!domains) {
      toast.error("Please select at least one domain");
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("roleId", form.roleId);
      formData.append("name", form.name.trim());
      formData.append("username", form.userName.trim());
      formData.append("email", form.email.trim());
      formData.append("emailTriggerOption", form.emailTriggerOption);
      formData.append("password", form.password);
      formData.append("mobile_no", form.mobile_no.trim());
      formData.append("joining_date", form.joining_date);
      formData.append("status", form.status);
      formData.append("domains", String(domains));

      if (form.image) formData.append("image", form.image);

      const res = await fetch(`/api/user/user-management`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create sub-user");
        return false;
      }

      toast.success(data.message || "Sub-user created successfully!");

      mutate(`/api/user/user-management`);

      setForm({
        roleId: "12",
        name: "",
        userName: "",
        email: "",
        password: "",
        mobile_no: "",
        joining_date: "",
        status: "Active",
        emailTriggerOption: "Yes",
        image: null
      });
      setDomains(null);

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error");
      return false;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitSubUser(true);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMultiLoading(true);
    try {
      await submitSubUser(false);
    } finally {
      setMultiLoading(false);
    }
  };

  const handdeCancel = () => {
    onClose();
    setForm({
      roleId: "12",
      name: "",
      userName: "",
      email: "",
      password: "",
      mobile_no: "",
      joining_date: "",
      status: "Active",
      image: null,
      emailTriggerOption: "Yes"
    });
    setDomains(null);
  }

  return (
    <SliderPanel isOpen={isOpen} onClose={onClose} title="Add New Sub User" maxWidth="max-w-xl">
      <form className="space-y-4 px-2 py-4">

        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Role ID</label>
          <div className="flex items-center border rounded">
            <span className="px-3 text-gray-400"><FiHash /></span>
            <span className="h-10 w-px bg-gray-300" />
            <input type="number" name="roleId" value={form.roleId} onChange={handleChange} className="flex-1 p-2 border-none focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Name</label>
          <div className="flex items-center border rounded">
            <span className="px-3 text-gray-400"><FiUser /></span>
            <span className="h-10 w-px bg-gray-300" />
            <input placeholder="Enter Name..." type="text" name="name" value={form.name} onChange={handleChange} className="flex-1 p-2 border-none focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Username</label>
          <div className="flex items-center border rounded">
            <span className="px-3 text-gray-400"><FiUser /></span>
            <span className="h-10 w-px bg-gray-300" />
            <input placeholder="Enter Username..." type="text" name="userName" value={form.userName} onChange={handleChange} className="flex-1 p-2 border-none focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Email</label>
          <div className="flex items-center border rounded">
            <span className="px-3 text-gray-400"><FiMail /></span>
            <span className="h-10 w-px bg-gray-300" />
            <input placeholder="Enter Email..." type="email" name="email" value={form.email} onChange={handleChange} className="flex-1 p-2 border-none focus:outline-none" />
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
            <input placeholder="Enter Password..." type="password" name="password" value={form.password} onChange={handleChange} className="flex-1 p-2 border-none focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Mobile No</label>
          <div className="flex items-center border rounded">
            <span className="px-3 text-gray-400"><FiPhone /></span>
            <span className="h-10 w-px bg-gray-300" />
            <input placeholder="Enter Mobile..." type="number" name="mobile_no" value={form.mobile_no} onChange={handleChange} className="flex-1 p-2 border-none focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Joining Date</label>
          <div className="flex items-center border rounded">
            <span className="px-3 text-gray-400"><FiCalendar /></span>
            <span className="h-10 w-px bg-gray-300" />
            <input type="date" name="joining_date" value={form.joining_date} onChange={handleChange} className="flex-1 p-2 border-none focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Profile Image</label>
          <div className="flex items-center border rounded px-3 py-2">
            <FiImage className="text-gray-400 mr-2" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
          </div>
        </div>


        <div>
          <label className="block text-gray-500 text-sm font-medium mb-1">Status</label>
          <div className="flex gap-4">
            <label>
              <input type="radio" name="status" value="Active" checked={form.status === "Active"} onChange={handleChange} className="accent-purple-600" />
              Active
            </label>
            <label>
              <input type="radio" name="status" value="Blocked" checked={form.status === "Blocked"} onChange={handleChange} className="accent-red-600" />
              Blocked
            </label>
          </div>
        </div>


        <DomainList  value={domains} onChange={setDomains} />

      
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={loading} className="flex-1 bg-[#7367f0] font-semibold text-white py-2 rounded cursor-pointer transition-colors">
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={handdeCancel} className="flex-1  py-2 rounded  border border-black transition-colors cursor-pointer">
            Cancel
          </button>

          <button onClick={handleSaveAndAdd} disabled={multiLoading} className="flex-1   bg-[#00bad1] font-semibold text-white py-2 rounded cursor-pointer transition-colors">
            {multiLoading ? "Saving..." : "Save And Create"}
          </button>

        </div>

      </form>
    </SliderPanel>
  );
}