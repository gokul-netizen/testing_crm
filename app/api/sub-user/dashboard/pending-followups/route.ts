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
            where: { id: userId },
            select: {
                id: true,
                domain: true,
            },
        });

        if (!domainId) {
            throw new Error("Not Found");
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


        const pendingRaw = await prisma.followup.findMany({
            where: {
                inquiryID: { in: followInquiryIds },

                inquiry: {
                    status: 1,
                },
            },

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
                        phone: true,
                        companyName: true,
                        createdAt: true,
                    },
                },
            },
        });


        const pending = pendingRaw
            .filter((item: any) => {
                if (!item.date) return false;

                const itemDate = dayjs(item.date, "DD-MM-YYYY");

                if (!itemDate.isValid()) return false;

                return itemDate.isBefore(today, "day");
            })
            .sort((a: any, b: any) => {
                const dateA = dayjs(a.date, "DD-MM-YYYY");
                const dateB = dayjs(b.date, "DD-MM-YYYY");

                return dateA.diff(dateB);
            });

        return NextResponse.json({ pending }, { status: 200 });

    } catch (error: any) {
        logger.error(
            "Error when getting pending followups for sub user",
            error
        );

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}