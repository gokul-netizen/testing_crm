import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { NextResponse } from "next/server";


interface ParamsProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req : Request ,{ params }: ParamsProps) {
    
    try {
        const { id } = await params;

        const data = await prisma.InquiryDomain.findUnique({
            where : {
                id : Number(id)
            },
            select : {
                domainName : true,
                accessToken : true,
                addedOn : true,
                subscription : true,
                status : true,
                updatedOn : true,
                isDeleted : true,
            }
        });


        return NextResponse.json({data : data , message : "Successfully fetched data"} , {status : 200});

    } catch (error:any) {
    logger.error({error : error.message}, "Error on getting active domain");
    return NextResponse.json({message : error.message})

    }
}

export async function PATCH(req : Request , {params } : ParamsProps){
    try {

        const {id} = await params;
        const body = await req.json();
        const { domainName , subscription , status , isDeleted  } = body;
        const data : Record<string, unknown> = {};

        if(domainName !== null) data.domainName = domainName;
        if(subscription !== null) data.subscription = subscription;
        if(status !== null) data.status = status;
        if(isDeleted !== null) data.isDeleted = isDeleted;

        await prisma.InquiryDomain.update({
            where : {
                id : Number(id)
            },
            data  
        });

        return NextResponse.json({message : "Updated the domain"}, {status : 200})

    } catch (error : any) {
         logger.error({error : error.message}, "Error on updating the domain");
         return NextResponse.json({message : error.message}, {status :500})
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        const userId = await getSession();

        if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });

        const Id = userId?.id;
        const { id } = await params;
        const formData = await req.formData();
        const domainName = formData.get("domainName") as string;
        const accessToken = formData.get("accessToken") as string;
        const subscription = formData.get("subscription") as string;
        const status = formData.get("status") as string;
        const logo  = formData.get("logo")as File | null;

        let logoPath;
        if(logo && logo.size > 0){
            logoPath = await uploadFile(logo)
        }


        const exist = await prisma.inquiryDomain.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!exist) {
            return NextResponse.json({ message: "Domain not exist" }, { status: 400 });
        }

        const updated = await prisma.inquiryDomain.update({
            where: { id: Number(id) },
            data: {
                domainName,
                accessToken,
                logo : logoPath,
                status,
                subscription : Number(subscription),
                updatedBy: String(Id),
                updatedOn: getCurrentUTCFromIST()
            }
        });

        return NextResponse.json({ message: "updated successful", data: updated }, { status: 200 });

    } catch (error) {
        console.error("Error occurred while updating domain", error);
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}