import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.userType;


        const result = await prisma.inquiryDomain.findMany({
            where: {
                users: {
                    some: {
                        id: userId
                    }
                }
            },
            select: {
                id: true,
                domainName: true,
                _count: {
                    select: {
                        domainResponse: {
                            where: {
                                status: 1
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(result)

    } catch (error: any) {
        logger.error("API Error:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


