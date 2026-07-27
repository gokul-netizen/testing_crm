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

            
            }
        });


        return NextResponse.json({data : data , message : "Successfully fetched data"} , {status : 200});

    } catch (error:any) {
    logger.error({error : error.message}, "Error on getting active domain");
    return NextResponse.json({message : error.message})

    }




    
}