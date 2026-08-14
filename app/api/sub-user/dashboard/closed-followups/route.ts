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

        const closedFollowups = await prisma.domainResponse.findMany({
            where: {

                followUpStatus: "Closed",
                status: 1,
                addedBy: String(userId)

            },
            select: {
                id: true,
                name: true,
                phone: true,
                createdAt: true,
                companyName: true,
                followups: {
                    where: {
                        followUpStatus: "Closed",
                    },

                    orderBy: {
                        createdAt: "desc",
                    },

                    take: 1,


                    select: {
                        date: true,
                        time: true,
                        remarks: true,
                        assignToName: true,
                        followUpStatus: true,
                        createdAt: true,
                        isPublic: true,
                        addedBy: true,
                        assignTo: true,
                    }
                }
            }
        });


        const sortedClosedFollowup = closedFollowups.sort((a: any, b: any) => {
            const dateA = a.followups[0]?.createdAt ? dayjs(a.followups[0].createdAt).valueOf() : 0;
            const dateB = b.followups[0]?.createdAt ? dayjs(b.followups[0].createdAt).valueOf() : 0;
            return dateB - dateA;
        });


        return NextResponse.json(sortedClosedFollowup);

    } catch (error: any) {

        logger.error({

            message: "Fail to get closed followups ",
            file: "api/sub-user/dashboard/closed-followups/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}