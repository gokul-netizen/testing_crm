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
            where: {
                id: userId,
                status: "Active"
            },
            select: {
                id: true,

                inquiryDomain: {
                    where: {
                        status: "Active",
                    },
                    select: {
                        id: true,
                        domainName: true,

                        domainResponse: {
                            where: {
                                followUpStatus: "Not Interested"
                            },
                            select: {
                                id: true,
                                name: true,
                                companyName: true,
                                phone: true,
                                followUpStatus: true,
                                followups: {
                                    select: {
                                        remarks: true,
                                        createdAt: true,
                                        addedByUser: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        createdAt: "desc"
                                    },
                                    take: 1
                                }

                            }
                        }

                    }
                }

            }
        });


        const notInterested = followups.inquiryDomain.domainResponse;

        return NextResponse.json(notInterested);

    } catch (error: any) {
        logger.error({

            message: "Fail to get not interested followups ",
            file: "api/user/dashboard/notInterested-followups/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}