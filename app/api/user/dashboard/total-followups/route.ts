import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

        const followups = await prisma.User.findUnique({
            where: { id: userId, status: "Active" },
            select: {

                id: true,
                domain: true,
                inquiryDomain: {
                    where: {
                        status: "Active"
                    },
                    select: {
                        id: true,
                        domainName: true,

                        domainResponse: {
                            where: { status: 1 },
                            select: {
                                id: true,
                                name: true,
                                companyName: true,
                                phone: true,
                                followUpStatus: true,
                                domain_id: true,
                                createdAt: true,
                                service: true,
                                phoneSecondary: true,
                                response: true,

                                followups: {
                                    select: {
                                        date: true,
                                        time: true,
                                        createdAt: true,
                                        remarks: true,
                                        assignToName: true,
                                        followUpStatus: true,
                                        addedByUser: {
                                            select: {
                                                name: true,
                                            },
                                        }
                                    },
                                    orderBy: {
                                        createdAt: "desc"
                                    }
                                },

                                assigns: {
                                    select: {
                                        assignDate: true,
                                        assignTime: true,
                                        createdAt: true,
                                        remarks: true
                                    },
                                    orderBy: {
                                        createdAt: "desc"
                                    }
                                }
                            }

                        }
                    }

                }
            }
        });


        const inquiries = followups.inquiryDomain.domainResponse;

        return NextResponse.json(inquiries, { status: 200 })


    } catch (error: any) {
        logger.error({

            message: "Fail to get total followups ",
            file: "api/user/dashboard/total-followups/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
