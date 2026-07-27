'use client'

import SliderPanel from "@/app/components/SideSlider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { mutate } from "swr";
import { toast } from "sonner";
import FollowUpForm from "@/app/components/FollowUpForm";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

export default function FollowUp({id} : {id : string | number}) {

    const [open, setOpen] = useState(false);
    const [followUp, setFollowUp] = useState<string[]>([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);

   
    const inquiryID = id;

    const formatToDMY = (dateStr: string) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        return `${d}-${m}-${y}`;
    };



    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!followUp.length) {
                setLoading(false);
                return toast.error("Select Follow Up status");
            }

            const isFollowUP = followUp.includes("Follow Up");
            if (isFollowUP && (!date || !time)) {
                setLoading(false);
                return toast.error("Date & Time required");
            }

            if (!remarks.trim()) {
                setLoading(false);
                return toast.error("Remarks required");
            }

            const res = await fetch(`/api/create-post/${inquiryID}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "Follow Up": followUp,
                    "Date": formatToDMY(date),
                    "Time": dayjs(time, "HH:mm").format("h:mm A"),
                    "Remarks": remarks
                })
            });

            if (!res.ok) throw new Error("Failed");

            mutate(`/api/create-post/${inquiryID}`);
            mutate(`/api/todays-followup/${inquiryID}`);
            toast.success("Follow up updated");
            setOpen(false);

            // reset form
            setFollowUp([]);
            setDate("");
            setTime("");
            setRemarks("");

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
                className="bg-[#7367f0] hover:bg-[#7367f0] cursor-pointer"
                onClick={() => setOpen(true)}
            >
                Add Follow Up Record
            </Button>


            <SliderPanel isOpen={open} onClose={() => setOpen(false)} title="Follow Up" maxWidth="max-w-lg"  >
                <FollowUpForm
                    followUp={followUp}
                    setFollowUp={setFollowUp}
                    date={date}
                    loading={loading}
                    setLoading={setLoading}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    remarks={remarks}
                    setRemarks={setRemarks}
                    onSubmit={handleSubmit}
                    onClose={() => setOpen(false)}
                />
            </SliderPanel>
        </>
    );
}