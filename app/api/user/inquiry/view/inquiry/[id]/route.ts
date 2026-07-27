import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logs";
import { getCurrentUTCFromIST } from "@/lib/date-time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { UAParser } from "ua-parser-js";
import { userSession } from "@/lib/jwt";

dayjs.extend(utc);
dayjs.extend(timezone);


interface ParamsProps {
  params: Promise<{ id: string ,  }>; 
}

export async function GET(request: Request, { params }: ParamsProps) {
    try {

       const { id } = await params;
       const inquiryId = id;
        

       const info = await prisma.DomainResponse.findUnique({
        where : {
            id : Number(inquiryId),
        },

        select : {
            response : true
        }
       });
       
        return NextResponse.json(info)
    } catch (error : any) {
        logger.error("Error" , error.message)
        return NextResponse.json("error")
        
    }

}



