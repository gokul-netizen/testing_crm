import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {

        const data = await prisma.inquiryDomain.findMany({
            where: {
                isDeleted: false,
            },

            select: {
                id: true,
                domainName: true,
                logo: true,

                _count: {
                    select: {
                        domainResponse: {
                            where: {
                                status: 1,
                            },
                        },
                    },
                },
            },

            orderBy: {
                addedOn: "desc",
            },
        });



        return NextResponse.json({ message: "Successfully fetched all domain", data }, { status: 200 });

    } catch (error) {

        logger.error({
            message: "Fail to fetch inquiries count to it's respeacted domain view",
            file: "api/admin/inquiries/view/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ message: "Fail to fetch inquiries count to it's respeacted domain view" }, { status: 500 });


    }
}