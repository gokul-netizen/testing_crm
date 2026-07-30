import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";


interface Props {
    params: Promise<{ domainId: string }>
}

export async function GET(req: Request, { params }: Props) {
    try {
        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const { domainId } = await params;
        const { searchParams } = new URL(req.url);

        const fromDate = searchParams.get("from");
        const toDate = searchParams.get("to");
        const field = searchParams.get("field");
        const value = searchParams.get("value");

        const where: any = {
            domain_id: Number(domainId),
            status: 1,
           addedBy: String(userId)  
        };

        if (fromDate || toDate) {
            where.createdAt = {
                gte: dayjs(fromDate).startOf("day").toDate(),
                lte: dayjs(toDate).endOf("day").toDate(),
            };
        }

        if (field && value) {
            where[field] = {
                contains: value,
                mode: "insensitive",
            };
        }

        const data = await prisma.domainResponse.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                companyName: true,
                email: true,
                name: true,
                phone: true,
                phoneSecondary: true,
                followUpStatus: true,
                createdAt: true,
                service: true,
                source: true,

                followups: {

                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        date: true,
                        time: true,
                        remarks: true,
                        createdAt: true,
                        assignToName: true,
                        followUpStatus: true,
                        isPublic: true,
                        addedBy: true,
                    }
                }
            },
        });

        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        logger.error({ error: error.message }, "Error On Search Api on sub user side");
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



