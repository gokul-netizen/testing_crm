import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { userSession } from "@/lib/jwt";

dayjs.extend(customParseFormat);



interface ParamsProps {
    user_id: string;
}

export async function GET(req: Request, { params }: { params: Promise<ParamsProps> }) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

        const today = dayjs().format("DD-MM-YYYY");

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

        const followups = await prisma.followup.findMany({
            where: {
                inquiryID: { in: followInquiryIds },
                inquiry: {
                    status: 1,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            distinct: ["inquiryID"],
            select: {
                date: true,
                time: true,
                remarks: true,
                assignToName: true,
                followUpStatus: true,
                createdAt: true,
                isPublic: true,
                addedBy: true,
                inquiry: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        createdAt: true,
                        companyName: true,

                    }
                }
            }
        });

        const todaysfollowup = followups
            .filter((item: any) => {
                if (!item.date) return false;
                return item.date === today;
            })
            .sort((a: any, b: any) => {
                const timeA = dayjs(a.time, "h:mm A");
                const timeB = dayjs(b.time, "h:mm A");

                return timeA.diff(timeB);
            });



        return NextResponse.json({ todaysfollowup }, { status: 200 });
    } catch (error: any) {
        logger.error("Error when getting count of todays inquiries ", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}