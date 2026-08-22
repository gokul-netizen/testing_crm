'use client'

import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue
} from "@/components/ui/multi-select";
import { IoMdTime } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { TiMessages } from "react-icons/ti";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);


type Props = {
  open: boolean;
  onClose: () => void;
  domainId: number;

};

export default function RightSideDrawerInquiry({ open, onClose, domainId }: Props) {

  const [loading, setLoading] = useState(false);
  const [multiLoading, multiSetLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);           
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [source, setSource] = useState<string[]>([]);
  const [followUp, setFollowUp] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [remarks, setRemarks] = useState('');


  const formatToDMY = (dateStr: any) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

 

   
  const { data } = useSWR(`/api/admin/master/source`, fetcher);

  const followUpStatus = ["Follow Up", "Not Interested", "Assisgn To", "Closed"];

  const sourcehandling = (newValues: string[]) => {
    if (newValues.length > 1) {
      toast.error("You cannot select more than one source");
      return;
    }
    setSource(newValues);
  }

  const followUphandling = (newValues: string[]) => {
    if (newValues.length > 1) {
      toast.error("You cannot select more than one source");
      return;
    }
    setFollowUp(newValues);
  }

  const handleCancel = () => {
    onClose();
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {


      if (!name && !email && !phone && !messageText && source.length === 0 && followUp.length === 0) {
        return toast.error("Please fill the form");
      }


      if (!email.trim() && !phone.trim()) {
        return toast.error("Either Email or Phone must be provided");
      }

      if (name.trim() && !messageText.trim()) {
        return toast.error("Message is required");
      }


      if (source.length === 0) {
        return toast.error("Please select a source");
      }


      if (followUp.length === 0) {
        return toast.error("Please select follow up");
      }


      const isFollow = followUp.includes("Follow Up");
      if (isFollow && (!date || !time || !remarks.trim())) {
        return toast.error("Date, Time and Remarks are required for Follow Up");
      }

      const payLoad: any = {
        "Name": name,
        "E-Mail": email,
        "Phone": phone,
        "Message": messageText,
        "Source": source,
        "Follow Up": followUp,
      }

      const isFollowUP = Array.isArray(followUp) ? followUp.includes("Follow Up") : followUp === "Follow Up";

      if (isFollowUP) {
        payLoad["Date"] = formatToDMY(date);
        payLoad["Time"] = dayjs(time, "HH:mm").format("h:mm A");
        payLoad["Remarks"] = remarks;
      }


      const res = await fetch(`/api/create-post/${domainId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad)
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Saved Successfully");
        mutate(`/api/days/${domainId}`);
        onClose();
        setMessage(null);
        setName('');
        setPhone('');
        setEmail('');
        setMessageText('');
        setSource([]);
        setFollowUp([]);
        setDate('');
        setTime('');
        setRemarks('');


      } else {
        setMessage({
          text: json.message || json.error || "Something went wrong",
          error: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMutliSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    multiSetLoading(true);

    try {
      if (!name && !email && !phone && !messageText && source.length === 0 && followUp.length === 0) {
        return toast.error("Please fill the form");
      }

      if (!email.trim() && !phone.trim()) {
        return toast.error("Either Email or Phone must be provided");
      }


      if (name.trim() && !messageText.trim()) {
        return toast.error("Message is required");
      }

      if (source.length === 0) {
        return toast.error("Please select a source");
      }

      if (followUp.length === 0) {
        return toast.error("Please select follow up");
      }


      const isFollow = followUp.includes("Follow Up");
      if (isFollow && (!date || !time || !remarks.trim())) {
        return toast.error("Date, Time and Remarks are required for Follow Up");
      }

      const payLoad: any = {
        "Name": name,
        "E-Mail": email,
        "Phone": phone,
        "Message": messageText,
        "Source": source,
        "Follow Up": followUp,
      }

      const isFollowUP = Array.isArray(followUp) ? followUp.includes("Follow Up") : followUp === "Follow Up";

      if (isFollowUP) {
        payLoad["Date"] = formatToDMY(date);
        payLoad["Time"] = dayjs(time, "HH:mm").format("h:mm A");
        payLoad["Remarks"] = remarks;
      }

      const res = await fetch(`/api/create-post/${domainId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad)
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Saved Successfully");
        mutate(`/api/days/${domainId}`);
        setMessage(null);
        setName('');
        setPhone('');
        setEmail('');
        setMessageText('');
        setSource([]);
        setFollowUp([]);
        setDate('');
        setTime('');
        setRemarks('');

      } else {
        setMessage({
          text: json.message || json.error || "Something went wrong",
          error: true
        });
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

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] md:w-[620px] bg-white z-50 transform transition-transform duration-300
            ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >

        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-600">Add New Record</h2>
          <IoClose size={28} className="cursor-pointer text-gray-400" onClick={onClose} />
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <form className="flex flex-col space-y-2">

            {/* Name */}
            <div>
              <label className="text-sm text-gray-500 font-medium">Name</label>
              <div className="flex items-center border rounded-md h-10">
                <span className="px-3 text-gray-400"><FiUser /></span>
                <span className="h-full w-px bg-gray-300" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-full px-3 outline-none"
                  placeholder="Enter Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-500 font-medium">Email</label>
              <div className="flex items-center border rounded-md h-10">
                <span className="px-3 text-gray-400"><FiMail /></span>
                <span className="h-full w-px bg-gray-300" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full px-3 outline-none"
                  placeholder="Enter Email"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="text-sm text-gray-500 font-medium">Contact</label>
              <div className="flex items-center border rounded-md h-10">
                <span className="px-3 text-gray-400"><FiPhone /></span>
                <span className="h-full w-px bg-gray-300" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-full px-3 outline-none"
                  placeholder="Enter Contact"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-gray-500 font-medium">Message</label>
              <div className="flex border rounded-md">
                <span className="px-3 pt-2 text-gray-400"><FiMessageSquare /></span>
                <span className="h-full w-px bg-gray-300" />
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-3 py-2 outline-none resize-none h-28"
                  placeholder="Enter message"
                />
              </div>
            </div>

            {/* Multi Select */}
            <div>
              <label className="text-sm text-gray-500 font-medium">Select Source</label>
              <MultiSelect values={source} onValuesChange={sourcehandling} single>
                <MultiSelectTrigger className="w-full">
                  <MultiSelectValue placeholder="Select Source..." />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {data?.map((item: any, index: number) => (
                      <MultiSelectItem key={index} value={item.source}>
                        {item.source}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            </div>

            {/* follow up status */}
            <div>
              <label className="text-sm text-gray-500 font-medium">Follow Up</label>
              <MultiSelect values={followUp} onValuesChange={followUphandling} single>
                <MultiSelectTrigger className="w-full">
                  <MultiSelectValue placeholder="Follow Up..." />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {followUpStatus?.map((item: any, index: number) => (
                      <MultiSelectItem key={index} value={item}>
                        {item}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            </div>

            {
              followUp.includes("Follow Up") && (
                <div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">Date</label>
                    <div className="flex items-center border rounded-md h-10">
                      <span className="px-3 text-gray-400"><CiCalendarDate /></span>
                      <span className="h-full w-px bg-gray-300" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-full px-3 outline-none"
                        placeholder="Enter Date"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">Time</label>
                    <div className="flex items-center border rounded-md h-10">
                      <span className="px-3 text-gray-400"><IoMdTime /></span>
                      <span className="h-full w-px bg-gray-300" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full h-full px-3 outline-none"
                        placeholder="hrs:mins"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-medium">Remarks</label>
                    <div className="flex border rounded-md">
                      <span className="px-3 pt-2 text-gray-400"><TiMessages /></span>
                      <span className="h-full w-px bg-gray-300" />
                      <textarea
                        className="w-full px-3 py-2 outline-none resize-none h-28"
                        placeholder="Enter Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )
            }
            

            {/* Message Display */}
            {message && (
              <p className={`text-sm ${message.error ? "text-red-600" : "text-green-600"}`}>
                {message.text}
              </p>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#7367f0] text-white py-2 rounded-md font-semibold cursor-pointer"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-400 text-gray-500 py-2 rounded-md font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleMutliSubmit}
                className="bg-[#00bad1] text-white py-2 rounded-md font-semibold cursor-pointer"
              >
                {multiLoading ? "Saving..." : "Save & Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
