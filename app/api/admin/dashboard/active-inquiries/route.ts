

import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req:Request) {
    try {
        const result = await prisma.domainResponse.findMany({
            where: {
                status: 1,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                domain: {
                    select: {
                        id: true,
                        domainName: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        
        logger.error({
            message: "Fail to fetch active inquiries",
            file: "api/admin/dashboard/active-inquiries/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            { message: "fail", error: String(error) },
            { status: 500 }
        );
    }
}