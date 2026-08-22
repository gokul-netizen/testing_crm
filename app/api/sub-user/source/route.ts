import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const sources = await prisma.source.findMany({
            where: {
                isDeleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(sources, { status: 200 })
    } catch (error) {
        logger.error({
            message: "Fail to fetch all source",
            file: "api/admin/master/source/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: error }, { status: 500 })
    }
}