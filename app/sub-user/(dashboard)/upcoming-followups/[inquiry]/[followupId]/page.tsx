'use client';

import FollowUpStatusEdit from "@/app/components/FollowUpSatusEdit";
import { useParams } from "next/navigation";

export default function page(){

    const params = useParams();
    const {detail , inqyiry , id} = params;
    const inquiryId = detail as string;
    const statusId = inqyiry as string;
    const userId =  id as string;

    return (
        <section>
        
        <FollowUpStatusEdit inquiryId={inquiryId} statusId={statusId} userId={userId}
        
        backUrl={`/sub-user/${userId}/total-inquiries/${inquiryId}`}


        />

        </section>
    )
}