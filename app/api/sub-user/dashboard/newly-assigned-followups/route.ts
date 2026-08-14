import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { userSession } from "@/lib/jwt";
dayjs.extend(customParseFormat);



export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

        const newlyassignedFollowups = await prisma.user.findUnique({
            where: {
                id: userId,
                status: "Active",
            },
            select: {
                inquiryDomain: {
                    select: {
                        id: true,
                        domainName: true,

                        domainResponse: {
                            where: {
                                status: 1,
                                assignId: userId,
                                followUpStatus: "Assign To",
                            },
                            select: {
                                id: true,
                                name: true,
                                companyName: true,
                                email: true,
                                phone: true,
                                createdAt: true,

                                followups: {
                                    take : 1,
                                    orderBy: {
                                        createdAt: "desc"
                                    },

                                    select: {
                                        id: true,
                                        followUpStatus: true,
                                        createdAt: true,
                                        assignToName: true,
                                        addedBy: true,
                                        isPublic: true,
                                        remarks: true,
                                        time: true,
                                        date: true,
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });

        const data = newlyassignedFollowups?.inquiryDomain?.domainResponse;

        return NextResponse.json({ data }, { status: 200 });

    } catch (error: any) {
        
        logger.error({

            message: "Fail to get newly assigned followups ",
            file: "api/sub-user/dashboard/assigned-followups/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}