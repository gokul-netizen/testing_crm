import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
    try {


        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

        const today = dayjs().format("DD-MM-YYYY");

        const user_id = Number(userId);

        const domainId = await prisma.User.findUnique({
            where: {
                id: user_id
            },
            select: {
                domain: true
            }
        });

        const domainResponse = await prisma.DomainResponse.findMany({
            where: {
                domain_id: domainId.domain,
            },
            select: {
                id: true,
            }
        });

        const domainResponseIds = domainResponse.map((d: any) => d.id);

        const allLatestFollowups = await prisma.followup.findMany({
            where: {

                inquiryID: { in: domainResponseIds },
                inquiry: {
                    status: 1
                }
            },
            orderBy: {
                createdAt: "desc",
            },
            distinct: ["inquiryID"],
            select: {
                id: true,
                date: true,
                time: true,
                remarks: true,
                followUpStatus: true,
                assignToName: true,
                createdAt: true,
                addedByUser: {
                    select: {
                        name: true,
                    },
                },
                inquiry: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                        phone: true,
                    }
                },
            },
        });
        const todaysInquiry = allLatestFollowups.filter((f: any) => f.date === today);

        return NextResponse.json(todaysInquiry)

    } catch (error: any) {
        logger.error({

            message: "Fail to get todays followups ",
            file: "api/user/dashboard/todays-followups/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}