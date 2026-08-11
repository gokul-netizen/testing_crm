
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { userSession } from "@/lib/jwt";

dayjs.extend(customParseFormat);

export async function GET(req: Request ) {


    let todayFollowup = 0;
    let upcoming = 0;
    let pending = 0;
    let notInterested = 0;
    let closed = 0;
    let totalInquiries = 0;


    const decoded = await userSession();
    const userId = decoded?.id;
    const userType = decoded?.userType;
    const today = dayjs();


    try {


        const follows = await prisma.user.findUnique({
            where: {
                id: userId,
                emailTriggerOption: "Yes",
                status: "Active",
                type: userType
            },
            select: {
                id: true,
                username: true,
                name: true,
                mobile_no: true,
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true,

                        domainResponse: {
                            where: {
                                status: 1,
                                OR: [
                                    { assignId: userId },
                                    {
                                        AND: [
                                            { assignId: null },
                                            { addedBy: String(userId) }
                                        ]
                                    }
                                ]
                            },
                            select: {
                                id: true,

                                followups: {
                                    distinct: ["inquiryID"],
                                    orderBy: {
                                        createdAt: "desc"
                                    },

                                    select: {
                                        id: true,
                                        date: true,
                                        time: true,
                                        followUpStatus: true,

                                    }
                                }
                            }
                        }
                    }
                }
            },
        });


        for (const domainResponse of follows.inquiryDomain.domainResponse) {

            totalInquiries += domainResponse.followups.length;

            for (const followup of domainResponse.followups) {

                if (followup.followUpStatus === "Not Interested") {
                    notInterested++;
                }

                if (followup.followUpStatus === "Closed") {
                    closed++;
                }

                if (!followup.date) continue;

                const date = dayjs(followup.date, "DD-MM-YYYY");

                if (date.isSame(today, "day")) {
                    todayFollowup++;
                } else if (date.isAfter(today, "day")) {
                    upcoming++;
                } else if (date.isBefore(today, "day")) {
                    pending++;
                }

            }
        }


        const assigned = await prisma.user.findUnique({
            where: {
                id: userId,
                emailTriggerOption: "Yes",
                status: "Active",
                type: "User"
            },
            select: {
                id: true,
                username: true,
                name: true,
                mobile_no: true,
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true,

                        domainResponse: {
                            where: {
                                status: 1,
                                addedBy: String(userId),
                                assignId: {
                                    not: null,
                                },
                            },
                            select: {
                                id: true,

                                followups: {
                                    distinct: ["inquiryID"],
                                    orderBy: {
                                        createdAt: "desc"
                                    },

                                    select: {
                                        id: true,
                                        followUpStatus: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });



        const assign = assigned?.inquiryDomain?.domainResponse?.length ?? 0;


        return NextResponse.json({
            totalInquiries,
            todayFollowup,
            upcoming,
            pending,
            notInterested,
            closed,
            assign

        }, { status: 200 });

    } catch (error: any) {

        logger.error({
            
            message: "Fail to get dashboard counts",
            file: "api/sub-user/dashboard/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });


        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}