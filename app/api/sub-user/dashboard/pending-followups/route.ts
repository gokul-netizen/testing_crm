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

        const today = dayjs();

        const userDomain = await prisma.user.findUnique({
            where: { id: userId },
            select: { domain: true },
        });


        const inquiries = await prisma.domainResponse.findMany({
            where: {
                status: 1,
                domain_id: userDomain.domain,
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
            select: {
                id: true,
                name: true,
                phone: true,
                createdAt: true,
                companyName: true,
                followups: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        date: true,
                        time: true,
                        remarks: true,
                        assignToName: true,
                        followUpStatus: true,
                        createdAt: true,
                        isPublic: true,
                        addedBy: true,
                    }
                }
            }
        });


        const pending = inquiries
            .map((inquiry: any) => {
                const latestFollowup = inquiry.followups[0];
                if (!latestFollowup) return null;

                return {
                    id: inquiry.id,
                    inquiryID: inquiry.id,
                    date: latestFollowup.date,
                    time: latestFollowup.time,
                    remarks: latestFollowup.remarks,
                    assignToName: latestFollowup.assignToName,
                    followUpStatus: latestFollowup.followUpStatus,
                    createdAt: latestFollowup.createdAt,
                    isPublic: latestFollowup.isPublic,
                    addedBy: latestFollowup.addedBy,
                    inquiry: {
                        id: inquiry.id,
                        name: inquiry.name,
                        phone: inquiry.phone,
                        createdAt: inquiry.createdAt,
                        companyName: inquiry.companyName,
                    }
                };
            })
            .filter((item: any): item is NonNullable<typeof item> => {
                if (!item || !item.date) return false;
                const itemDate = dayjs(item.date, "DD-MM-YYYY");
                return itemDate.isValid() && itemDate.isBefore(today, "day");
            })
            .sort((a: any, b: any) => {
                const dateA = dayjs(a.date, "DD-MM-YYYY");
                const dateB = dayjs(b.date, "DD-MM-YYYY");
                return dateA.diff(dateB);
            });

        return NextResponse.json({ pending }, { status: 200 });

    } catch (error: any) {
        logger.error("Error when getting pending followups for sub user", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}