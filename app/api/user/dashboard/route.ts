import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { userSession } from "@/lib/jwt";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(customParseFormat);

 

export async function GET(request: Request) {
    try {


        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

 
        
     

        const today = dayjs();
        const startOfDay = dayjs().utc().startOf("day").toDate();
        const endOfDay = dayjs().utc().endOf("day").toDate();

        const domainId = await prisma.User.findUnique({
           where : { id : userId },
            select: { domain: true }
        });

        if (!domainId) throw new Error("User not found");

        const domainResponses = await prisma.DomainResponse.findMany({
            where: { domain_id: domainId.domain, status: 1 },
            select: { id: true }
        });

        const followInquiryIds = domainResponses.map((d: any) => d.id);

        const followups = await prisma.followup.findMany({
            where: {
                inquiryID: { in: followInquiryIds },
                inquiry: {
                    status: 1
                }
            },
            distinct: ["inquiryID"],
            orderBy: {
                createdAt: "desc"
            },
            select: { date: true, followUpStatus: true, inquiryID: true },
        });

        const totalInquiry = followInquiryIds.length;
        const todayFollowup = followups.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isSame(today, "day")).length;
        const upComing = followups.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isAfter(today, "day")).length;
        const pending = followups.filter((f: any) => f.date && dayjs(f.date, "DD-MM-YYYY").isBefore(today, "day")).length;

        const todayActivity = await prisma.followup.findMany({
            where: {
                inquiryID: { in: followInquiryIds },
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                inquiry: {
                    status: 1
                }
            }

        });

        const totalTodayActivityCount = todayActivity.length;

        const [notInterested, closed] = await Promise.all([

            prisma.DomainResponse.count({
                where: { id: { in: followInquiryIds }, followUpStatus: "Not Interested" }
            }),

            prisma.DomainResponse.count({
                where: { id: { in: followInquiryIds }, followUpStatus: "Closed" }
            }),
        ]);

        return NextResponse.json({ totalInquiry, todayFollowup, upComing, pending, notInterested, closed, totalTodayActivityCount });

    } catch (error: any) {
        logger.error({ error: error.message }, "Failed to get count of inquiries");
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}