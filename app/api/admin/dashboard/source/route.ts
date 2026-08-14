import { getCurrentUTCFromIST } from "@/lib/date-time";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    try {
        
        const body = await req.json();

        const {source,status} = body;

        if(!source) return NextResponse.json({error : "Source is required"},{status : 400});

        const exist = await prisma.source.findUnique({
            where : {
                source : source
            }
        });
        if(exist) return NextResponse.json({error : "Source already exist"},{status : 400});

        await prisma.source.create({
            data:{
                source : source,
                status,
                createdAt : getCurrentUTCFromIST()
            }
        });

        return NextResponse.json({message : "Added source"},{status :200});

    } catch (error:any) {

        logger.error({
            message: "Fail to add new source",
            file: "api/admin/dashboard/source/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({error : error.message },{status :500})
    } 
}


export async function GET(req:Request){
    try {
        const sources = await prisma.source.findMany({
            orderBy : {
                createdAt : "desc"
            }
        });

        return NextResponse.json(sources, {status : 200})
    } catch (error) {

        logger.error({
            message: "Fail to fetch all source",
            file: "api/admin/dashboard/source/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

           return NextResponse.json({error : error}, {status : 500})
    }
}  