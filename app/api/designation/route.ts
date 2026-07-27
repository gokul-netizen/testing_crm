import { getCurrentUTCFromIST } from "@/lib/date-time";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    try {
        
        const body = await req.json();
        const {title ,status , userId} = body;

        if(!title) return NextResponse.json({error : "Title is required"},{status : 400});

        await prisma.designation.create({
            data:{
                jobTitle : title,
                status,
                userId : Number(userId),
                createdAt : getCurrentUTCFromIST()
            }
        });

        return NextResponse.json({message : "Added Title"},{status :200});

    } catch (error:any) {
        logger.error("error when adding Title",error);
        return NextResponse.json({error : error.message },{status :500})
    } 
}


export async function GET(req:Request){
    try {
        const titles = await prisma.Designation.findMany({
            orderBy : {
                createdAt : "desc"
            }
        });

        return NextResponse.json(titles, {status : 200});

    } catch (error:any) {
         logger.error("error when getting Title",error);
           return NextResponse.json({error : error}, {status : 500})
    }
}