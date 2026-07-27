import { prisma } from "@/lib/prisma";
import Update from "./update";


interface PageProps {
    params: Promise<{ id: string; all: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id, all } = await params;
    const domainID = Number(id);
    const inquiryId = Number(all);

    const detail = await prisma.domainResponse.findUnique({
        where: { id: Number(inquiryId) },
        select: { response: true },
    });

    const inquiry = detail?.response?.body;  
 
    return (
        <section>

        <Update inquiry={inquiry} domainId={domainID} inquiryID={inquiryId}/>
            
        </section>
    )
}