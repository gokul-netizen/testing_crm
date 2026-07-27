import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
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