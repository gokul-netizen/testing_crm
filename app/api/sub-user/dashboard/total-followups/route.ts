import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;


        const followups = await prisma.user.findUnique({
            where: {
                id: userId,
                status: "Active"
            },

            select: {
                id: true,
                domain: true,
                inquiryDomain: {

                    where: {
                        status: "Active",
                    },

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
                            orderBy: {
                                createdAt: "desc"
                            },
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                service: true,
                                companyName: true,
                                createdAt: true,
                                followUpStatus: true,
                                assigns: {
                                    orderBy: { createdAt: "desc" },
                                    take: 1,
                                    select: {
                                        assignDate: true,
                                        assignTime: true,
                                        remarks: true,
                                    }
                                },

                                followups: {
                                    orderBy: { createdAt: "desc" },
                                    take: 1,
                                    select: {
                                        date: true,
                                        time: true,
                                        remarks: true,
                                        createdAt: true,
                                        assignToName: true,
                                        isPublic: true,
                                        addedBy: true,
                                    }
                                }

                            },
                        }
                    }
                }

            }
        });

        const totalInquiries = followups.inquiryDomain.domainResponse;

        return NextResponse.json(totalInquiries, { status: 200 })
    } catch (error: any) {

        logger.error({

            message: "Fail to get total followups ",
            file: "api/sub-user/dashboard/total-followups/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}