'use client'

import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue
} from "@/components/ui/multi-select";

import { CiCalendarDate } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import { TiMessages } from "react-icons/ti";


interface AssignNames {
    members : {
        id : number;
        name : string;
    }[];
}

interface MainUserAssignNames {
    id: number;
    username: string;
}



type Props = {
    followUp: string[];
    setFollowUp: any;
    assignto?: string[];
    setAssignTo?: any;
    date: string;
    setDate: any;
    assignDate? : string,
    setAssignDate?: any,
    time: string;
    setTime: any;
    assignTime?: string;
    setAssignTime?: any;
    loading: boolean;
    setLoading: any;
    remarks: string;
    setRemarks: any;
    incentive?: boolean;
    incentiveOption?: string;
    assign?: boolean;
    mainUser?:boolean;
    subUser?:boolean;
    assignName? : AssignNames,
    mainUserAssignNames?: MainUserAssignNames[];
    setIncentiveOption?: (val: string) => void;
    onSubmit: () => void;
    onClose: () => void;
};

export default function FollowUpForm({
    followUp,
    setFollowUp,
    assignto,
    setAssignTo,
    date,
    setDate,
    assignDate,
    setAssignDate,
    assignTime,
    setAssignTime,
    time,
    mainUser,
    subUser,
    setTime,
    loading,
    setLoading,
    mainUserAssignNames ,
    remarks,
    assign,
    incentiveOption,
    setIncentiveOption,
    assignName,
    setRemarks,
    onSubmit,
    incentive,
    onClose
}: Props) {

    const followUpStatus = ["Follow Up", "Not Interested", "Assign To", "Closed"];

    return (
        <div className="space-y-4 overflow-x-hidden ">

            {/* Follow Up Status */}
            <div>
                <label className="text-sm text-gray-500 font-medium"> Status</label>

                <div className="flex items-center border rounded-md h-10">
                    <span className="px-3 text-gray-400 border-r ">
                        <MdOutlineFollowTheSigns size={18} />
                    </span>

                    <MultiSelect values={followUp} onValuesChange={setFollowUp} single>
                        <MultiSelectTrigger className="w-full border-0 shadow-none h-full px-3">
                            <MultiSelectValue placeholder="Follow Up..." />
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

            {followUp.includes("Not Interested") && incentive && (
                <div className="flex gap-8">

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="incentiveOption"
                            value="Incentive"
                            checked={incentiveOption === "Incentive"}
                            onChange={(e) => setIncentiveOption?.(e.target.value)}
                            className="h-5 w-5 accent-green-500"
                        />
                        Incentive
                    </label>


                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="incentiveOption"
                            value="No Incentive"
                            checked={incentiveOption === "No Incentive"}
                            onChange={(e) => setIncentiveOption?.(e.target.value)}
                            className="h-5 w-5 accent-red-500"
                        />
                        No Incentive
                    </label>
                </div>
            )}

            {followUp.includes("Assign To") && assign && (
                <div>
                    
                    <label className="text-sm text-gray-500 font-medium"> Assign</label>

                    <div className="flex items-center border rounded-md h-10">
                        <span className="px-3 text-gray-400 border-r ">
                            <MdOutlineFollowTheSigns size={18} />
                        </span>

                        <MultiSelect values={assignto} onValuesChange={setAssignTo} single>
                            <MultiSelectTrigger className="w-full border-0 shadow-none h-full px-3">
                                <MultiSelectValue placeholder="Assign To..." />
                            </MultiSelectTrigger>

                            <MultiSelectContent>
                                <MultiSelectGroup>
                                    {subUser && assignName?.members?.map((item) => (
                                        <MultiSelectItem key={item.id} value={JSON.stringify({ id: item.id, name: item.name })}>
                                            {item.name}
                                        </MultiSelectItem>
                                    ))}

                                    {mainUser && mainUserAssignNames?.map((item:MainUserAssignNames) => (
                                        <MultiSelectItem key={item.id} value={JSON.stringify({ id: item.id, username: item.username })}>
                                             {item.username}
                                        </MultiSelectItem>
                                    ))}
                                </MultiSelectGroup>
                            </MultiSelectContent>
                        </MultiSelect>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-sm text-gray-500 font-medium">Date</label>
                            <div className="flex items-center border rounded-md h-10">
                                <span className="px-3 text-gray-400"><CiCalendarDate /></span>
                                <input
                                    type="date"
                                    value={assignDate}
                                    onChange={(e) => setAssignDate(e.target.value)}
                                    className="w-full h-full px-3 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="text-sm text-gray-500 font-medium">Time</label>
                            <div className="flex items-center border rounded-md h-10">
                                <span className="px-3 text-gray-400"><IoMdTime /></span>
                                <input
                                    type="time"
                                    value={assignTime}
                                    onChange={(e) => setAssignTime(e.target.value)}
                                    className="w-full h-full px-3 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Date & Time */}
            {followUp.includes("Follow Up") && (
                <>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-sm text-gray-500 font-medium">Date</label>
                            <div className="flex items-center border rounded-md h-10">
                                <span className="px-3 text-gray-400"><CiCalendarDate /></span>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-full px-3 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="text-sm text-gray-500 font-medium">Time</label>
                            <div className="flex items-center border rounded-md h-10">
                                <span className="px-3 text-gray-400"><IoMdTime /></span>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full h-full px-3 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Remarks */}
            <div>
                <label className="text-sm text-gray-500 font-medium">Remarks</label>
                <div className="flex border rounded-md">
                    <span className="px-3 pt-2 text-gray-400"><TiMessages /></span>
                    <textarea
                        className="w-full px-3 py-2 outline-none resize-none h-28"
                        placeholder="Enter Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="space-x-4">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="bg-[#7367f0] text-white py-2 px-8 rounded-md font-semibold cursor-pointer"
                >
                    {loading ? "Saving" : "Save"}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="border border-gray-400 text-gray-500 py-2 cursor-pointer px-4 rounded-md font-semibold"
                >
                    Cancel
                </button>
            </div>

        </div>
    );
}