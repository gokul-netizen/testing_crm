import { getCurrentUTCFromIST } from "@/lib/date-time";
import getSession from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const result = await prisma.domainResponse.findMany({
            where: {
                status: 0,
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
            message: "Fail to fetch deleted inquiries",
            file: "api/admin/dashboard/deleted-inquiries/route.ts",
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


export async function PATCH(req: Request) {
    try {

        const userId = await getSession();
        if (!userId) return NextResponse.json({ message: "Unauth" }, { status: 401 });

        const Id = userId?.id;

        const body = await req.json();
        const { ids } = body;



        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "Ids must be a non-empty array" },
                { status: 400 }
            );
        }

        await prisma.domainResponse.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                status: 1,
                isDeletedBy: "",
                isDeletedOn: null
            }
        });

        return NextResponse.json({ message: "deled successfully" }, { status: 200 })
    } catch (error) {


        logger.error({
            message: "Fail to update deleted inquiries ",
            file: "api/admin/dashboard/deleted-inquiries/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ error: error }, { status: 500 })
    }
}

