import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { NextResponse } from "next/server";

dayjs.extend(customParseFormat);



export async function GET(request: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const today = dayjs();

        const domainResponses = await prisma.user.findUnique({
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

        const followInquiryIds = domainResponses.inquiryDomain.domainResponse.map((item: any) => item.id);

        const followups = await prisma.followup.findMany({
            where: {

                inquiryID: { in: followInquiryIds },
                inquiry: { status: 1 }
            },
            distinct: ["inquiryID"],
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                date: true,
                time: true,
                remarks: true,
                followUpStatus: true,
                assignToName: true,
                createdAt: true,
                inquiry: { select: { id: true, name: true, phone: true } }
            }
        });

        const pending = followups.filter((f: { date: string }) => f.date && dayjs(f.date, "DD-MM-YYYY").isBefore(today, "day"));
        const todayFollowup = followups.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isSame(today, "day"));

        const totalInquiry = [...pending, ...todayFollowup];

        return NextResponse.json({ data: totalInquiry, message: "Successfully fetch data" }, { status: 200 });

    } catch (error: any) {
        logger.error(error.message);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}