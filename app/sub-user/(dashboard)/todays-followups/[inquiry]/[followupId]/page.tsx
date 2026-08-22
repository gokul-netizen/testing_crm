'use client';

import FollowUpStatusEdit from "@/app/components/FollowUpSatusEdit";
import { useParams } from "next/navigation";

export default function page(){

    const params = useParams();
    const {inquiry , followupId , id} = params;
    const inquiryId = inquiry as string;
    const statusId = followupId as string;
    const userId =  id as string;

    return (
        <section>
        
        <FollowUpStatusEdit inquiryId={inquiryId} followupid={statusId} userId={userId}
        
        backUrl={`/sub-user/${userId}/total-inquiries/${inquiryId}`}
        
        />

        </section>
    )
}