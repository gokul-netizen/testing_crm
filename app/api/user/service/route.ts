import { getCurrentUTCFromIST } from "@/lib/date-time";
import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";





export async function POST(req: Request) {
    try {


        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const body = await req.json();
        const { service, status } = body;

        if (!service) return NextResponse.json({ error: "service is required" }, { status: 400 });

        const domainId = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                domain: true
            }
        });


        const exist = await prisma.service.findFirst({
            where: {
                service: service,
                domainId: domainId.domain
            }
        });

        if (exist) return NextResponse.json({ error: "service already exist" }, { status: 400 });

        await prisma.service.create({
            data: {
                service: service,
                status,
                createdAt: getCurrentUTCFromIST(),
                domainId: domainId.domain
            }
        });

        return NextResponse.json({ message: "Added service" }, { status: 200 });

    } catch (error: any) {
        logger.error({
            message : "Error when creating new service app/api/user/service",
            error : error.message
        });
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}



export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const service = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                inquiryDomain: {
                    select: {
                        domainName: true,
                        service: {
                            select: {
                                id: true,
                                service: true,
                                status: true,
                                createdAt: true,
                                domainId: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(service, { status: 200 });
    } catch (error: any) {
        logger.error({
            message : "Error when fetching service app/api/user/service",
            error : error.message
        });
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}