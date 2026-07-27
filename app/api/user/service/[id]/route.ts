import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


interface ParamsProps {
    params: Promise<{ id : string  }>;
}


export async function GET(req: Request, { params }: ParamsProps) {
    try {

        const { id } = await params;

        const service = await prisma.service.findUnique({
            where: {
                id : Number(id)
                
            },
             include: {
                domain: {
                    select: {
                        domainName: true
                    }
                }
            }

        });

        return NextResponse.json(service, { status: 200 });
    } catch (error: any) {
        logger.error("error when getting service by id", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}

export async function PUT(req:Request , {params} : ParamsProps) {
    try {
        
        const {id} = await params;
        const body = await req.json();
        const {service , status } = body;

        if(!service){
           return NextResponse.json(
                { error: "Service name and status are required." }, 
                { status: 400 }
            );
        }

        await prisma.service.update({
            where : {
                id : Number(id)
            },
            data : {
                service : service,
                status : status
            }
        });

        return NextResponse.json("Updated Successfully", { status : 200})

    } catch (error : any) {
        logger.error("error when getting service by id", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}