import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {
        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

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

        const notInterested = await prisma.domainResponse.findMany({
            where: {
                domain_id: domainId.domain,
                status: 1,
                followUpStatus: "Not Interested",
                OR: [
                    { assignId: userId },
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
                companyName: true,
                phone: true,
                followUpStatus: true,
                followups: {
                    where: {
                        followUpStatus: "Not Interested",
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        remarks: true,
                        createdAt: true,
                        isPublic: true,
                        addedBy: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })


        return NextResponse.json(notInterested, { status: 200 });
    } catch (error: any) {
        logger.error("Error when getting count of inquiries in sub user", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}