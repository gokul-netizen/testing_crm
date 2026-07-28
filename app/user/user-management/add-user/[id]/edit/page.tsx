"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiGlobe, FiKey, FiLock, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { toast } from "sonner";
import { FaRegImage } from "react-icons/fa";
import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";

 

export default function Page() {

      const router = useRouter();
    const params = useParams();
    const { id } = params;

  const { data, error, isLoading } = useSWR(`/api/user/user-management/${id}`,fetcher);



  const [form, setForm] = useState({
    id: 0,
    role_id: 0,
    name: "",
    email: "",
    username: "",
    mobile_no: "",
    status: "Active",
    joining_date: "",
    user_image: "" as string | File,
    domains: [] as string[],
    emailTriggerOption : "Yes"
  });
 
  const [preview, setPreview] = useState(`/${form.user_image}`);


useEffect(() => {
  if (!data) return;

  const user = data;  
 

  setForm({
    id: user.id,
    role_id: user.role_id,
    name: user.name,
    email: user.email,
    username: user.username,
    mobile_no: user.mobile_no ?? "",
    status: user.status,
    joining_date: user.joining_date
      ? user.joining_date.split("T")[0]
      : "",
    user_image: user.user_image ?? "",
    emailTriggerOption: user.emailTriggerOption ?? "Yes",
    domains: user.inquiryDomain
      ? [user.inquiryDomain.domainName]
      : [],
  });

  if (user.user_image) {
    setPreview(`/${user.user_image}`);
  }
}, [data]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = params.id;

    const formData = new FormData();

    formData.append("roldId", form.role_id.toString());
    formData.append("name", form.name);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("mobile_no", form.mobile_no);
    formData.append("joining_date", form.joining_date);
    formData.append("status", form.status);
    formData.append("emailTriggerOption", form.emailTriggerOption);
    form.domains.forEach((domain) => {
      formData.append("domains", domain);
    });

    if (form.user_image) {
      formData.append("user_image", form.user_image);
    }

    const res = await fetch(`/api/user/user-management/${id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    
    if (res.ok) {
      toast.success("successfully updated");
      router.push(`/user/user-management/add-user`)
    }
    else {
      toast.error("Something went wrong");
    }
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectFile = e.target.files?.[0];
    if (!selectFile) return;
    setForm(prev => ({ ...prev, user_image: selectFile }));
    const imagePreview = URL.createObjectURL(selectFile);
    setPreview(imagePreview);

  }

  

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-xl text-gray-600 font-medium mb-6 text-center lg:text-left">
        Edit User
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Role Id */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Role Id</label>
            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
              <div className="px-3 text-gray-500 flex items-center">
                <FiGlobe size={20} />
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <input
                name="roldId"
                type="number"
                value={form.role_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Full Name</label>
            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
              <div className="px-3 text-gray-500 flex items-center">
                <FiKey size={20} />
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">User Name</label>
            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
              <div className="px-3 text-gray-500 flex items-center">
                <FiLock size={20} />
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Email</label>
            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
              <div className="px-3 text-gray-500 flex items-center">
                <FiMail size={20} />
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>


          {/* Email Ration buttons */}
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

          {/* Mobile No */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Mobile No</label>
            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
              <div className="px-3 text-gray-500 flex items-center">
                <FiPhone size={20} />
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <input
                type="text"
                name="mobile_no"
                value={form.mobile_no}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Joining Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Joining Date</label>
            <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
              <div className="px-3 text-gray-500 flex items-center">
                <FiCalendar size={20} />
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <input
                type="date"
                name="joining_date"
                value={form.joining_date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent focus:outline-none"
              />
            </div>
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
                  checked={form.status === "Active"}
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
                  checked={form.status === "Blocked"}
                  onChange={handleChange}
                  className="accent-red-600"
                />
                Blocked
              </label>
            </div>
          </div>
        </div>

        {/* user image */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">User Image</label>
          <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50">
            <div className="px-3 text-gray-500 flex items-center">
              <FaRegImage size={20} />
            </div>
            <div className="h-10 w-px bg-gray-300" />
            <img src={preview} alt="user_image" className="h-32 w-36 md:h-40 md:w-36" />
          </div>
          <input type="file" accept="image/*" name="user_image" onChange={onChangeImage} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-start gap-2">
          <button
            type="submit"
            className="bg-[#7367f0] text-white px-6 py-2 cursor-pointer rounded-sm hover:bg-[#4f43cf] transition"
          >
            Update User
          </button>
          <Link
            href={`/user/user-management/add-user`}
            className="inline-flex bg-[#00bad1] text-white justify-center gap-0.5 items-center px-6 py-2 rounded-sm transition"
          >
            Go Back
            <IoIosArrowRoundBack />
          </Link>
        </div>
      </form>
    </div>
  );
}
