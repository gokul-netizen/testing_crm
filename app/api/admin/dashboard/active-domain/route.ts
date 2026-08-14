import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const activeDomain = await prisma.inquiryDomain.findMany({
            where: {
                status: "Active"
            },
            select: {
                id: true,
                domainName: true,
                accessToken: true,
                status: true,
                addedOn: true
            },
            orderBy: {
                addedOn: "desc",
            },
        });

        return NextResponse.json(activeDomain, { status: 200 })
    } catch (error: any) {

        logger.error({
            message: "Fail to fetch active domain ",
            file: "api/admin/dashboard/active-domain/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });


        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}