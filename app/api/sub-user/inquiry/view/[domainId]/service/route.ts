import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


interface ParamsProps {
    params: Promise<{ domainId: string }>;
}


export async function GET(req: Request, { params }: ParamsProps) {
    try {
        const { domainId } = await params;

        const service = await prisma.service.findMany({
            where: {
                domainId:  Number(domainId)
            }
        });

        return NextResponse.json(service, { status: 200 });
    } catch (error: any) {
        logger.error({error : error.message },"error when adding service");
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}