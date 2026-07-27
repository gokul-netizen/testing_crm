import { getCurrentUTCFromIST } from "@/lib/date-time";
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
        console.log("error when adding source",error);
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
        console.log("error when getting source",error)
           return NextResponse.json({error : error}, {status : 500})
    }
}  