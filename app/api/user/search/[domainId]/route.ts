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
        };

        if (fromDate && toDate) {
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
            select: {
                id: true,
                name: true,
                companyName: true,
                phone: true,
                followUpStatus: true,
                createdAt: true,
                service: true,

                followups: {
                    select: {
                        date: true,
                        time: true,
                        createdAt: true,
                        remarks: true,
                        assignToName: true,
                        followUpStatus: true,
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                assigns: {
                    select: {
                        assignDate: true,
                        assignTime: true,
                        createdAt: true,
                        remarks: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }

            },
        });

        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        
        logger.error({

            message: "Fail to search the inquiry",
            file: "api/user/search/[domainId]/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



