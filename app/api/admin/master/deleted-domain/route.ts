import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {

        const isDeletedDomains = await prisma.inquiryDomain.findMany({
            where: {
                isDeleted: true
            },
            select: {
                id: true,
                domainName: true,
                accessToken: true,
                isDeletedOn: true,
                isDeletedBy: true,

            }
        });

        return NextResponse.json({ data: isDeletedDomains, message: "Domain fetched successfully" }, { status: 200 });

    } catch (error) {
        logger.error({
            message: "Fail to fetch deleted the domain",
            file: "api/admin/master/deleted-domain/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: error || "Something went wrong..!" }, { status: 500 });
    }
}


export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (Array.isArray(ids) && ids.length === 0) {
            return NextResponse.json({ error: "Ids must be array and not null" })
        }

        await prisma.inquiryDomain.updateMany({
            where: {
                id: { in: ids },
            },
            data: {
                isDeleted: false,
                isDeletedBy: null,
                isDeletedOn: null
            },
        });

        return NextResponse.json({ message: "Domain updated successfully", count: ids.length }, { status: 200 });

    } catch (error) {

        logger.error({
            message: "Fail to delete the domain",
            file: "api/admin/master/deleted-domain/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ error: "Somethig went wrong" }, { status: 500 });
    }
}   