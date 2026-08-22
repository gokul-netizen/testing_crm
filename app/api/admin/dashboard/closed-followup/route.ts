import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {
        const closed = await prisma.followup.findMany({
            where: {
                inquiry: {
                    status: 1,
                },
                followUpStatus: "Closed",
            },
            distinct: ["inquiryID"],
            orderBy: {
                createdAt: "desc"
            },

            select: {
                date: true,
                time: true,
                remarks: true,
                followUpStatus: true,
                createdAt: true,
                assignToName: true,

                addedByUser: {
                    select: {
                        id: true,
                        name: true,
                    }
                },


                inquiry: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        companyName: true,
                        createdAt: true,
                        domain: {
                            select: {
                                id: true,
                                domainName: true,

                            }
                        }
                    },
                },
            },
        });

        return NextResponse.json(closed, { status: 200 })
    } catch (error: any) {


        logger.error({
            message: "Fail to fetch closed follwup",
            file: "api/admin/dashboard/closed/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json({ error: error.message })
    }
}