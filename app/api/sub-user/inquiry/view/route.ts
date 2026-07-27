import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {
        
        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;

        const domainID = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            },
            select: { domain: true }
        });

        if (!domainID) {
            return NextResponse.json({ message: "Not Found" }, { status: 400 });
        }

        const domainNames = await prisma.InquiryDomain.findMany({
            where: {
                id: domainID.domain
            },
            select: {
                id: true,
                domainName: true,
                _count: {
                    select: {
                        domainResponse: {
                            where: {
                                OR: [
                                    {
                                        assigns: {
                                            some: {
                                                assignTo: Number(userId),
                                            }
                                        }
                                    },
                                    {
                                        addedBy: String(userId),
                                    }
                                ]
                            }
                        }
                    }
                }
            },
        });


        return NextResponse.json(domainNames);

    } catch (error: any) {
        logger.error(error.message, "Internal server error during inquiry processing");
        return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
    }
}