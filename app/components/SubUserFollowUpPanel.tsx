'use client'

import SliderPanel from "@/app/components/SideSlider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { fetcher } from "@/lib/fetcherSwr";

import { MdOutlineFollowTheSigns } from "react-icons/md";

import {
MultiSelect,
MultiSelectContent,
MultiSelectGroup,
MultiSelectItem,
MultiSelectTrigger,
MultiSelectValue
} from "@/components/ui/multi-select";
import { TiMessages } from "react-icons/ti";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import TimePickerDemo from "./Time";

dayjs.extend(customParseFormat);

type FollowUpProps = {
 
inquiryId: string | number;
buttonText?: string;
};

export default function SubUserFollowUpPanel({
 
inquiryId,
buttonText = "Add Follow Up Record"
}: FollowUpProps) {

const [open, setOpen] = useState(false);
const [followUp, setFollowUp] = useState<string[]>([]);
const [assignTo, setAssignTo] = useState<any[]>([]);
const [date, setDate] = useState("");
const [time, setTime] = useState('10-00-AM');
const [assignDate, setAssignDate] = useState("");
const [assignTime, setAssignTime] = useState("10-00-AM");
const [incentiveOption, setIncentiveOption] = useState("");
const [remarks, setRemarks] = useState("");
const [loading, setLoading] = useState(false);
const [hour, setHour] = useState('10');
const [minute, setMinute] = useState('00');
const [ampm, setAmPm] = useState('AM');
const [callVisit, setCallVisit] = useState("Call");
const [isPublic, setIsPublic] = useState(true);
const [reminderTime, setReminderTime] = useState<Dayjs | null>(null);
const [address, setAddress] = useState("");

const Remindertime = reminderTime?.toDate().toTimeString().split(" ")[0];
const reminderDateTime = `${date}T${Remindertime}Z`;

const assignApi = `/api/sub-user/assign-names`;
const updateApi = `/api/create-post/${inquiryId}`;
const todaysFollowupApi = `/api/user/inquiry/view/inquiry/${inquiryId}/timeline`;

const { data } = useSWR(assignApi, fetcher);

const followUpStatus = ["Follow Up", "Not Interested", "Assign To", "Closed"];

const AssignDateAndTimeFormate = dayjs(`${assignDate} ${assignTime}`, "YYYY-MM-DD HH:mm A");

const followUpDateAndTimeFormate = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm A");

const now = dayjs();

useEffect(() => {
    setTime(`${hour}-${minute}-${ampm}`);
}, [hour, minute, ampm]);

useEffect(() => {
    setAssignTime(`${hour}-${minute}-${ampm}`);
}, [hour, minute, ampm]);

const formatToDMY = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
};

const handleSubmit = async () => {
    try {
        setLoading(true);

        if (!followUp.length) {
            toast.error("Select Follow Up status");
            return;
        }

        if (followUp.includes("Follow Up") && (!date)) {
            toast.error("Date & Time required for Follow Up");
            return;
        }

        if (followUpDateAndTimeFormate.isBefore(now)) {
            toast.error("Can't select past date and time.");
            return;
        }

        if (callVisit === "Visit" && !reminderTime) {
            toast.error("Reminder time is required for Visit.");
            return;
        }

        if (followUp.includes("Assign To") && assignTo.length === 0) {
            toast.error("Select a user to assign");
            return;
        }

        if (AssignDateAndTimeFormate.isBefore(now)) {
            toast.error("Can't select past date and time.");
            return;
        }

        if (!remarks.trim()) {
            toast.error("Remarks required");
            return;
        }

        const payload: Record<string, any> = {
            "Follow Up": followUp,
            "Remarks": remarks,
            
            "isPublic": isPublic,
            "Contact Mode": callVisit,
            "Reminder": reminderTime ? reminderDateTime : null,
            "Address": address
        };

        if (followUp.includes("Follow Up")) {
            payload["Date"] = formatToDMY(date);
            payload["Time"] = dayjs(time, "hh:mm A").format("h:mm A");
        }

        if (followUp.includes("Not Interested")) {
            payload["Incentive"] = incentiveOption;
        }

        const selectedAssign = assignTo[0] || null;
        const selectedData = selectedAssign ? JSON.parse(selectedAssign) : null;

        if (followUp.includes("Assign To") && selectedData) {
            payload["AssignId"] = selectedData.id;
            payload["AssignName"] = selectedData.name;
            payload["AssignType"] = selectedData.type;
            payload["Date"] = formatToDMY(assignDate);
            payload["Time"] = dayjs(assignTime, "hh:mm A").format("h:mm A");
        }

        const res = await fetch(updateApi, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update");

        mutate(updateApi);
        mutate(todaysFollowupApi);

        toast.success("Follow up updated");
        setOpen(false);

        setFollowUp([]);
        setDate("");
        setTime("");
        setAssignTo([]);
        setAssignDate("");
        setAssignTime("");
        setRemarks("");
        setIncentiveOption("");
        setCallVisit("Call");
        setReminderTime(null);
        setAddress("");

    } catch (err) {
        console.log(err);
        toast.error("Error updating follow up");
    } finally {
        setLoading(false);
    }
};

return (
    <>
        <Button
            size="lg"
            className="w-full sm:w-auto bg-[#7367f0] hover:bg-[#7367f0] cursor-pointer"
            onClick={() => setOpen(true)}
        >
            {buttonText}
        </Button>

        <SliderPanel
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Follow Up"
            maxWidth="max-w-xl"
        >
            <div className="space-y-3 overflow-x-hidden p-1">

                <div>
                    <label className="block text-sm text-gray-500 font-medium mb-1.5">Status</label>
                    <div className="flex items-center border rounded-md h-10 focus-within:ring-2 focus-within:ring-[#7367f0] focus-within:border-[#7367f0]">
                        <span className="px-3 text-gray-400 border-r flex items-center justify-center h-full">
                            <MdOutlineFollowTheSigns size={18} />
                        </span>
                        <MultiSelect values={followUp} onValuesChange={setFollowUp} single>
                            <MultiSelectTrigger className="w-full border-0 shadow-none h-full px-3 focus:ring-0">
                                <MultiSelectValue placeholder="select status..." />
                            </MultiSelectTrigger>

                            <MultiSelectContent>
                                <MultiSelectGroup>
                                    {followUpStatus.map((item, index) => (
                                        <MultiSelectItem key={index} value={item}>
                                            {item}
                                        </MultiSelectItem>
                                    ))}
                                </MultiSelectGroup>
                            </MultiSelectContent>
                        </MultiSelect>
                    </div>
                </div>

                {followUp.includes("Not Interested") && (
                    <div className="flex flex-wrap gap-6 items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                            <input
                                type="radio"
                                value="Incentive"
                                checked={incentiveOption === "Incentive"}
                                onChange={(e) => setIncentiveOption(e.target.value)}
                                className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
                            />
                            Incentive
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                            <input
                                type="radio"
                                value="No Incentive"
                                checked={incentiveOption === "No Incentive"}
                                onChange={(e) => setIncentiveOption(e.target.value)}
                                className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
                            />
                            No Incentive
                        </label>
                    </div>
                )}

                {followUp.includes("Assign To") && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-500 font-medium mb-1.5">Assign To</label>
                            <div className="border rounded-md focus-within:ring-2 focus-within:ring-[#7367f0] focus-within:border-[#7367f0]">
                                <MultiSelect values={assignTo} onValuesChange={(val) => setAssignTo(val)} single>
                                    <MultiSelectTrigger className="w-full border-0 shadow-none h-10 px-3 focus:ring-0">
                                        <MultiSelectValue placeholder="Assign To..." />
                                    </MultiSelectTrigger>

                                    <MultiSelectContent>
                                        <MultiSelectGroup>
                                            {data?.members?.map((item: any, i: number) => (
                                                <MultiSelectItem
                                                    key={i}
                                                    value={JSON.stringify({ id: item.id, name: item.name, type: item.type })}
                                                >
                                                    {item.name}
                                                </MultiSelectItem>
                                            ))}
                                        </MultiSelectGroup>
                                    </MultiSelectContent>
                                </MultiSelect>
                            </div>
                        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Date */}
    <div className="flex flex-col">
        <label className="text-sm text-gray-500 font-medium mb-1.5">Date</label>
        <div className="flex items-center border rounded-md h-10 w-full focus-within:ring-2 focus-within:ring-[#7367f0] focus-within:border-[#7367f0]">
            <span className="px-3 text-gray-400 flex items-center">
                <CiCalendarDate size={18} />
            </span>
            <span className="h-full w-px bg-gray-300" />
            <input
                type="date"
                value={assignDate}
                onChange={(e) => setAssignDate(e.target.value)}
                className="w-full h-full px-3 outline-none bg-transparent text-sm"
                placeholder="Enter Date"
            />
        </div>
    </div>

    {/* Time */}
    <div className="flex flex-col">
        <label className="text-sm text-gray-500 font-medium mb-1.5">
            Time
        </label>

        <div className="flex items-center justify-between border border-gray-300 h-10 px-3 rounded-md w-full focus-within:ring-2 focus-within:ring-[#7367f0] focus-within:border-[#7367f0]">
            <div className="flex items-center gap-1 w-full">
                <div className="text-gray-400 mr-2 flex items-center">
                    <IoMdTime size={18} />
                </div>

                <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="10"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <span className="text-gray-400 font-bold">:</span>

                <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="00"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>

            <select
                value={ampm}
                onChange={(e) => setAmPm(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-600 cursor-pointer outline-none"
            >
                <option>AM</option>
                <option>PM</option>
            </select>
        </div>
    </div>

    {/* Call / Visit Section */}
    <div className="sm:col-span-2 pt-2">
        <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    name="callVisit"
                    value="Call"
                    checked={callVisit === "Call"}
                    onChange={(e) => setCallVisit(e.target.value)}
                    className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
                />
                <span className="text-sm font-medium text-gray-600">
                    Call
                </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    name="callVisit"
                    value="Visit"
                    checked={callVisit === "Visit"}
                    onChange={(e) => setCallVisit(e.target.value)}
                    className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
                />
                <span className="text-sm font-medium text-gray-600">
                    Visit
                </span>
            </label>
        </div>

        {callVisit === "Visit" && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                    <label className="block mb-1.5 text-gray-500 font-medium  text-sm   ">
                        Reminder Time
                    </label>

                    <TimePickerDemo
                        value={reminderTime}
                        onChange={(newValue) => setReminderTime(newValue)}
                    />
                </div>

                <div className="w-full">
                    <label className="block text-gray-500 font-medium  text-sm   ">
                        Visit Address
                    </label>

                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter visit address..."
                        rows={3}
                        className="w-full p-2.5 rounded-md border border-gray-300 text-sm outline-none resize-none focus:border-[#7367f0] focus:ring-1 focus:ring-[#7367f0]"
                    />
                </div>
            </div>
        )}
    </div>
</div>
                    </div>
                )}

                {followUp.includes("Follow Up") && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 font-medium mb-1.5">Date</label>
                                <div className="flex items-center border rounded-md h-10 w-full focus-within:ring-2 focus-within:ring-[#7367f0] focus-within:border-[#7367f0]">
                                    <span className="px-3 text-gray-400 flex items-center"><CiCalendarDate size={18} /></span>
                                    <span className="h-full w-px bg-gray-300" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full h-full px-3 outline-none bg-transparent text-sm"
                                        placeholder="Enter Date"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 font-medium mb-1.5">
                                    Time
                                </label>
                                <div className="flex items-center justify-between border border-gray-300 h-10 px-3 rounded-md w-full focus-within:ring-2 focus-within:ring-[#7367f0] focus-within:border-[#7367f0]">
                                    <div className="flex items-center gap-1 w-full">
                                        <div className="text-gray-400 mr-2 flex items-center">
                                            <IoMdTime size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            min="1" max="12"
                                            placeholder="10"
                                            defaultValue={hour}
                                            onChange={(e) => setHour(e.target.value)}
                                            className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-gray-400 font-bold">:</span>
                                        <input
                                            type="number"
                                            min="0" max="59"
                                            placeholder="00"
                                            defaultValue={minute}
                                            onChange={(e) => setMinute(e.target.value)}
                                            className="w-8 text-center bg-transparent font-medium text-gray-700 outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                    <select value={ampm} onChange={(e) => setAmPm(e.target.value)} className="bg-transparent text-sm font-bold text-gray-600 cursor-pointer outline-none">
                                        <option>AM</option>
                                        <option>PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="callVisit"
                                        value="Call"
                                        checked={callVisit === "Call"}
                                        onChange={(e) => setCallVisit(e.target.value)}
                                        className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
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
                                        className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
                                    />
                                    <span className="text-sm font-medium text-gray-600">Visit</span>
                                </label>
                            </div>

                            {callVisit === "Visit" && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <div className="w-full">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Reminder Time
                                        </label>
                                        <div className="w-full">
                                            <TimePickerDemo
                                                value={reminderTime}
                                                onChange={(newValue) => setReminderTime(newValue)}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Visit Address
                                        </label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter visit address..."
                                            rows={3}
                                            className="w-full p-2.5 rounded-md border border-gray-300 text-sm outline-none resize-none focus:border-[#7367f0] focus:ring-1 focus:ring-[#7367f0]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-gray-500 font-medium mb-1.5">
                        Remarks
                    </label>
                    <div className="flex border rounded-md focus-within:ring-2 focus-within:ring-[#7367f0] focus-within:border-[#7367f0]">
                        <span className="px-3 pt-2.5 text-gray-400">
                            <TiMessages size={18} />
                        </span>
                        <textarea
                            placeholder="remarks"
                            className="w-full px-3 py-2.5 outline-none resize-none h-28 text-sm"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            checked={isPublic}
                            onChange={() => setIsPublic(true)}
                            className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
                        />
                        <span className="text-sm font-medium text-gray-600">Make remarks public?</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            checked={!isPublic}
                            onChange={() => setIsPublic(false)}
                            className="h-4 w-4 text-[#7367f0] focus:ring-[#7367f0]"
                        />
                        <span className="text-sm font-medium text-gray-600">Make remarks private?</span>
                    </label>
                </div>

               <div className="space-x-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-[#7367f0] text-white py-2 px-8 rounded-md text-sm font-medium"
                    >
                        {loading ? "Saving" : "Save"}
                    </button>

                    <button
                        onClick={() => setOpen(false)}
                        className="border px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Cancel
                    </button>
                </div>

            </div>

             
        </SliderPanel>
    </>
);
}