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
        
        logger.error({
            
            message: "Fail to get the service",
            file: "api/sub-user/inquiry/view/[domainId]/service/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}