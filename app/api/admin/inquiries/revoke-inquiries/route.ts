import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function PATCH(req: Request) {
    try {

        const body = await req.json();
        const { ids } = body;

        if (Array.isArray(ids) && ids.length === 0) {
            return NextResponse.json({ error: "Ids must be an array and not null" })
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

        return NextResponse.json({ message: "Revoked Inquiry successfully" }, { status: 200 })


    } catch (error) {

        logger.error({

            message: "Fail to revoke the deleted inquiry",
            file: "api/admin/inquiries/revoke-inquriries/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error }, { status: 500 })
        

    }

}