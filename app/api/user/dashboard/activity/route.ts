import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { userSession } from "@/lib/jwt";

dayjs.extend(utc);
dayjs.extend(timezone);



 

export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;
        const startOfDay = dayjs().utc().startOf("day").toDate();
        const endOfDay = dayjs().utc().endOf("day").toDate();

        const user = await prisma.user.findUnique({
            where: { id: userId },

            include: {
                inquiryDomain: {
                    include: {
                        domainResponse: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        const inquiryIds = user.inquiryDomain.domainResponse.map((item: any) => item.id);

        const todaysActivity = await prisma.followup.findMany({
            where: {
                inquiryID: { in: inquiryIds },
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                inquiry: {
                    status: 1
                }
            },
            orderBy: {
                createdAt: "desc",
            },

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
                        email: true,
                        phone: true,
                    }
                },
            },
        });

        return NextResponse.json({ data: todaysActivity, message: "Successfully fetched data's of today's activity" }, { status: 200 })


    } catch (error: any) {
        logger.error({

            message: "Fail to get activity followups ",
            file: "api/user/dashboard/activity-followups/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
        return NextResponse.json({ message: "Failed to fetch data's of today's activity" }, { status: 500 })
    }
}