'use client';

import SpinnerCircle4 from "@/components/spinner-10";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue
} from "@/components/ui/multi-select";
import { fetcher } from "@/lib/fetcherSwr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { TiMessages } from "react-icons/ti";
import useSWR, { mutate } from "swr";
import UserNamesDropDown from "./SubUserDropDown";
import { toast } from "sonner";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from "next/navigation";
import { confirmAction } from "./ConfirmSooner";

dayjs.extend(customParseFormat);

interface IncomingProps {
  inquiryId: string | number;
  followupid: string | number;
  userId: string | number;
  backUrl?: string | any;
}

type User = {
  id: string | number;
  name: string;
};


export default function FollowUpStatusEdit({
  inquiryId,
  followupid,
  userId,
  backUrl

}: IncomingProps) {

  const [followUp, setFollowUp] = useState<string[]>([]);
  const [assign, setAssign] = useState<User[]>([]);
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmPm] = useState("AM");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const { data, isLoading } = useSWR(`/api/sub-user/inquiry/${followupid}`, fetcher);

  const selectedStatus = followUp[0];

  const isAssignTo = selectedStatus === "Assign To";

  const shouldShowDateTime = selectedStatus === "Follow Up" || selectedStatus === "Assign To";


  useEffect(() => {
    if (data?.data?.followUpStatus) {
      setFollowUp([data.data.followUpStatus]);
    }

    if (data?.data?.assignTo) {
      setAssign([
        {
          id: data.data.assignTo,
          name: data.data.assignToName
        }
      ]);
    }

    if (data?.data?.date) {
      setDate(
        dayjs(data.data.date, "DD-MM-YYYY").format("YYYY-MM-DD")
      );
    }

    if (data?.data?.time) {
      const [t, p] = data.data.time.split(" ");
      const [h, m] = t.split(":");

      setHour(h);
      setMinute(m);
      setAmPm(p);
    }

    if (data?.data?.remarks) {
      setRemarks(data.data.remarks);
    }
  }, [data]);
 


  useEffect(() => {
    if (!isAssignTo) {
      setAssign([]);
    }
  }, [isAssignTo]);

  if (isLoading) return <SpinnerCircle4 />;

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const payload = {
        status: selectedStatus || "",
        assignId: assign[0]?.id ? Number(assign[0].id) : null,
        assignName: assign[0]?.name || null,
        date: dayjs(date).format("DD-MM-YYYY"),
        time: `${hour}:${minute} ${ampm}`,
        remarks
      };

      const res = await fetch(
        `/api/todays-followup/${inquiryId}/${followupid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.error);

      mutate(`/api/todays-followup/${inquiryId}`);
      toast.success(result.message);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


     const handleBack = ()=>{
      
        confirmAction({
              title: "Are you sure you want to go back?",
              description: "Changes won't be saved. Please save them first.",
              confirmLabel: "Go Back",
              onConfirm: async () => {
                  route.push(backUrl)
              },
              
            });
        }

  return (
    <section>
      <div className="bg-white p-4 grid gap-8">

        <h1 className="font-bold text-xl">
          Edit Follow Up Status
        </h1>


        <MultiSelect values={followUp} onValuesChange={setFollowUp} single>
          <MultiSelectTrigger className="w-full h-10">
            <MultiSelectValue placeholder="select status..." />
          </MultiSelectTrigger>

          <MultiSelectContent>
            <MultiSelectGroup>
              {["Follow Up", "Not Interested", "Assign To", "Closed"].map(
                (item) => (
                  <MultiSelectItem key={item} value={item}>
                    {item}
                  </MultiSelectItem>
                )
              )}
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>


        {isAssignTo && (
          <UserNamesDropDown
            id={userId}
            assign={assign}
            setAssign={setAssign}
          />
        )}


        {shouldShowDateTime && (
          <div className="grid grid-cols-2 gap-2">


            <div>
              <label className="text-sm text-gray-500">
                Date
              </label>

              <div className="flex items-center border rounded-md h-10">
                <span className="px-3 text-gray-400">
                  <CiCalendarDate />
                </span>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-full outline-none px-2"
                />
              </div>
            </div>


            <div>
              <label className="text-sm text-gray-500">
                Time
              </label>

              <div className="flex items-center gap-1 border rounded-md h-10 px-2">

                <IoMdTime className="text-gray-400" />

                <input
                  type="number"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-10 text-center outline-none"
                />

                <span>:</span>

                <input
                  type="number"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-10 text-center outline-none"
                />

                <select
                  value={ampm}
                  onChange={(e) => setAmPm(e.target.value)}
                  className="outline-none"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>

              </div>
            </div>
          </div>
        )}


        <div className="flex border rounded-md">
          <TiMessages className="m-3 text-gray-400" />

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-2 outline-none"
            placeholder="remarks"
          />
        </div>


        <div className="flex gap-3">

          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md"
          >
            Go Back
          </button>

          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-indigo-500 text-white rounded-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </section>
  );
}