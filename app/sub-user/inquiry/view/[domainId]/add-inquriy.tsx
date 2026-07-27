'use client';

import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import { toast } from "sonner";
import { mutate } from "swr";
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
import dayjs, { Dayjs } from "dayjs";
import { useParams } from "next/navigation";
 
import SourceDropDown from "@/app/components/SourceDropDown";
import { FaRegBuilding } from "react-icons/fa";
 
import { confirmAction } from "@/app/components/ConfirmSooner";
import TimePickerDemo from "@/app/components/Time";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AssignToDropDown from "./assignNames";
import SerivceDropDown from "./service";

dayjs.extend(utc);
dayjs.extend(timezone);


dayjs.extend(customParseFormat);

type Props = {
    open: boolean;
    onClose: () => void;

};

export default function Inquiry({ open, onClose }: Props) {

    const [loading, setLoading] = useState(false);
    const [multiLoading, multiSetLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneSecondary, setPhoneSecondary] = useState("");
    const [messageText, setMessageText] = useState("");
    const [source, setSource] = useState<string[]>([]);
    const [service, setService] = useState<string[]>([]);
    const [assign, setAssign] = useState<{ id: number; name: string; type: string } | null>(null);
    const [followUp, setFollowUp] = useState<string[]>([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('10-00-AM');
    const [remarks, setRemarks] = useState('');
    const [hour, setHour] = useState('10');
    const [minute, setMinute] = useState('00');
    const [ampm, setAmPm] = useState('Am');
    const [isPublic, setIsPublic] = useState(true);
    const [callVisit, setCallVisit] = useState("Call");
    const [reminderTime, setReminderTime] = useState<Dayjs | null>(null);
    const [address, setAddress] = useState("");

    const Remindertime = reminderTime?.toDate().toTimeString().split(" ")[0];
    const reminderDateTime = `${date}T${Remindertime}Z`;

    const params = useParams();
    const { domainId } = params;


    const domainID = Number(domainId)
   

    const formatToDMY = (dateStr: any) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    const followUpStatus = ["Follow Up", "Not Interested", "Assign To", "Closed"];

    const followUpDateAndTimeFormate = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm A");

    const now = dayjs();

    useEffect(() => {
        setTime(`${hour}-${minute}-${ampm}`);
    }, [hour, minute, ampm]);


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

    const validateForm = () => {
        if (!companyName.trim()) {
            toast.error("Company Name is required");
            return false;
        }
        if (!name.trim()) {
            toast.error("Person Name is required");
            return false;
        }

        if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            toast.error("Invalid email format");
            return false;
        }

        if (!phone.trim() && !phoneSecondary.trim()) {
            toast.error("Either Contact 1 or Contact 2 must be provided");
            return false;
        }
        if (source.length === 0) {
            toast.error("Please select a source");
            return false;
        }
        if (service.length === 0) {
            toast.error("Please select a service");
            return false;
        }
        if (!messageText.trim()) {
            toast.error("Requirement is required");
            return false;
        }

        if (followUp.length === 0) {
            toast.error("Please select status");
            return false;
        }

        if (followUp.includes("Assign To") && !assign) {
            toast.error("Please select Assign to");
            return false;
        }

        if (followUp.includes("Follow Up") && (!date || !time)) {
            toast.error("Date and Time are required for Follow Up");
            return false;
        }

        if (callVisit === "Visit" && !reminderTime) {
            toast.error("Reminder time is required for Visit.");
            return;
        }

        if (followUpDateAndTimeFormate.isBefore(now)) {
            toast.error("Can't select past date and time.");
            return;
        }


        if (followUp.includes("Assign To") && (!date || !time)) {
            toast.error("Assign Date and Time are required ");
            return false;
        }

        if (followUpDateAndTimeFormate.isBefore(now)) {
            toast.error("Can't select past date and time.");
            return;
        }

        if (!remarks.trim()) {
            toast.error("Remarks are required");
            return false;
        }
        return true;
    }





    const handSave = async () => {
        try {
            if (!validateForm()) return false;

            const payLoad: any = {
                "Company Name": companyName,
                "Name": name,
                "E-Mail": email,
                "Website": website,
                "Phone ": phone,
                "Secondary Phone Number": phoneSecondary,
                "Source": source,
                "Service": service,
                "Message": messageText,
                "Follow Up": followUp,
                "Remarks": remarks,
                "IsPublic": isPublic,
                "Contact Mode": callVisit,
                "Reminder": reminderTime ? reminderDateTime : null,
                "Address": address
            }

            const isFollowUP = Array.isArray(followUp) ? followUp.includes("Follow Up") : followUp === "Follow Up";
            const isAssign = Array.isArray(followUp) ? followUp.includes("Assign To") : false;


            if (isFollowUP) {
                payLoad["Date"] = formatToDMY(date);
                payLoad["Time"] = dayjs(time, "hh:mm A").format("h:mm A");
                payLoad["Remarks"] = remarks;
            }

            if (isAssign) {

                payLoad["Assign"] = assign?.id;
                payLoad["AssignType"] = assign?.type;
                payLoad["AssignName"] = assign?.name;
                payLoad["Date"] = dayjs(date).format("DD-MM-YYYY");
                payLoad["Time"] = dayjs(time, "hh:mm A").format("h:mm A");
                payLoad["Remarks"] = remarks;

            }

            const res = await fetch(`/api/sub-user/inquiry/view/${domainId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payLoad)
            });

            const json = await res.json();

            if (res.ok) {
                toast.success("Saved Successfully");
                mutate(`/api/sub-user/inquiry/view/${domainId}`);
                return true;
            } else {
                setMessage({
                    text: json.message || json.error || "Something went wrong",
                    error: true
                });
                return false;
            }
        } catch (error) {
            toast.error("Something went wrong.!");
            return false;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {

            const res = await fetch(`/api/user/inquiry/inquiry-exist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone, phoneSecondary })
            });

            const check = await res.json();

            if (check.exist) {
                confirmAction({
                    title: "Inquiry Already Exists",
                    description: `This inquiry already exists. Added On ${dayjs(check.data.createdAt).utc().format("YYYY-MM-DD HH:mm")} And Follow Up Status is ${check.data.FollowUpStatus}`,
                    confirmLabel: "Save Anyway",
                    onConfirm: async () => {
                        const success = await handSave();
                        if (success) {
                            setMessage(null);
                            setName('');
                            setCompanyName("");
                            setPhone('');
                            setPhoneSecondary('');
                            setEmail('');
                            setWebsite('');
                            setMessageText('');
                            setSource([]);
                            setFollowUp([]);
                            setService([]);
                            setDate('');
                            setTime('');
                            setCallVisit("Call");
                            setReminderTime(null)
                            setRemarks('');
                            onClose();
                        }
                    },
                });
            } else {
                const success = await handSave();
                if (success) {
                    setMessage(null);
                    setName('');
                    setCompanyName("");
                    setPhone('');
                    setPhoneSecondary('');
                    setEmail('');
                    setWebsite('');
                    setMessageText('');
                    setSource([]);
                    setFollowUp([]);
                    setService([]);
                    setDate('');
                    setTime('');
                    setCallVisit("Call");
                    setReminderTime(null)
                    setRemarks('');
                    onClose();
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMutliSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        multiSetLoading(true);

        const resetForm = () => {
            setMessage(null);
            setName('');
            setCompanyName("");
            setPhone('');
            setPhoneSecondary('');
            setEmail('');
            setWebsite('');
            setMessageText('');
            setSource([]);
            setFollowUp([]);
            setService([]);
            setDate('');
            setCallVisit("Call");
            setReminderTime(null)
            setTime('');
            setRemarks('');
        };

        try {
            const res = await fetch(`/api/user/inquiry/inquiry-exist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    phone,
                    phoneSecondary,
                }),
            });

            const check = await res.json();

            if (check.exist) {
                confirmAction({
                    title: "Inquiry Already Exists",
                    description: `This inquiry already exists. Added On ${dayjs(
                        check.data.createdAt
                    )
                        .utc()
                        .format(
                            "YYYY-MM-DD HH:mm"
                        )} And Follow Up Status is ${check.data.FollowUpStatus}`,
                    confirmLabel: "Save Anyway",
                    onConfirm: async () => {
                        const success = await handSave();

                        if (success) {
                            resetForm();
                        }
                    },
                });
            } else {
                const success = await handSave();

                if (success) {
                    resetForm();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            multiSetLoading(false);
        }
    };


    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/40 z-40" />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-100 md:w-180 bg-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
            >

                {/* Header */}
                <div className="flex justify-between items-center border-b px-8 md:px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-600">Add New Inquiry</h2>
                    <IoClose size={28} className="cursor-pointer text-gray-400" onClick={onClose} />
                </div>


                <div className="pl-8 md:px-6 py-4 mx-2 flex-1 overflow-y-auto">

                    <form className="flex flex-col space-y-3">


                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm text-gray-500 font-medium">Company Name</label>
                                <div className="flex items-center border rounded-md h-10">
                                    <span className="px-3 text-gray-400"><FaRegBuilding /></span>
                                    <span className="h-full w-px bg-gray-300" />
                                    <input
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full h-full px-3 outline-none"
                                        placeholder="Enter Company Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500 font-medium">Name</label>
                                <div className="flex items-center border rounded-md h-10">
                                    <span className="px-3 text-gray-400"><FiUser /></span>
                                    <span className="h-full w-px bg-gray-300" />
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-full px-3 outline-none"
                                        placeholder="Enter Person Name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email and website*/}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm text-gray-500 font-medium">Email</label>
                                <div className="flex items-center border rounded-md h-10">
                                    <span className="px-3 text-gray-400"><FiMail /></span>
                                    <span className="h-full w-px bg-gray-300" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-full px-3 outline-none"
                                        placeholder="Enter Email"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 font-medium">Website</label>
                                <div className="flex items-center border rounded-md h-10">
                                    <span className="px-3 text-gray-400"><FiMail /></span>
                                    <span className="h-full w-px bg-gray-300" />
                                    <input
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full h-full px-3 outline-none"
                                        placeholder="Enter Website"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Contact1 and Contact2*/}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm text-gray-500 font-medium">Contact 1</label>
                                <div className="flex items-center border rounded-md h-10">
                                    <span className="px-3 text-gray-400"><FiPhone /></span>
                                    <span className="h-full w-px bg-gray-300" />
                                    <input
                                        type="number"
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length <= 10) setPhone(val);
                                        }}
                                        className="w-full h-full px-3 outline-none"
                                        placeholder="Enter Contact 1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 font-medium">Contact 2</label>
                                <div className="flex items-center border rounded-md h-10">
                                    <span className="px-3 text-gray-400"><FiPhone /></span>
                                    <span className="h-full w-px bg-gray-300" />
                                    <input
                                        type="number"
                                        value={phoneSecondary}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length <= 10) setPhoneSecondary(val);
                                        }}
                                        className="w-full h-full px-3 outline-none"
                                        placeholder="Enter Contact 2"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-2">

                            <SourceDropDown value={source} onChange={setSource} />

                            {domainID  && (
                                <SerivceDropDown value={service} onChange={setService} domainId={domainID}  />
                            )}

                        </div>

                        <div>
                            <label className="text-sm text-gray-500 font-medium">Requirment</label>
                            <div className="flex border rounded-md">
                                <span className="px-3 pt-2 text-gray-400"><FiMessageSquare /></span>
                                <span className="h-full w-px bg-gray-300" />
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    className="w-full px-3 py-2 outline-none resize-none h-28"
                                    placeholder="Enter requirment"
                                />
                            </div>
                        </div>

                        {/* follow up status */}
                        <div>
                            <label className="text-sm text-gray-500 font-medium">Status</label>
                            <MultiSelect values={followUp} onValuesChange={followUphandling} single>
                                <MultiSelectTrigger className="w-full">
                                    <MultiSelectValue placeholder="Select Status..." />
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

                        <div>
                            {

                                followUp.includes("Follow Up") && (
                                    <div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500 font-semibold uppercase">Date</label>
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
                                            <div className="flex flex-col gap-1.5 max-w-xs">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Time
                                                </label>

                                                <div className="flex items-center gap-1 group border border-gray-100   p-2 rounded-md">
                                                    <div className="pl-2 pr-1 text-gray-400  transition-colors">
                                                        <IoMdTime />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        min="1" max="12"
                                                        placeholder="10"
                                                        defaultValue={hour}
                                                        onChange={(e) => setHour(e.target.value)}
                                                        className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />

                                                    <span className="text-gray-400 font-bold px-0.5">:</span>
                                                    <input
                                                        type="number"
                                                        min="0" max="59"
                                                        placeholder="00"
                                                        defaultValue={minute}
                                                        onChange={(e) => setMinute(e.target.value)}
                                                        className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />

                                                    <select value={ampm} onChange={(e) => setAmPm(e.target.value)} className="bg-transparent text-sm font-bold text-gray-600  cursor-pointer outline-none px-2 transition-colors">
                                                        <option>AM</option>
                                                        <option>PM</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="my-3">

                                            <div className="flex items-center gap-8">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="callVisit"
                                                        value="Call"
                                                        checked={callVisit === "Call"}
                                                        onChange={(e) => setCallVisit(e.target.value)}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="text-sm font-medium text-gray-600">Call</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="callVisit"
                                                        value="Visit"
                                                        checked={callVisit === "Visit"}
                                                        onChange={(e) => setCallVisit(e.target.value)}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="text-sm font-medium text-gray-600">Visit</span>
                                                </label>
                                            </div>

                                            {callVisit === "Visit" && (
                                                <div className="mt-4 flex flex-col md:flex-row items-start gap-4">
                                                    <div className="w-full md:w-56">
                                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                                            Reminder Time
                                                        </label>

                                                        <TimePickerDemo
                                                            value={reminderTime}
                                                            onChange={(newValue) => setReminderTime(newValue)}
                                                        />
                                                    </div>

                                                    <div className="flex-1 w-full">
                                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                                            Visit Address
                                                        </label>

                                                        <textarea
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                            placeholder="Enter visit address..."
                                                            rows={2}
                                                            className="w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                )

                            }

                            {
                                followUp.includes("Assign To") && (
                                    <div>
                                        <div>

                                            <AssignToDropDown
                                               
                                                domainId={domainID}
                                                value={assign}
                                                onChange={setAssign}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
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
                                            <div className="flex flex-col gap-1.5 max-w-xs">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Time
                                                </label>

                                                <div className="flex items-center gap-1 group border border-gray-100   p-2 rounded-md">
                                                    <div className="pl-2 pr-1 text-gray-400  transition-colors">
                                                        <IoMdTime />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        min="1" max="12"
                                                        placeholder="10"
                                                        defaultValue={hour}
                                                        onChange={(e) => setHour(e.target.value)}
                                                        className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />

                                                    <span className="text-gray-400 font-bold px-0.5">:</span>
                                                    <input
                                                        type="number"
                                                        min="0" max="59"
                                                        placeholder="00"
                                                        defaultValue={minute}
                                                        onChange={(e) => setMinute(e.target.value)}
                                                        className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />

                                                    <select value={ampm} onChange={(e) => setAmPm(e.target.value)} className="bg-transparent text-sm font-bold text-gray-600  cursor-pointer outline-none px-2 transition-colors">
                                                        <option>AM</option>
                                                        <option>PM</option>
                                                    </select>


                                                </div>
                                            </div>
                                            <div className="col-span-2 my-3 w-full">

                                                <div className="flex items-center gap-8">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="callVisit"
                                                            value="Call"
                                                            checked={callVisit === "Call"}
                                                            onChange={(e) => setCallVisit(e.target.value)}
                                                            className="h-4 w-4"
                                                        />
                                                        <span className="text-sm font-medium text-gray-600">Call</span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="callVisit"
                                                            value="Visit"
                                                            checked={callVisit === "Visit"}
                                                            onChange={(e) => setCallVisit(e.target.value)}
                                                            className="h-4 w-4"
                                                        />
                                                        <span className="text-sm font-medium text-gray-600">Visit</span>
                                                    </label>
                                                </div>

                                                {callVisit === "Visit" && (
                                                    <div className="mt-4 flex flex-col md:flex-row items-start gap-4 w-full">

                                                        <div className="w-full md:w-56">
                                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                Reminder Time
                                                            </label>

                                                            <TimePickerDemo
                                                                value={reminderTime}
                                                                onChange={(newValue) => setReminderTime(newValue)}
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                Visit Address
                                                            </label>

                                                            <textarea
                                                                value={address}
                                                                onChange={(e) => setAddress(e.target.value)}
                                                                placeholder="Enter visit address..."
                                                                rows={2}
                                                                className="w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                                            />
                                                        </div>

                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
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

                            <div className="flex flex-col md:flex-row items-start gap-2 md:items-center md:gap-6 my-3 ">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        checked={isPublic}
                                        onChange={() => setIsPublic(true)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm font-medium text-gray-600">You wants remarks to be public?</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        checked={!isPublic}
                                        onChange={() => setIsPublic(false)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm font-medium text-gray-600">You wants remarks to be private?</span>
                                </label>



                            </div>
                        </div>

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
