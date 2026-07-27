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


        const assignedFollowups = await prisma.user.findUnique({
            where: {
                id: userId,
                status: "Active",
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
                                name: true,
                                companyName: true,
                                email: true,
                                phone: true,
                                createdAt: true,

                                followups: {
                                    distinct: ["inquiryID"],
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

        const data = assignedFollowups.inquiryDomain.domainResponse;

        return NextResponse.json({ data }, { status: 200 })

    } catch (error: any) {
        logger.error("Error when getting count of inquiries in sub user", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}