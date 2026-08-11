import { userSession } from "@/lib/jwt";
import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {

        const decoded = await userSession();
        const userId = decoded?.id;
        const userType = decoded?.usertype;

        const domainId = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                domain: true
            }
        })

        const userList = await prisma.user.findMany({
            where: {
                id: { not: userId },
                domain: domainId.domain,
            },
            select: {
                added_by: true,
                id: true,
                name: true,
                type: true,
                domain: true,
                inquiryDomain: {
                    select: {
                        domainName: true,
                    }
                }
            }
        });

        return NextResponse.json(
            { members: userList },
            { status: 200 }
        );

    } catch (error) {

         logger.error({
            
            message: "Fail to get assign names",
            file: "api/sub-user/assign-names/route.ts",
            method: req.method,
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,

        });
        
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}