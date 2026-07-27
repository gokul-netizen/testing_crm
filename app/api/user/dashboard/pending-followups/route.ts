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
        const userType = decoded?.userType;


        const today = dayjs();


        const domainId = await prisma.User.findUnique({
            where: { id: userId },
            select: { domain: true }
        });

        if (!domainId) throw new Error("User not found");


        const domainResponses = await prisma.DomainResponse.findMany({
            where: { domain_id: domainId.domain },
            select: { id: true }
        });

        const followInquiryIds = domainResponses.map((d: { id: number }) => d.id);

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
                addedByUser: {
                    select: {
                        name: true,
                    },
                },
                inquiry: { select: { id: true, name: true, companyName: true, phone: true } }
            }
        });


        const pending = followups.filter((f: { date: string }) => f.date && dayjs(f.date, "DD-MM-YYYY").isBefore(today, "day"));

        return NextResponse.json(pending);

    } catch (error: any) {
        logger.error(error.message);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}