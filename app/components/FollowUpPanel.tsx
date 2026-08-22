'use client';

import SliderPanel from "@/app/components/SideSlider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { fetcher } from "@/lib/fetcherSwr";
import { TiMessages } from "react-icons/ti";
import { IoMdTime } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

dayjs.extend(customParseFormat);

type Props = {

  inquiryId: string | number;
  usersApi?: string;
};

export default function FollowUpPanel({ inquiryId, usersApi = `/api/admin/get-users`, }: Props) {
  const [open, setOpen] = useState(false);
  const [followUp, setFollowUp] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [incentiveOption, setIncentiveOption] = useState("");
  const [assignTo, setAssignTo] = useState<any[]>([]);
  const [assignDate, setAssignDate] = useState("");
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState('Am');
  const [assignTime, setAssignTime] = useState("");
  const [time, setTime] = useState("");
  const [isPublic, setIsPublic] = useState(true);


  const { data } = useSWR(usersApi, fetcher);

  const followUpStatus = ["Follow Up", "Not Interested", "Assign To", "Closed"];

  const AssignDateAndTimeFormate = dayjs(`${assignDate} ${assignTime}`, "YYYY-MM-DD HH:mm A");

  const followUpDateAndTimeFormate = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm A");

  const now = dayjs();

  const formatToDMY = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };

  useEffect(() => {
    setTime(`${hour}-${minute}-${ampm}`);
  }, [hour, minute, ampm]);

  useEffect(() => {
    setAssignTime(`${hour}-${minute}-${ampm}`);
  }, [hour, minute, ampm]);



  const executeSave = async () => {
    try {
      setLoading(true);

      const payload: Record<string, any> = {
        "Follow Up": followUp,
        Remarks: remarks,
        isPublic,
      };

      if (followUp.includes("Follow Up")) {
        payload["Date"] = formatToDMY(date);
        payload["Time"] = dayjs(time, "hh:mm A").format("h:mm A");
      }

      if (followUp.includes("Not Interested")) {
        payload["Incentive"] = incentiveOption;
      }

      const selectedAssign = assignTo[0] || null;

      if (followUp.includes("Assign To") && selectedAssign) {
        payload["AssignId"] = selectedAssign.id;
        payload["AssignName"] = selectedAssign.username;
        payload["AssignType"] = selectedAssign.type;
        payload["Date"] = formatToDMY(assignDate);
        payload["Time"] = dayjs(assignTime, "hh:mm A").format("h:mm A");
      }

      const res = await fetch(`/api/create-post/${inquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      mutate(`/api/user/inquiry/view/inquiry/${inquiryId}/timeline`);
      mutate(`/api/admin/timeline/${inquiryId}`);

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

    } catch (err) {
      console.log(err);
      toast.error("Error updating follow up");
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async () => {
    try {
      if (!followUp.length) {
        toast.error("Select Follow Up status");
        return;
      }

      if (followUp.includes("Follow Up") && (!date || !time)) {
        toast.error("Date & Time required for Follow Up");
        return;
      }

      if (followUp.includes("Assign To") && assignTo.length === 0) {
        toast.error("Select a user to assign");
        return;
      }

      if (followUp.includes("Assign To") && (!assignDate || !assignTime)) {
        toast.error("Date & Time required for assign");
        return;
      }

      if (followUp.includes("Follow Up") && followUpDateAndTimeFormate.isBefore(now)) {
        toast.error("Can't select past date and time");
        return;
      }

      if (followUp.includes("Assign To") && AssignDateAndTimeFormate.isBefore(now)) {
        toast.error("Can't select past date and time.");
        return;
      }

      if (!remarks.trim()) {
        toast.error("Remarks required");
        return;
      }


      const activeDate = followUp.includes("Assign To")
        ? assignDate
        : date;

      const activeTime = followUp.includes("Assign To")
        ? assignTime
        : time;


      toast("Are you sure you want to save changes?", {
        description:
          followUp.includes("Not Interested") || followUp.includes("Closed")
            ? followUp.join(", ")
            : activeDate && activeTime
              ? `Scheduled for: ${activeDate} at ${activeTime}`
              : followUp.join(", "),

        className:
          "!w-[520px] !max-w-[520px] bg-[#7367f0] text-white border-none [&_[data-button]]:!ml-6",

        descriptionClassName: "text-white/80",

        duration: Infinity,

        action: {
          label: "Save",
          onClick: () => executeSave(),
        },

        cancel: {
          label: "Cancel",
          onClick: () => console.log("Cancelled"),
        },
      });

    } catch (err) {
      console.log(err);
      toast.error("Error validating follow up");
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="bg-[#7367f0] hover:bg-[#7367f0] cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Add Follow Up Record
      </Button>

      <SliderPanel
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Follow Up"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 overflow-x-hidden">

          {/* Status */}
          <div>
            <label className="text-sm text-gray-500 font-medium">
              Status
            </label>

            <div className="flex items-center border rounded-md h-10">
              <span className="px-3 text-gray-400 border-r">
                <MdOutlineFollowTheSigns size={18} />
              </span>

              <MultiSelect
                values={followUp}
                onValuesChange={setFollowUp}
                single
              >
                <MultiSelectTrigger className="w-full border-0 shadow-none h-full px-3">
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
            <div className="flex gap-8">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="incentiveOption"
                  value="Incentive"
                  checked={incentiveOption === "Incentive"}
                  onChange={(e) => setIncentiveOption(e.target.value)}
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
                  onChange={(e) => setIncentiveOption(e.target.value)}
                  className="h-5 w-5 accent-red-500"
                />
                No Incentive
              </label>
            </div>
          )}

          {/* Assign To */}
          {followUp.includes("Assign To") && (
            <div>
              <label className="text-sm text-gray-500 font-medium">
                Assign To
              </label>

              <div className="flex items-center border rounded-md h-10">
                <span className="px-3 text-gray-400 border-r">
                  <MdOutlineFollowTheSigns size={18} />
                </span>

                <MultiSelect
                  values={assignTo}
                  onValuesChange={(val) => setAssignTo(val)}
                  single
                >
                  <MultiSelectTrigger className="w-full border-0 shadow-none h-full px-3">
                    <MultiSelectValue placeholder="select name..." />
                  </MultiSelectTrigger>

                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {data?.map((item: any, i: number) => (
                        <MultiSelectItem
                          key={i}
                          value={item}
                        >
                          {item.username}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Date</label>
                  <div className="flex items-center border rounded-md h-10">
                    <span className="px-3 text-gray-400"><CiCalendarDate /></span>
                    <span className="h-full w-px bg-gray-300" />
                    <input
                      type="date"
                      value={assignDate}
                      onChange={(e) => setAssignDate(e.target.value)}
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
            </div>
          )}


          {followUp.includes("Follow Up") && (
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
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="text-sm text-gray-500 font-medium">
              Remarks
            </label>

            <div className="flex border rounded-md">
              <span className="px-3 pt-2 text-gray-400">
                <TiMessages />
              </span>

              <textarea
                placeholder="remarks"
                className="w-full px-3 py-2 outline-none resize-none h-28"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-2 md:items-center md:gap-6">
            <label className="flex items-center gap-2 cursor-pointer ">
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-600 shrink-0">You wants remarks to be public?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-600 shrink-0">You wants remarks to be private?</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-[#7367f0] text-white py-2 px-8 rounded-md"
            >
              {loading ? "Saving" : "Save"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="border px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>

        </div>
      </SliderPanel>
    </>
  );
}