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
        const today = dayjs();

        const domainId = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                domain: true,
            },
        });



        if (!domainId) {
            throw new Error(" Not Found");
        }

        const inquiryIds = await prisma.domainResponse.findMany({
            where: {
                status: 1,
                domain_id: domainId.domain,
                OR: [
                    { assignId: Number(userId) },
                    {
                        AND: [
                            { assignId: null },
                            { addedBy: String(userId) }
                        ]
                    }
                ]
            },
            select: { id: true },
        });

        const followInquiryIds = inquiryIds.map((item: any) => item.id);

        const upcomingRaw = await prisma.followup.findMany({

            where: { inquiryID: { in: followInquiryIds } },

            distinct: ["inquiryID"],
            orderBy: {
                createdAt: "desc"
            },

            select: {
                date: true,
                time: true,
                remarks: true,
                followUpStatus: true,
                createdAt: true,
                assignToName: true,
                isPublic: true,
                addedBy: true,
                inquiry: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                        phone: true,
                        createdAt: true,

                    }
                }
            }
        });

        const upcoming = upcomingRaw
            .filter((item: any) => {
                if (!item.date) return false;

                const itemDate = dayjs(item.date, "DD-MM-YYYY");

                if (!itemDate.isValid()) return false;

                return itemDate.isAfter(today, "day");
            }).sort((a: any, b: any) => {
                const dateA = dayjs(a.date, "DD-MM-YYYY");
                const dateB = dayjs(b.date, "DD-MM-YYYY");

                return dateA.valueOf() - dateB.valueOf();
            });

        return NextResponse.json({ upcoming }, { status: 200 })

    } catch (error: any) {
        logger.error("Error when getting count of inquiries in sub user", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}