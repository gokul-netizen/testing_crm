import logger from "@/lib/logs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const activeDomain = await prisma.user.findMany({
            where: {
                status: "Active",
                isDeleted : false,
                type : "AdminUser"
                 
            },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                domain: true,
                added_on : true,
                inquiryDomain : {
                    select : {
                        domainName : true
                    }
                }
            },
            orderBy: {
                added_on: "desc",
            },
        });

        return NextResponse.json(activeDomain, { status: 200 })
    } catch (error: any) {
        logger.error({error : error.message} , "Failed in getting users")
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}