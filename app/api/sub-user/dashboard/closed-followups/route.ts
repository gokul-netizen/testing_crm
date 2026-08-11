import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



 

export async function GET(req: Request ) {
    try {
        const decoded = await userSession();
                const userId = decoded?.id;
                const userType = decoded?.userType;

        const closedFollowups = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                inquiryDomain: {
                    select: {
                        id: true,
                        domainResponse: {
                            where: {

                                followUpStatus: "Closed",
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

                                    distinct: ["inquiryID"],
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
                        }
                    }
                }
            }
        });

         

        return NextResponse.json(closedFollowups, { status: 200 });
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